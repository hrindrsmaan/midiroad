import contents from "./bundle-contents.json";
import { MIDI_KITS, MIDI_PARTS, MIDI_PATTERN_COUNT } from "./midi-kits";

/**
 * What's actually in the bundle, for page copy. Counts are generated from
 * private/midiroad.zip by scripts/render-previews.py, so the page can't
 * advertise files the download doesn't contain.
 */
export type BundleCount = { label: string; count: number };

export const DRUM_KIT_NAME: string = contents.drumKit;

export const ONE_SHOTS: BundleCount[] = contents.oneShots;
export const ONE_SHOT_COUNT = ONE_SHOTS.reduce((n, o) => n + o.count, 0);

export const MIDI_COUNTS: BundleCount[] = MIDI_PARTS.map((part) => ({
  label: part.label,
  count: part.patterns.length,
}));
export { MIDI_PATTERN_COUNT };
export const MIDI_KIT_COUNT = MIDI_KITS.length;
