/**
 * Generates trap drum MIDI that sounds written, not random.
 *
 * Every pattern is four bars phrased A · A′ · A · fill, the way producers
 * loop a groove and vary its ends. Randomness only chooses between moves
 * that are idiomatic for the part:
 *
 * - Hi-hats: a steady 8th or 16th pulse with accents, plus rolls (doubles,
 *   triplets, sextuplets, fast ramps) that end on a beat, so they lead into
 *   the next hit. The fill bar rolls harder and sometimes pitches up.
 * - Kicks: one-half-bar rhythm cells that keep beat 3 clear for the snare.
 * - 808s: kick-style rhythm in a minor key, holding until the next note,
 *   moving between chord roots (i, VI, iv, …) with octave and fifth jumps.
 * - Full beat: kick, half-time snare, hats, and an 808 locked to the kick.
 *
 * Below ~105 BPM trap is written in half time, so the pattern is generated
 * at double the tempo and then compressed: 70 BPM sounds like 140.
 */

export type GenKind = "hihat" | "808" | "kick" | "beat";
export type DrumPart = "hihat" | "open-hat" | "kick" | "snare" | "808";

export type GenNote = {
  /** Start, in beats of the real tempo. */
  beat: number;
  /** Length in beats. */
  dur: number;
  /** Semitones from the sample's own pitch (C). */
  pitch: number;
  /** 1–127. */
  vel: number;
};

export type GenTrack = { part: DrumPart; notes: GenNote[] };

/** A style for full beats: shapes hats, kicks, snares and the 808 line. */
export type Vibe = "dark" | "rage" | "drill" | "melodic";

export type GeneratedPattern = {
  id: string;
  /** What it was generated from, so it can be re-made at another tempo or key. */
  seed: number;
  hatBase: number;
  kind: GenKind;
  vibe: Vibe;
  name: string;
  tags: string[];
  bpm: number;
  /** Key root, 0 = C. Only meaningful for 808s and full beats. */
  key: number;
  /** Length in beats of the real tempo. */
  beats: number;
  tracks: GenTrack[];
};

export const KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const GEN_KINDS: { id: GenKind; label: string; hint: string }[] = [
  { id: "hihat", label: "Hi-Hats", hint: "Rolls, triplets and pitched runs" },
  { id: "808", label: "808s", hint: "Bouncing 808 lines in key" },
  { id: "kick", label: "Kicks", hint: "Syncopated trap kick patterns" },
  { id: "beat", label: "Full Beat", hint: "Kick, snare, hats and 808 together" },
];

const BARS = 4;

/* ------------------------------------------------------------------ */
/* Randomness                                                          */
/* ------------------------------------------------------------------ */

type Rng = () => number;

/** Small seeded PRNG, so a pattern can be described by its seed. */
function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rng: Rng, items: readonly T[]) => items[Math.floor(rng() * items.length)];

function weighted<T>(rng: Rng, items: readonly [T, number][]): T {
  const total = items.reduce((n, [, w]) => n + w, 0);
  let r = rng() * total;
  for (const [item, w] of items) {
    if ((r -= w) < 0) return item;
  }
  return items[items.length - 1][0];
}

const humanize = (rng: Rng, vel: number, amount = 6) =>
  Math.max(1, Math.min(127, Math.round(vel + (rng() * 2 - 1) * amount)));

/* ------------------------------------------------------------------ */
/* Vibes                                                               */
/* ------------------------------------------------------------------ */

