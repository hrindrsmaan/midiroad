import assert from "node:assert/strict";
import test from "node:test";
import { analyzePcm, fft, keyFromChroma } from "../lib/bpm-key/analyze.ts";
import { BPM_KEY_DESCRIPTION } from "../lib/bpm-key/content.ts";
import { suggestFor } from "../lib/bpm-key/suggest.ts";
import { META_DESCRIPTION_LIMIT } from "../lib/meta-text.ts";

const RATE = 44100;

function clicks(bpm: number, seconds: number, subdivision = 1): Float32Array {
  const out = new Float32Array(Math.floor(seconds * RATE));
  const interval = (RATE * 60) / bpm / subdivision;
  const clickLen = Math.floor(RATE * 0.012);
  for (let t = 0; t + clickLen < out.length; t += interval) {
    const start = Math.round(t);
    for (let i = 0; i < clickLen; i++) {
      const env = Math.exp(-i / (RATE * 0.0025));
      out[start + i] += Math.sin((2 * Math.PI * 1600 * i) / RATE) * env;
    }
  }
  return out;
}

function addTone(out: Float32Array, start: number, end: number, freq: number, amp: number) {
  const attack = Math.floor(RATE * 0.02);
  const length = end - start;
  const release = Math.min(length, Math.floor(RATE * 0.06));
  for (let i = 0; i < length; i++) {
    let env = 1;
    if (i < attack) env = i / attack;
    if (i > length - release) env *= (length - i) / release;
    out[start + i] += Math.sin((2 * Math.PI * freq * i) / RATE) * amp * env;
  }
}

function addNote(out: Float32Array, start: number, end: number, midi: number, amp: number) {
  const freq = 440 * 2 ** ((midi - 69) / 12);
  addTone(out, start, end, freq, amp);
  addTone(out, start, end, freq * 2, amp * 0.4);
  addTone(out, start, end, freq * 3, amp * 0.22);
  addTone(out, start, end, freq * 4, amp * 0.1);
}

/** Equal-length block chords, roots in octave 3 and the triad in octave 4. */
function progression(chords: number[][], secondsEach: number): Float32Array {
  const out = new Float32Array(Math.floor(chords.length * secondsEach * RATE));
  chords.forEach((notes, index) => {
    const start = Math.floor(index * secondsEach * RATE);
    const end = Math.min(out.length, Math.floor((index + 1) * secondsEach * RATE));
    for (const midi of notes) addNote(out, start, end, midi, 0.16);
  });
  return out;
}

test("fft peaks on the bin of a pure sine", () => {
  const n = 64;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i++) re[i] = Math.sin((2 * Math.PI * 5 * i) / n);
  fft(re, im);
  let max = 0;
  let bin = -1;
  for (let k = 0; k < n / 2; k++) {
    const mag = Math.hypot(re[k], im[k]);
    if (mag > max) {
      max = mag;
      bin = k;
    }
  }
  assert.equal(bin, 5);
});

