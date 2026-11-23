import { BEAT_SOUNDS, type BeatSound } from "@/lib/beat-sounds";
import { KEY_NAMES, VIBES, VIBE_IDS, generatePattern, type Vibe } from "@/lib/midi-generator";

/**
 * A beat maker beat as it is shared at /b/<id>. Beats are generated from a
 * seed, so the stored state is the generator inputs plus what the visitor
 * changed (mutes and sounds), not the notes: a few hundred bytes per beat.
 */

export const SHARE_LANES = ["hats", "snare", "kick", "808"] as const;
export type ShareLane = (typeof SHARE_LANES)[number];

/** Sounds each beat maker row can pick from (same lists as components/MidiGenerator.tsx). */
export const LANE_SOUNDS: Record<ShareLane, BeatSound[]> = {
  hats: BEAT_SOUNDS.hihat,
  snare: [...BEAT_SOUNDS.snare, ...BEAT_SOUNDS.clap],
  kick: BEAT_SOUNDS.kick,
  "808": BEAT_SOUNDS["808"],
};

export type SharedBeat = {
  v: 1;
  vibe: Vibe;
  bpm: number;
  key: number;
  seed: number;
  hatBase: 0.25 | 0.5;
  muted: ShareLane[];
  /** Sample path per row, one of LANE_SOUNDS. */
  sounds: Record<ShareLane, string>;
};

/** Largest JSON body POST /api/beats accepts. A real beat is about 300 bytes. */
export const MAX_BEAT_BYTES = 2048;

const int = (v: unknown, min: number, max: number) => Number.isInteger(v) && (v as number) >= min && (v as number) <= max;

/** The beat if every field is one the beat maker can produce, else null. Unknown fields are dropped. */
export function parseBeat(raw: unknown): SharedBeat | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const vibe = VIBE_IDS.find((v) => v === r.vibe);
  if (!vibe || !int(r.bpm, 60, 180) || !int(r.key, 0, 11) || !int(r.seed, 0, 2 ** 31)) return null;
  if (r.hatBase !== 0.25 && r.hatBase !== 0.5) return null;
  if (!Array.isArray(r.muted) || r.muted.length >= SHARE_LANES.length) return null;
  const muted = SHARE_LANES.filter((lane) => (r.muted as unknown[]).includes(lane));
  if (muted.length !== r.muted.length) return null;
  const s = (r.sounds && typeof r.sounds === "object" ? r.sounds : {}) as Record<string, unknown>;
  const sounds = {} as Record<ShareLane, string>;
  for (const lane of SHARE_LANES) {
    const src = s[lane];
    if (typeof src !== "string" || !LANE_SOUNDS[lane].some((x) => x.src === src)) return null;
    sounds[lane] = src;
  }
  return { v: 1, vibe, bpm: r.bpm as number, key: r.key as number, seed: r.seed as number, hatBase: r.hatBase, muted, sounds };
}

export const beatPattern = (b: SharedBeat) => generatePattern("beat", b.bpm, b.key, b.seed, b.hatBase, b.vibe);

/** Same beat, same sounds, same mutes. */
export const sameBeat = (a: SharedBeat, b: SharedBeat) =>
  a.vibe === b.vibe &&
  a.bpm === b.bpm &&
  a.key === b.key &&
  a.seed === b.seed &&
  a.hatBase === b.hatBase &&
  a.muted.length === b.muted.length &&
  a.muted.every((m) => b.muted.includes(m)) &&
  SHARE_LANES.every((l) => a.sounds[l] === b.sounds[l]);

export const beatTitle = (b: SharedBeat) => `${VIBES[b.vibe].label} beat · ${b.bpm} BPM · ${KEY_NAMES[b.key]} minor`;

/** The pattern genre closest to a beat maker vibe, for related pattern links. */
export const VIBE_GENRE: Record<Vibe, string> = {
  dark: "dark-trap",
  rage: "street-trap",
  drill: "drill",
  melodic: "melodic-trap",
};

export const beatPath = (id: string) => `/b/${id}`;