type VibeStyle = {
  label: string;
  /** Tempo it sounds best at. */
  bpm: number;
  /** Chance of a 16th hat pulse rather than 8ths, when a take doesn't set one. */
  sixteenths: number;
  /** How often each roll is chosen. */
  rolls: Record<RollKind, number>;
  /** Pitch climbs for big rolls, in semitones. */
  bigPitch: number[];
  /** Chance of dropping a hat before a downbeat, per bar. */
  gaps: number;
  /** Kick cells, by weight multiplier: >1 favours busier cells. */
  busy: number;
  /** Chance the 808 line uses octave jumps. */
  octaves: number;
  /** Extra weight on in-key passing notes in the 808. */
  movement: number;
  /** Longest an 808 note holds, in 16ths. */
  hold: number;
  progressions: [number[], number][];
  /** Extra snares per bar, in beats (0–4), on top of beat 3. */
  ghostSnares: (rng: Rng, bar: number) => number[];
  openHats: number;
};

export const VIBES: Record<Vibe, VibeStyle> = {
  dark: {
    label: "Dark Trap",
    bpm: 140,
    sixteenths: 0.45,
    rolls: { double: 3, triplet: 3, sixlet: 2, quad: 2 },
    bigPitch: [0, 3, 5, 7],
    gaps: 0.3,
    busy: 1,
    octaves: 0.6,
    movement: 1,
    hold: 8,
    progressions: [
      [[0, 0, 0, 0], 3],
      [[0, 8, 0, 8], 3],
      [[0, 5, 0, 8], 2],
      [[0, 8, 0, 10], 2],
      [[0, 3, 0, 8], 1],
      [[0, 0, 0, 8], 2],
    ],
    ghostSnares: (rng, bar) => (bar === 3 && rng() < 0.5 ? pick(rng, [[3.5, 3.75], [3.75], [3.25, 3.75]]) : []),
    openHats: 0.6,
  },
  rage: {
    label: "Rage",
    bpm: 160,
    sixteenths: 1,
    rolls: { double: 1, triplet: 1, sixlet: 3, quad: 4 },
    bigPitch: [5, 7, 12],
    gaps: 0.1,
    busy: 2.5,
    octaves: 1,
    movement: 0.4,
    hold: 4,
    progressions: [
      [[0, 0, 0, 0], 3],
      [[0, 0, 8, 8], 2],
      [[0, 10, 8, 7], 1],
    ],
    ghostSnares: (rng, bar) => (bar % 2 === 1 && rng() < 0.6 ? [3.75] : []),
    openHats: 0.2,
  },
  drill: {
    label: "Drill",
    bpm: 142,
    sixteenths: 0,
    rolls: { double: 1, triplet: 5, sixlet: 1, quad: 0.5 },
    bigPitch: [0, 0, 3],
    gaps: 0.8,
    busy: 0.6,
    octaves: 0.3,
    movement: 3,
    hold: 6,
    progressions: [
      [[0, 1, 0, 8], 2],
      [[0, 8, 7, 8], 2],
      [[0, 3, 1, 0], 2],
      [[0, 0, 8, 7], 2],
    ],
    // The off-beat second snare that drill bounces on.
    ghostSnares: (rng, bar) => (bar % 2 === 1 ? [pick(rng, [3.5, 3.75])] : rng() < 0.3 ? [3.75] : []),
    openHats: 0.1,
  },
  melodic: {
    label: "Melodic",
    bpm: 130,
    sixteenths: 0.2,
    rolls: { double: 3, triplet: 3, sixlet: 0.5, quad: 0.5 },
    bigPitch: [0, 3],
    gaps: 0.2,
    busy: 0.4,
    octaves: 0.3,
    movement: 0.6,
    hold: 16,
    progressions: [
      [[0, 8, 3, 10], 3],
      [[0, 5, 8, 7], 2],
      [[0, 8, 5, 7], 2],
      [[0, 3, 8, 10], 2],
    ],
    ghostSnares: (rng, bar) => (bar === 3 && rng() < 0.4 ? [3.75] : []),
    openHats: 0.8,
  },
};

export const VIBE_IDS = Object.keys(VIBES) as Vibe[];

/* ------------------------------------------------------------------ */
/* Hi-hats                                                             */
/* ------------------------------------------------------------------ */

type RollKind = "double" | "triplet" | "sixlet" | "quad";