test("a C major triad chroma reads as C major, 8B", () => {
  const chroma = [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
  const key = keyFromChroma(chroma);
  assert.equal(key.name, "C major");
  assert.equal(key.camelot, "8B");
  assert.equal(key.mode, "major");
});

test("an A minor triad chroma reads as A minor, 8A", () => {
  const chroma = [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
  const key = keyFromChroma(chroma);
  assert.equal(key.name, "A minor");
  assert.equal(key.camelot, "8A");
});

test("120 BPM clicks come back as 120", async () => {
  const result = await analyzePcm(clicks(120, 8), RATE);
  assert.equal(Math.round(result.bpm), 120, `expected 120, got ${result.bpm}`);
  assert.equal(result.steady, true);
});

test("140 BPM clicks come back as 140", async () => {
  const result = await analyzePcm(clicks(140, 8), RATE);
  assert.equal(Math.round(result.bpm), 140, `expected 140, got ${result.bpm}`);
});

test("a slow 86 BPM click is not doubled", async () => {
  const result = await analyzePcm(clicks(86, 10), RATE);
  assert.equal(Math.round(result.bpm), 86, `expected 86, got ${result.bpm}`);
});

test("eighth-note clicks on a 100 BPM grid stay at 100", async () => {
  const result = await analyzePcm(clicks(100, 8, 2), RATE);
  assert.equal(Math.round(result.bpm), 100, `expected 100, got ${result.bpm} (alt ${result.alternateBpm})`);
});

test("a C major I–IV–V–I progression reads as C major", async () => {
  const audio = progression(
    [
      [48, 60, 64, 67],
      [53, 65, 69, 72],
      [55, 67, 71, 74],
      [48, 60, 64, 67],
    ],
    2,
  );
  const result = await analyzePcm(audio, RATE);
  assert.equal(result.key.name, "C major", `got ${result.key.name} (${result.key.correlation.toFixed(3)})`);
  assert.equal(result.key.camelot, "8B");
});

test("an A minor progression reads as A minor", async () => {
  const audio = progression(
    [
      [45, 57, 60, 64],
      [50, 62, 65, 69],
      [52, 64, 67, 71],
      [45, 57, 60, 64],
    ],
    2,
  );
  const result = await analyzePcm(audio, RATE);
  assert.equal(result.key.name, "A minor", `got ${result.key.name} (${result.key.correlation.toFixed(3)})`);
  assert.equal(result.key.camelot, "8A");
});

test("clips under two seconds and silence are rejected", async () => {
  await assert.rejects(analyzePcm(clicks(120, 1), RATE), /short/);
  await assert.rejects(analyzePcm(new Float32Array(RATE * 3), RATE), /silent/);
});

test("48 kHz audio uses the same tempo", async () => {
  const rate = 48000;
  const seconds = 8;
  const bpm = 128;
  const out = new Float32Array(Math.floor(seconds * rate));
  const interval = (rate * 60) / bpm;
  const clickLen = Math.floor(rate * 0.012);
  for (let t = 0; t + clickLen < out.length; t += interval) {
    const start = Math.round(t);
    for (let i = 0; i < clickLen; i++) {
      out[start + i] += Math.sin((2 * Math.PI * 1400 * i) / rate) * Math.exp(-i / (rate * 0.0025));
    }
  }
  const result = await analyzePcm(out, rate);
  assert.equal(Math.round(result.bpm), 128, `expected 128, got ${result.bpm}`);
});

test("suggestions follow tempo and mode and stay off checkout", () => {
  const drill = suggestFor({ bpm: 142, mode: "minor", tonic: "A", alternateBpm: null });
  assert.equal(drill.kit.href, "/kits/decoy-protocol");
  assert.equal(drill.band.href, "/midi/bpm/140-159");
  assert.equal(drill.doubledBand, null);

  const melodic = suggestFor({ bpm: 126, mode: "major", tonic: "C", alternateBpm: null });
  assert.equal(melodic.kit.href, "/kits/midnight-odyssey");
  assert.equal(melodic.band.href, "/midi/bpm/120-139");

  const half = suggestFor({ bpm: 75, mode: "minor", tonic: "D", alternateBpm: 150 });
  assert.equal(half.kit.href, "/kits/decoy-protocol");
  assert.equal(half.band.href, "/midi/bpm/under-120");
  assert.equal(half.doubledBand?.href, "/midi/bpm/140-159");
  assert.match(half.blurb, /half-time/i);

  for (const suggestion of [drill, melodic, half]) {
    assert.equal(suggestion.kit.href.includes("checkout"), false);
    assert.equal(suggestion.band.href.includes("stripe"), false);
  }
});

test("the meta description fits the snippet limit", () => {
  assert.ok(BPM_KEY_DESCRIPTION.length <= META_DESCRIPTION_LIMIT, BPM_KEY_DESCRIPTION);
});
