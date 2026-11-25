/**
 * Chord theory for the chord maker: diatonic chords in a key, smooth voicing
 * from one chord to the next, rhythms, and the notes a progression plays.
 *
 * Pitches are MIDI note numbers (60 = C4). A progression is four slots, one
 * bar each; a slot is a scale degree and a chord kind, or the exact notes
 * someone drew on the piano roll.
 */

export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

/** How keys are usually written, for the key picker. */
export const KEY_LABELS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"] as const;

export type Mode = "major" | "minor";

const SCALES: Record<Mode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

export type ChordKind = "triad" | "7th" | "sus2" | "sus4" | "add9";

export const CHORD_KINDS: { id: ChordKind; label: string }[] = [
  { id: "triad", label: "Triad" },
  { id: "7th", label: "7th" },
  { id: "add9", label: "add9" },
  { id: "sus2", label: "sus2" },
  { id: "sus4", label: "sus4" },
];

export type Slot = {
  degree: number;
  kind: ChordKind;
  /** Notes drawn on the roll; replaces the degree's own voicing when set. */
  custom?: number[];
};

export const BARS = 4;
export const BEATS_PER_BAR = 4;
export const TOTAL_BEATS = BARS * BEATS_PER_BAR;

/** The roll's range: C3 to C6. */
export const LOW = 48;
export const HIGH = 84;
/** Bass notes sit an octave or two under the chords. */
const BASS_LOW = 36;

const pc = (n: number) => ((n % 12) + 12) % 12;

/** Keys written with flats: F, Bb, Eb, Ab, Db major, and D, G, C, F, Bb, Eb minor. */
export const usesFlats = (key: number, mode: Mode) =>
  (mode === "major" ? [5, 10, 3, 8, 1] : [2, 7, 0, 5, 10, 3]).includes(key);

const spell = (n: number, flats: boolean) => (flats ? FLAT_NAMES : NOTE_NAMES)[pc(n)];

export const noteName = (n: number, flats = false) => `${spell(n, flats)}${Math.floor(n / 12) - 1}`;

/** Scale degree offsets (from the key) for a chord, root first. */
function chordSteps(mode: Mode, degree: number, kind: ChordKind) {
  const scale = SCALES[mode];
  const at = (i: number) => scale[(degree + i) % 7] + 12 * Math.floor((degree + i) / 7);
  switch (kind) {
    case "7th":
      return [at(0), at(2), at(4), at(6)];
    case "sus2":
      return [at(0), at(1), at(4)];
    case "sus4":
      return [at(0), at(3), at(4)];
    case "add9":
      return [at(0), at(2), at(4), at(7)];
    default:
      return [at(0), at(2), at(4)];
  }
}

/** Pitch classes of a slot's chord, root first. */
export function chordPitchClasses(key: number, mode: Mode, slot: Pick<Slot, "degree" | "kind">) {
  return chordSteps(mode, slot.degree, slot.kind).map((s) => pc(key + s));
}

/* ------------------------------------------------------------------ */
/* Names                                                               */
/* ------------------------------------------------------------------ */

/** Interval sets (from the root) and the suffix each one is written with. */
const TEMPLATES: [number[], string][] = [
  [[0, 4, 7], ""],
  [[0, 3, 7], "m"],
  [[0, 3, 6], "dim"],
  [[0, 4, 8], "aug"],
  [[0, 2, 7], "sus2"],
  [[0, 5, 7], "sus4"],
  [[0, 4, 7, 11], "maj7"],
  [[0, 3, 7, 10], "m7"],
  [[0, 4, 7, 10], "7"],
  [[0, 3, 6, 10], "m7b5"],
  [[0, 3, 6, 9], "dim7"],
  [[0, 3, 7, 11], "m(maj7)"],
  [[0, 2, 4, 7], "add9"],
  [[0, 2, 3, 7], "madd9"],
  [[0, 4, 7, 9], "6"],
  [[0, 3, 7, 9], "m6"],
  [[0, 2, 4, 7, 11], "maj9"],
  [[0, 2, 3, 7, 10], "m9"],
  [[0, 2, 4, 7, 10], "9"],
  [[0, 7], "5"],
];