const ROLL_LABEL: Record<RollKind, string> = {
  double: "doubles",
  triplet: "triplets",
  sixlet: "sextuplets",
  quad: "fast rolls",
};

/** Time between roll hits, in beats, for a pulse of `base` beats. */
const ROLL_DIV: Record<RollKind, (base: number) => number> = {
  double: (base) => base / 2,
  triplet: (base) => (2 * base) / 3,
  sixlet: (base) => base / 3,
  quad: (base) => base / 4,
};

type Roll = { kind: RollKind; end: number; len: number; pitchUp: number; fade: "up" | "down" };

/** One bar of hats (beats 0–4) from a base pulse and its rolls. */
function hatBar(rng: Rng, base: number, rolls: Roll[], gapBefore: number[]): GenNote[] {
  const notes: GenNote[] = [];
  const inRoll = (t: number) => rolls.some((r) => t >= r.end - r.len - 1e-6 && t < r.end - 1e-6);

  for (let t = 0; t < 4 - 1e-6; t += base) {
    if (inRoll(t) || gapBefore.some((g) => Math.abs(g - t) < 1e-6)) continue;
    const onBeat = Math.abs(t - Math.round(t)) < 1e-6;
    const onEighth = Math.abs(t * 2 - Math.round(t * 2)) < 1e-6;
    const vel = onBeat ? 108 : onEighth ? 84 : 68;
    notes.push({ beat: t, dur: base / 2, pitch: 0, vel: humanize(rng, vel) });
  }

  for (const r of rolls) {
    const div = ROLL_DIV[r.kind](base);
    const count = Math.round(r.len / div);
    const start = r.end - r.len;
    for (let i = 0; i < count; i++) {
      const f = count > 1 ? i / (count - 1) : 1;
      const vel = r.fade === "up" ? 58 + f * 46 : 100 - f * 34;
      notes.push({
        beat: start + i * div,
        dur: div / 2,
        pitch: Math.round(f * r.pitchUp),
        vel: humanize(rng, vel, 4),
      });
    }
  }
  return notes.sort((a, b) => a.beat - b.beat);
}

function makeRoll(rng: Rng, base: number, feelBpm: number, end: number, big: boolean, vibe: VibeStyle): Roll {
  // A roll faster than ~45 ms per hit smears into a buzz.
  const ok = (kind: RollKind) => (60 / feelBpm) * ROLL_DIV[kind](base) >= 0.045;
  const kind = weighted<RollKind>(rng, [
    ["double", vibe.rolls.double],
    ["triplet", vibe.rolls.triplet],
    ["sixlet", ok("sixlet") ? vibe.rolls.sixlet : 0],
    ["quad", ok("quad") ? vibe.rolls.quad * (big ? 1.5 : 0.75) : 0],
  ]);
  // Length in base steps; triplets need an even span to come out whole.
  const steps = kind === "triplet" ? (big && rng() < 0.4 ? 4 : 2) : big && rng() < 0.5 ? 2 : pick(rng, [1, 2]);
  const pitchUp = kind === "quad" || kind === "sixlet" ? (big ? pick(rng, vibe.bigPitch) : pick(rng, [0, 0, 3])) : 0;
  return { kind, end, len: steps * base, pitchUp, fade: kind === "triplet" && rng() < 0.4 ? "down" : "up" };
}

