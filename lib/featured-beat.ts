import notes from "../public/previews/midi-notes.json";
import type { MidiHit, MidiNotes } from "@/lib/midi-kits";
import { PATTERNS, type PublicPattern } from "@/lib/patterns";

/**
 * The home hero's featured beat: four real Essentials Vault patterns (one per
 * drum part) played together. They were written at 132–134 BPM, so each is
 * re-timed to one shared tempo; being MIDI, only the timing changes.
 *
 * Server-only: it reads the full notes file and hands the client just the
 * hits it needs.
 */

export const FEATURED_BPM = 133;
/** Bars of each pattern that loop. */
export const FEATURED_BARS = 2;
/** Sixteenth-note steps shown in the step grid. */
export const FEATURED_STEPS = FEATURED_BARS * 16;

const PICKS = [
  { part: "hihat", bpm: 132, label: "Hats", color: "var(--color-chart-hats)" },
  { part: "snare", bpm: 133, label: "Snare", color: "var(--color-chart-snare)" },
  { part: "kick", bpm: 133, label: "Kick", color: "var(--color-chart-kick)" },
  { part: "808", bpm: 134, label: "808", color: "var(--color-chart-bass)" },
] as const;

export type FeaturedLane = {
  label: string;
  color: string;
  /** Pattern title, e.g. "Red Room hi-hat trap". */
  title: string;
  /** Sample name, the layer's key in the player. */
  sample: string;
  /** Hits re-timed to FEATURED_BPM, inside the loop. */
  hits: MidiHit[];
  /** Sixteenth steps (0…FEATURED_STEPS-1) that have a hit. */
  steps: number[];
};

export type FeaturedBeat = {
  id: string;
  kitName: string;
  kitId: string;
  bpm: number;
  /** Seconds per loop. */
  loop: number;
  lanes: FeaturedLane[];
};

const NOTES = notes as unknown as MidiNotes;

function find(part: string, bpm: number): PublicPattern {
  const pattern = PATTERNS.find((p) => p.kitId === "essentials" && p.partId === part && p.bpm === bpm);
  if (!pattern) throw new Error(`Featured beat: no Essentials Vault ${part} at ${bpm} BPM`);
  return pattern;
}

export function featuredBeat(): FeaturedBeat {
  const step = 60 / FEATURED_BPM / 4;
  const loop = FEATURED_STEPS * step;
  const lanes = PICKS.map(({ part, bpm, label, color }) => {
    const pattern = find(part, bpm);
    const entry = NOTES[pattern.id];
    if (!entry) throw new Error(`Featured beat: no notes for ${pattern.id}`);
    const scale = bpm / FEATURED_BPM;
    const hits = entry.hits
      .map(([at, semitones, gain, cut]): MidiHit => {
        const time = at * scale;
        // Keep 808 notes from ringing past the loop.
        const held = cut === undefined ? undefined : Math.min(cut * scale, loop - time);
        return held === undefined ? [time, semitones, gain] : [time, semitones, gain, held];
      })
      .filter(([time]) => time < loop - 1e-6);
    const steps = [...new Set(hits.map(([time]) => Math.round(time / step)))].filter((s) => s < FEATURED_STEPS);
    return { label, color, title: pattern.title, sample: entry.sample, hits, steps };
  });
  return { id: "featured-beat", kitName: "Essentials Vault", kitId: "essentials", bpm: FEATURED_BPM, loop, lanes };
}