/**
 * Names a set of notes, e.g. "Fm7" or "Ab/C" for an inversion. Notes that
 * don't make a chord it knows come back as null.
 */
export function chordName(notes: number[], flats = false): string | null {
  if (!notes.length) return null;
  const sorted = [...notes].sort((a, b) => a - b);
  const classes = [...new Set(sorted.map(pc))];
  const bass = pc(sorted[0]);
  // Try the bass as the root first, so root-position names win.
  const roots = [bass, ...classes.filter((c) => c !== bass)];
  for (const root of roots) {
    const set = classes.map((c) => pc(c - root)).sort((a, b) => a - b);
    const match = TEMPLATES.find(([t]) => t.length === set.length && t.every((v, i) => v === set[i]));
    if (match) {
      const name = `${spell(root, flats)}${match[1]}`;
      return root === bass ? name : `${name}/${spell(bass, flats)}`;
    }
  }
  if (classes.length === 1) return spell(bass, flats);
  return null;
}

/** A degree's chord by name, root position (e.g. "Db" or "Fm7"), whatever its voicing. */
export function degreeChordName(key: number, mode: Mode, slot: Pick<Slot, "degree" | "kind">) {
  return chordName(chordSteps(mode, slot.degree, slot.kind).map((s) => 60 + key + s), usesFlats(key, mode))!;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

/** Roman numeral for a degree's chord: upper case major, lower case minor, ° diminished. */
export function romanNumeral(key: number, mode: Mode, slot: Pick<Slot, "degree" | "kind">) {
  const [r, third, fifth] = chordSteps(mode, slot.degree, "triad");
  const minor = third - r === 3;
  const dim = minor && fifth - r === 6;
  const base = minor ? ROMAN[slot.degree].toLowerCase() : ROMAN[slot.degree];
  const suffix = slot.kind === "triad" ? "" : slot.kind === "7th" ? "7" : slot.kind;
  return `${base}${dim ? "°" : ""}${suffix}`;
}

/* ------------------------------------------------------------------ */
/* Voicing                                                             */
/* ------------------------------------------------------------------ */

/** Every inversion of the chord, in each octave that fits the roll's middle. */
function candidates(key: number, mode: Mode, slot: Slot) {
  const steps = chordSteps(mode, slot.degree, slot.kind);
  const out: number[][] = [];
  for (let inv = 0; inv < steps.length; inv++) {
    const shape = steps.map((s, i) => (i < inv ? s + 12 : s)).sort((a, b) => a - b);
    for (let oct = 3; oct <= 5; oct++) {
      const notes = shape.map((s) => 12 * (oct + 1) + key + s - 12);
      if (notes[0] >= 53 && notes[notes.length - 1] <= 79) out.push(notes);
    }
  }
  return out;
}

const centre = (notes: number[]) => notes.reduce((a, b) => a + b, 0) / notes.length;

/**
 * Notes for each slot, voice-led: every chord takes the inversion closest to
 * the one before it, starting near middle C, so the progression moves
 * smoothly instead of jumping. Drawn slots keep their own notes.
 */
export function voiceProgression(key: number, mode: Mode, slots: Slot[]): number[][] {
  let prev: number[] | null = null;
  return slots.map((slot) => {
    if (slot.custom) return (prev = [...slot.custom].sort((a, b) => a - b));
    const options = candidates(key, mode, slot);
    const target = prev ? centre(prev) : 64;
    const cost = (c: number[]) =>
      prev
        ? c.reduce((sum, n) => sum + Math.min(...prev!.map((p) => Math.abs(p - n))), 0) + Math.abs(centre(c) - target) * 0.5
        : Math.abs(centre(c) - target);
    if (!options.length) return (prev = chordSteps(mode, slot.degree, slot.kind).map((s) => 60 + key + s));
    const best = options.reduce((a, b) => (cost(b) < cost(a) ? b : a), options[0]);
    return (prev = best);
  });
}

/** The chord's root, low under the chords. */
export function bassNote(key: number, mode: Mode, slot: Slot, voiced: number[]) {
  const degreeRoot = pc(key + chordSteps(mode, slot.degree, slot.kind)[0]);
  // A drawn chord keeps its degree's root while it still has it, else its lowest note.
  const root = !slot.custom || voiced.some((n) => pc(n) === degreeRoot) ? degreeRoot : pc(Math.min(...voiced));
  return BASS_LOW + root;
}

/* ------------------------------------------------------------------ */
/* Rhythm                                                              */
/* ------------------------------------------------------------------ */

export type RhythmId = "sustain" | "halves" | "pulse" | "stabs" | "arp";

/** Hits in one bar, as [start, length] in beats. Arp plays one note per hit. */
export const RHYTHMS: { id: RhythmId; label: string; hits: [number, number][] }[] = [
  { id: "sustain", label: "Whole notes", hits: [[0, 4]] },
  { id: "halves", label: "Half notes", hits: [[0, 2], [2, 2]] },
  { id: "pulse", label: "Quarter pulse", hits: [0, 1, 2, 3].map((b) => [b, 0.9] as [number, number]) },
  { id: "stabs", label: "Syncopated stabs", hits: [[0, 1.25], [1.5, 1.25], [3, 0.9]] },
  { id: "arp", label: "Arpeggio", hits: Array.from({ length: 8 }, (_, i) => [i / 2, 0.5] as [number, number]) },
];

export type PlayedNote = { pitch: number; beat: number; dur: number; vel: number; bar: number };

export type ChordTrack = { chords: PlayedNote[]; bass: PlayedNote[] };

/** Everything a progression plays, for the roll, the player and the MIDI file. */
export function progressionNotes(
  key: number,
  mode: Mode,
  slots: Slot[],
  rhythm: RhythmId,
  withBass: boolean,
): ChordTrack {
  const voiced = voiceProgression(key, mode, slots);
  const hits = RHYTHMS.find((r) => r.id === rhythm)!.hits;
  const chords: PlayedNote[] = [];
  const bass: PlayedNote[] = [];
  voiced.forEach((notes, bar) => {
    const start = bar * BEATS_PER_BAR;
    if (!notes.length) return;
    if (rhythm === "arp") {
      // Up and back down the chord, an octave of the top note to finish.
      const up = [...notes, notes[0] + 12];
      const path = [...up, ...up.slice(1, -1).reverse()];
      hits.forEach(([b, d], i) => chords.push({ pitch: path[i % path.length], beat: start + b, dur: d, vel: i % 2 ? 78 : 92, bar }));
    } else {
      hits.forEach(([b, d], i) => {
        for (const pitch of notes) chords.push({ pitch, beat: start + b, dur: d, vel: i === 0 ? 96 : 84, bar });
      });
    }
    if (withBass) bass.push({ pitch: bassNote(key, mode, slots[bar], notes), beat: start, dur: BEATS_PER_BAR, vel: 100, bar });
  });
  return { chords, bass };
}

/* ------------------------------------------------------------------ */
/* Progressions                                                        */
/* ------------------------------------------------------------------ */

/** Well-worn four-chord progressions, as scale degrees (0 = I / i). */
export const PRESETS: Record<Mode, { name: string; degrees: number[]; kind?: ChordKind }[]> = {
  minor: [
    { name: "Dark trap", degrees: [0, 5, 2, 6] },
    { name: "Drill", degrees: [0, 3, 5, 4] },
    { name: "Epic", degrees: [0, 6, 5, 6] },
    { name: "Emotional", degrees: [5, 6, 0, 0] },
    { name: "Moody", degrees: [0, 5, 3, 4] },
    { name: "Lo-fi", degrees: [0, 3, 6, 2], kind: "7th" },
    { name: "Cinematic", degrees: [0, 2, 6, 5] },
  ],
  major: [
    { name: "Pop", degrees: [0, 4, 5, 3] },
    { name: "Sad pop", degrees: [5, 3, 0, 4] },
    { name: "Doo-wop", degrees: [0, 5, 3, 4] },
    { name: "Jazz ii–V–I", degrees: [1, 4, 0, 0], kind: "7th" },
    { name: "Uplifting", degrees: [3, 4, 2, 5] },
    { name: "RnB", degrees: [3, 2, 1, 0], kind: "7th" },
  ],
};

export const presetSlots = (degrees: number[], kind: ChordKind = "triad"): Slot[] =>
  degrees.map((degree) => ({ degree, kind }));