function hatPhrase(rng: Rng, feelBpm: number, base: number, vibe: VibeStyle) {
  const makeRoll_ = (end: number, big: boolean) => makeRoll(rng, base, feelBpm, end, big, vibe);
  // Where rolls land: right before beat 2, 3 or the next bar.
  const endsA = weighted<number[]>(rng, [
    [[4], 3],
    [[2], 2],
    [[2, 4], 2],
    [[3], 1],
  ]);
  const rollsA = endsA.map((e) => makeRoll_(e, false));
  // A′ keeps A's pulse but moves or swaps one roll.
  const rollsA2 = rollsA
    .map((r) => (rng() < 0.6 ? makeRoll_(r.end === 4 ? pick(rng, [4, 2]) : 4, false) : r))
    .filter((r, i, all) => all.findIndex((o) => o.end === r.end) === i);
  // Fill bar: a mid roll plus a bigger one into the loop point.
  const rollsFill = [makeRoll_(pick(rng, [2, 3]), false), makeRoll_(4, true)];
  if (rollsFill[0].end > 4 - rollsFill[1].len - 1e-6) rollsFill.shift();

  // A short breath before a downbeat now and then.
  const gap = () => (rng() < vibe.gaps ? [pick(rng, [1, 3]) - base] : []);
  const gapA = gap();
  const bars = [
    hatBar(rng, base, rollsA, gapA),
    hatBar(rng, base, rollsA2, gap()),
    hatBar(rng, base, rollsA, gapA),
    hatBar(rng, base, rollsFill, []),
  ];
  const kinds = [...new Set([...rollsA, ...rollsA2, ...rollsFill].map((r) => r.kind))];
  const pitched = [...rollsA, ...rollsA2, ...rollsFill].some((r) => r.pitchUp > 0);
  return { bars, kinds, pitched };
}

/* ------------------------------------------------------------------ */
/* Kicks and 808s                                                      */
/* ------------------------------------------------------------------ */

/**
 * Half-bar rhythm cells in 16th steps (0–7). First halves start on the
 * downbeat; second halves avoid step 0 (beat 3), where the snare lands.
 */
const FIRST_HALF: [number[], number][] = [
  [[0], 3],
  [[0, 3], 3],
  [[0, 6], 2],
  [[0, 3, 6], 3],
  [[0, 2], 1],
  [[0, 3, 5], 1],
  [[0, 7], 1],
];
const SECOND_HALF: [number[], number][] = [
  [[], 2],
  [[2], 2],
  [[3], 2],
  [[6], 2],
  [[2, 6], 2],
  [[3, 6], 2],
  [[2, 7], 1],
  [[4, 7], 1],
  [[3, 5, 6], 1],
];
const FILL_SECOND_HALF: [number[], number][] = [
  [[2, 4, 6, 7], 2],
  [[3, 5, 6, 7], 2],
  [[2, 3, 6], 2],
  [[4, 5, 6, 7], 1],
];

/** Kick onsets for four bars, in 16th steps from the start of each bar. */
function kickPhrase(rng: Rng, vibe: VibeStyle): number[][] {
  // Busier vibes lean on cells with more hits, sparser ones on fewer.
  const lean = (cells: [number[], number][]): [number[], number][] =>
    cells.map(([c, w]) => [c, w * vibe.busy ** (c.length - 1.5)]);
  const first = lean(FIRST_HALF);
  const second = lean(SECOND_HALF);
  const a = [...weighted(rng, first), ...weighted(rng, second).map((s) => s + 8)];
  const a2 = rng() < 0.5 ? [...a] : [...a.filter((s) => s < 8), ...weighted(rng, second).map((s) => s + 8)];
  const fill = [...a.filter((s) => s < 8), ...weighted(rng, FILL_SECOND_HALF).map((s) => s + 8)];
  return [a, a2, a, fill];
}

/** Folds a pitch into an octave around the sample's own pitch, -7 to +4. */
const fold = (p: number) => ((((p + 7) % 12) + 12) % 12) - 7;
const MINOR = [0, 2, 3, 5, 7, 8, 10];
/** Nudges a pitch a semitone down (or up) into the key, e.g. a 3rd over VI. */
const inKey = (p: number, key: number) => {
  const has = (q: number) => MINOR.includes((((q - key) % 12) + 12) % 12);
  return has(p) ? p : has(p + 1) ? p + 1 : p - 1;
};
/** Highest an 808 is pitched up before it turns thin and clicky. */
const MAX_808 = 14;

