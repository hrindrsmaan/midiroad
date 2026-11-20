import data from "./beat-sounds.json";

/**
 * One-shots the beat maker can swap between, exported from the bundle's drum
 * kit by scripts/build-beat-sounds.py. They only change what plays in the
 * browser: the downloaded MIDI plays whatever sample the producer loads.
 */
export type BeatSound = {
  id: string;
  name: string;
  src: string;
  /** Semitones that bring the sample to C (808s only), so it plays in key. */
  tune: number;
};

export type SoundGroup = { label: string; sounds: BeatSound[] };

export const BEAT_SOUNDS: Record<"hihat" | "snare" | "clap" | "kick" | "808", BeatSound[]> = data;
