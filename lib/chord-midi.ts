import {
  BARS,
  CHORD_KINDS,
  HIGH,
  KEY_LABELS,
  LOW,
  RHYTHMS,
  romanNumeral,
  type ChordTrack,
  type Mode,
  type PlayedNote,
  type RhythmId,
  type Slot,
} from "@/lib/chords";
import { PPQ, chunk, trackChunk, type Event } from "@/lib/midi-file";

/**
 * Writes a chord progression as a Standard MIDI File: a Chords track and,
 * when the bass is on, a Bass track, so a DAW splits them onto separate
 * instruments on import. Notes are written at their real pitch.
 */
export function chordsToMidi(track: ChordTrack, bpm: number): Uint8Array {
  const tempo = Math.round(60_000_000 / bpm);
  const conductor: Event[] = [
    [0, 0, [0xff, 0x51, 3, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255]],
    [0, 0, [0xff, 0x58, 4, 4, 2, 24, 8]],
  ];
  const events = (notes: PlayedNote[], channel: number): Event[] =>
    notes.flatMap((n) => {
      const on = Math.round(n.beat * PPQ);
      // A hair short, so repeated notes retrigger cleanly in every DAW.
      const off = Math.max(on + 1, Math.round((n.beat + n.dur) * PPQ) - 2);
      return [
        [on, 1, [0x90 | channel, n.pitch, n.vel]],
        [off, 0, [0x80 | channel, n.pitch, 0]],
      ] as Event[];
    });

  const tracks = [trackChunk("Chords", events(track.chords, 0))];
  if (track.bass.length) tracks.push(trackChunk("Bass", events(track.bass, 1)));
  const header = chunk("MThd", [0, 1, 0, tracks.length + 1, (PPQ >> 8) & 255, PPQ & 255]);
  return new Uint8Array([...header, ...trackChunk("MidiRoad", conductor), ...tracks.flat()]);
}

/** E.g. midiroad-chords-Fmin-90bpm-i-VI-III-VII.mid */
export function chordFileName(key: number, mode: Mode, bpm: number, numerals: string[]) {
  const k = KEY_LABELS[key].replace("#", "s") + (mode === "minor" ? "min" : "maj");
  const prog = numerals.join("-").replace(/°/g, "dim").replace(/[^A-Za-z0-9-]/g, "");
  return `midiroad-chords-${k}-${bpm}bpm-${prog}.mid`;
}

/* ------------------------------------------------------------------ */
/* What the browser sends to /api/chords                               */
/* ------------------------------------------------------------------ */

export type ChordSpec = {
  key: number;
  mode: Mode;
  bpm: number;
  rhythm: RhythmId;
  bass: boolean;
  slots: Slot[];
};

const int = (v: unknown, min: number, max: number) =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : null;

/** A progression from a request body, or null when anything in it is off. */
export function parseChordSpec(body: unknown): ChordSpec | null {
  const b = body as Record<string, unknown> | null;
  if (!b || typeof b !== "object") return null;
  const key = int(b.key, 0, 11);
  const bpm = int(b.bpm, 40, 240);
  const mode = b.mode === "major" || b.mode === "minor" ? b.mode : null;
  const rhythm = RHYTHMS.find((r) => r.id === b.rhythm)?.id;
  if (key === null || bpm === null || !mode || !rhythm || typeof b.bass !== "boolean") return null;
  if (!Array.isArray(b.slots) || b.slots.length !== BARS) return null;

  const slots: Slot[] = [];
  for (const raw of b.slots as Record<string, unknown>[]) {
    const degree = int(raw?.degree, 0, 6);
    const kind = CHORD_KINDS.find((k) => k.id === raw?.kind)?.id;
    if (degree === null || !kind) return null;
    const slot: Slot = { degree, kind };
    if (raw.custom !== undefined) {
      if (!Array.isArray(raw.custom) || raw.custom.length > 12) return null;
      const notes = raw.custom.map((n) => int(n, LOW, HIGH));
      if (notes.some((n) => n === null)) return null;
      slot.custom = [...new Set(notes as number[])];
    }
    slots.push(slot);
  }
  return { key, mode, bpm, rhythm, bass: b.bass, slots };
}

/** Roman numerals for the file name; drawn chords show as "x". */
export const specNumerals = (spec: ChordSpec) =>
  spec.slots.map((s) => (s.custom ? "x" : romanNumeral(spec.key, spec.mode, s)));