function bassLine(rng: Rng, phrase: number[][], key: number, beatsPerStep: number, vibe: VibeStyle): GenNote[] {
  const roots = weighted(rng, vibe.progressions);
  const octaveFlavour = rng() < vibe.octaves;
  const m = vibe.movement;
  const notes: GenNote[] = [];

  // Bars 1 and 3 share pitches, as they share rhythm.
  const barPitches = new Map<string, number[]>();
  phrase.forEach((steps, bar) => {
    const cacheKey = `${roots[bar]}|${steps.join(",")}|${bar === 3}`;
    let pitches = barPitches.get(cacheKey);
    if (!pitches) {
      pitches = steps.map((s, i) => {
        // Chord roots sit within a fifth of the sample, so VI goes down, as in trap.
        const root = fold(key + roots[bar]);
        if (i === 0) return root;
        const last = i === steps.length - 1;
        const octave = root + 12 <= MAX_808 ? root + 12 : root - 12;
        return weighted(rng, [
          [root, 6],
          [octave, octaveFlavour ? (last ? 3 : 2) : 0.5],
          [root + 7 <= MAX_808 ? root + 7 : root - 5, 1.5],
          [inKey(root + 3, key), (bar === 3 ? 1.5 : 0.5) * m],
          [inKey(root - 2, key), (bar === 3 && last ? 2 : 0.3) * m],
        ]);
      });
      barPitches.set(cacheKey, pitches);
    }
    steps.forEach((s, i) => {
      // Hold until the next note, or to the end of the bar.
      const next = i + 1 < steps.length ? steps[i + 1] : 16;
      const hold = Math.min(next - s, vibe.hold);
      notes.push({
        beat: (bar * 16 + s) * beatsPerStep,
        dur: Math.max(1, hold - 0.25) * beatsPerStep,
        pitch: pitches[i],
        vel: humanize(rng, i === 0 ? 118 : 104, 5),
      });
    });
  });
  return notes;
}

/* ------------------------------------------------------------------ */
/* Patterns                                                            */
/* ------------------------------------------------------------------ */

export function generatePattern(
  kind: GenKind,
  bpm: number,
  key: number,
  seed: number,
  hatBase?: number,
  vibeId: Vibe = "dark",
): GeneratedPattern {
  const rng = mulberry32(seed);
  const vibe = VIBES[vibeId];
  // Write slow tempos in half time: generate at double, then compress.
  const half = bpm < 105;
  const feelBpm = half ? bpm * 2 : bpm;
  const scale = half ? 0.5 : 1;
  const step = 0.25 * scale; // a 16th of the feel, in real beats
  const base = hatBase ?? (rng() < vibe.sixteenths ? 0.25 : 0.5);

  const tracks: GenTrack[] = [];
  const tags: string[] = [];

  const shift = (notes: GenNote[], bar: number) =>
    notes.map((n) => ({ ...n, beat: (bar * 4 + n.beat) * scale, dur: n.dur * scale }));

  if (kind === "hihat" || kind === "beat") {
    const { bars, kinds, pitched } = hatPhrase(rng, feelBpm, base, vibe);
    let hats = bars.flatMap((b, i) => shift(b, i));
    const opens: GenNote[] = [];
    if (kind === "beat" && rng() < vibe.openHats) {
      // An open hat on the "and" of 4 in bars 2 and 4, replacing the closed one.
      for (const bar of [1, 3]) {
        const at = (bar * 4 + 3.5) * scale;
        if (hats.some((n) => Math.abs(n.beat - at) < 1e-6 && n.pitch === 0)) {
          hats = hats.filter((n) => Math.abs(n.beat - at) > 1e-6);
          opens.push({ beat: at, dur: 0.5 * scale, pitch: 0, vel: humanize(rng, 96) });
        }
      }
    }
    tracks.push({ part: "hihat", notes: hats });
    if (opens.length) tracks.push({ part: "open-hat", notes: opens });
    if (kind === "hihat") {
      tags.push(base === 0.5 ? "8th pulse" : "16th pulse", ...kinds.map((k) => ROLL_LABEL[k]));
      if (pitched) tags.push("pitched rolls");
    } else {
      tags.push(base === 0.5 ? "8th hats" : "16th hats", pitched ? "pitched rolls" : `hat ${ROLL_LABEL[kinds[kinds.length - 1]]}`);
    }
  }

  if (kind === "kick" || kind === "808" || kind === "beat") {
    const phrase = kickPhrase(rng, vibe);
    if (kind !== "808") {
      tracks.unshift({
        part: "kick",
        notes: phrase.flatMap((steps, bar) =>
          steps.map((s, i) => ({
            beat: (bar * 16 + s) * step,
            dur: step,
            pitch: 0,
            vel: humanize(rng, i === 0 ? 120 : 108, 5),
          })),
        ),
      });
    }
    if (kind === "808" || kind === "beat") {
      tracks.push({ part: "808", notes: bassLine(rng, phrase, key, step, vibe) });
    }
    if (kind === "beat") {
      // Half-time backbeat on beat 3, plus the vibe's extra hits.
      const snares: GenNote[] = [];
      for (const bar of [0, 1, 2, 3]) {
        snares.push({ beat: (bar * 4 + 2) * scale, dur: step, pitch: 0, vel: humanize(rng, 118, 3) });
        for (const at of vibe.ghostSnares(rng, bar)) {
          const loud = vibeId === "drill" && bar % 2 === 1;
          snares.push({ beat: (bar * 4 + at) * scale, dur: step, pitch: 0, vel: humanize(rng, loud ? 104 : 70, 6) });
        }
      }
      tracks.splice(1, 0, { part: "snare", notes: snares });
    }
    const hits = phrase.reduce((n, b) => n + b.length, 0);
    if (kind === "kick") tags.push(`${hits} hits`, hits / BARS > 3.5 ? "busy" : "bouncy");
    if (kind === "808") tags.push(`${KEY_NAMES[key]} minor`, `${hits} notes`);
    if (kind === "beat") tags.unshift(`${KEY_NAMES[key]} minor`, vibe.label);
  }

  if (half) tags.push("half-time");
  const name = { hihat: "Hi-Hat", "808": "808", kick: "Kick", beat: "Beat" }[kind];

  return {
    id: `gen-${kind}-${vibeId}-${bpm}-${key}-${seed}-${base}`,
    seed,
    hatBase: base,
    kind,
    vibe: vibeId,
    name,
    tags,
    bpm,
    key,
    beats: BARS * 4 * scale,
    tracks,
  };
}

const randomSeed = () => Math.floor(Math.random() * 2 ** 31);

/** The same take at another tempo or key: same seed, same moves. */
export const retunePattern = (p: GeneratedPattern, bpm: number, key: number) =>
  generatePattern(p.kind, bpm, key, p.seed, p.hatBase, p.vibe);

/** A new pattern with the same part, tempo and key. */
export const rerollPattern = (old: GeneratedPattern) => generatePattern(old.kind, old.bpm, old.key, randomSeed(), undefined, old.vibe);

/** A fresh batch, with hats spread across 8th and 16th pulses so the three differ. */
export function generateBatch(kind: GenKind, bpm: number, key: number, count = 3, vibe: Vibe = "dark"): GeneratedPattern[] {
  // Spread hat pulses across the takes so they differ, within what the vibe allows.
  const s = VIBES[vibe].sixteenths;
  const bases =
    s === 0 || s === 1
      ? [0, 0, 0].map(() => (s === 1 ? 0.25 : 0.5))
      : [0.5, 0.25, Math.random() < s ? 0.25 : 0.5].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, i) =>
    generatePattern(kind, bpm, key, randomSeed(), bases[i % bases.length], vibe),
  );
}
