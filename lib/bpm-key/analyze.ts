/**
 * Client-side tempo and key estimation.
 *
 * Tempo: spectral-flux onset envelope, autocorrelation, then the harmonic
 * of that pulse nearest a typical song tempo. That keeps a 120 BPM click
 * at 120, and folds eighth-note hats (a 240 BPM pulse) back to the beat.
 *
 * Key: a pitch-class histogram of spectral peaks, shifted across a few cents
 * of tuning, scored with the Krumhansl-Schmuckler major and minor profiles.
 *
 * Nothing here touches the network. The UI loads this module only after a
 * file is chosen.
 */

export type KeyMode = "major" | "minor";
export type MatchLabel = "Strong match" | "Likely" | "Best guess";

export type AnalysisProgress = {
  /** 0–1 across tempo and key, after the file has been decoded. */
  ratio: number;
  stage: "tempo" | "key";
};

export type AnalysisResult = {
  bpm: number;
  bpmLabel: MatchLabel;
  /** Half or double time when that pulse is almost as strong. */
  alternateBpm: number | null;
  alternateKind: "half time" | "double time" | null;
  /** False when the clip has no repeating hit, so the BPM is not a real reading. */
  steady: boolean;
  key: {
    name: string;
    tonic: string;
    mode: KeyMode;
    camelot: string;
    label: MatchLabel;
    /** Pearson correlation of the winning profile, about −1 to 1. */
    correlation: number;
  };
  duration: number;
};

export class AnalysisError extends Error {
  readonly code: "short" | "silent";
  constructor(code: "short" | "silent") {
    super(code);
    this.name = "AnalysisError";
    this.code = code;
  }
}

/** Same floor as MIN_DURATION_SECONDS in limits.ts. Inlined so Node tests can load this file. */
const MIN_SECONDS = 2;

const TEMPO_FFT = 1024;
const TEMPO_HOP = 512;
const KEY_FFT = 8192;
const KEY_HOP = 8192;

/** Where "the BPM" usually sits. Used only to pick an octave, not to invent a tempo. */
const TEMPO_CENTER = 130;
const MIN_BPM = 55;
const MAX_BPM = 210;

const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

/** Spelling producers expect: Db major, Eb minor, F# major, Bb minor. */
const MAJOR_NAME = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const MINOR_NAME = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];

/** Camelot wheel, index is pitch class (C = 0). A is minor, B is major. */
const CAMELOT_MAJOR = ["8B", "3B", "10B", "5B", "12B", "7B", "2B", "9B", "4B", "11B", "6B", "1B"];
const CAMELOT_MINOR = ["5A", "12A", "7A", "2A", "9A", "4A", "11A", "6A", "1A", "8A", "3A", "10A"];

const yieldNow = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** In-place radix-2 FFT. `re` and `im` must share a power-of-two length. */
export function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i];
      re[i] = re[j];
      re[j] = tr;
      const ti = im[i];
      im[i] = im[j];
      im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wlenRe = Math.cos(ang);
    const wlenIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      const half = len >> 1;
      for (let j = 0; j < half; j++) {
        const uRe = re[i + j];
        const uIm = im[i + j];
        const vRe = re[i + j + half] * wRe - im[i + j + half] * wIm;
        const vIm = re[i + j + half] * wIm + im[i + j + half] * wRe;
        re[i + j] = uRe + vRe;
        im[i + j] = uIm + vIm;
        re[i + j + half] = uRe - vRe;
        im[i + j + half] = uIm - vIm;
        const nextRe = wRe * wlenRe - wIm * wlenIm;
        wIm = wRe * wlenIm + wIm * wlenRe;
        wRe = nextRe;
      }
    }
  }
}

function hann(n: number): Float64Array {
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  return w;
}

/**
 * Halve the sample rate with a short lowpass so energy above the new Nyquist
 * doesn't fold into the pitch range the key detector reads.
 */
function decimate2(input: Float32Array): Float32Array {
  const half = 7;
  const taps = half * 2 + 1;
  const fc = 0.22;
  const h = new Float64Array(taps);
  let sum = 0;
  for (let i = 0; i < taps; i++) {
    const n = i - half;
    const sinc = n === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * n) / (Math.PI * n);
    const win = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (taps - 1));
    h[i] = sinc * win;
    sum += h[i];
  }
  for (let i = 0; i < taps; i++) h[i] /= sum;

  const outLen = Math.floor(input.length / 2);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const center = i * 2;
    let acc = 0;
    for (let k = 0; k < taps; k++) {
      const j = center + k - half;
      if (j >= 0 && j < input.length) acc += input[j] * h[k];
    }
    out[i] = acc;
  }
  return out;
}

function toAnalysisRate(input: Float32Array, sampleRate: number): { samples: Float32Array; rate: number } {
  let samples = input;
  let rate = sampleRate;
  while (rate > 24000) {
    samples = decimate2(samples);
    rate /= 2;
  }
  return { samples, rate };
}

function rmsOf(samples: Float32Array): number {
  const step = Math.max(1, Math.floor(samples.length / 80000));
  let sum = 0;
  let n = 0;
  for (let i = 0; i < samples.length; i += step) {
    sum += samples[i] * samples[i];
    n++;
  }
  return Math.sqrt(sum / Math.max(1, n));
}

async function onsetFlux(
  samples: Float32Array,
  rate: number,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<{ flux: Float32Array; frameRate: number }> {
  const frames = Math.max(0, Math.floor((samples.length - TEMPO_FFT) / TEMPO_HOP));
  const flux = new Float32Array(frames);
  const re = new Float64Array(TEMPO_FFT);
  const im = new Float64Array(TEMPO_FFT);
  const window = hann(TEMPO_FFT);
  const bins = TEMPO_FFT / 2;
  const prev = new Float64Array(bins);

  for (let frame = 0; frame < frames; frame++) {
    const offset = frame * TEMPO_HOP;
    for (let i = 0; i < TEMPO_FFT; i++) {
      re[i] = samples[offset + i] * window[i];
      im[i] = 0;
    }
    fft(re, im);
    let sum = 0;
    for (let k = 1; k < bins; k++) {
      const mag = Math.hypot(re[k], im[k]);
      const diff = mag - prev[k];
      if (diff > 0) sum += diff;
      prev[k] = mag;
    }
    flux[frame] = sum;
    if (onProgress && frame % 48 === 0) {
      onProgress({ stage: "tempo", ratio: 0.04 + 0.48 * (frame / Math.max(1, frames)) });
      await yieldNow();
    }
  }
  return { flux, frameRate: rate / TEMPO_HOP };
}

function autoCorrelation(x: Float32Array, maxLag: number): Float32Array {
  let mean = 0;
  for (let i = 0; i < x.length; i++) mean += x[i];
  mean /= Math.max(1, x.length);
  const n = x.length;
  const acf = new Float32Array(maxLag + 1);
  for (let lag = 0; lag <= maxLag; lag++) {
    let sum = 0;
    const limit = n - lag;
    for (let i = 0; i < limit; i++) sum += (x[i] - mean) * (x[i + lag] - mean);
    acf[lag] = sum / n;
  }
  const norm = acf[0] || 1;
  for (let i = 0; i < acf.length; i++) acf[i] /= norm;
  return acf;
}

function sampleAcf(acf: Float32Array, lag: number): number {
  if (!(lag >= 1) || lag >= acf.length - 1) return 0;
  const i = Math.floor(lag);
  const frac = lag - i;
  return acf[i] * (1 - frac) + acf[i + 1] * frac;
}

function refineLag(acf: Float32Array, frameRate: number, bpm: number): number {
  const guess = frameRate * (60 / bpm);
  let best = Math.round(guess);
  best = Math.min(acf.length - 2, Math.max(1, best));
  const from = Math.max(1, best - 3);
  const to = Math.min(acf.length - 2, best + 3);
  for (let lag = from; lag <= to; lag++) if (acf[lag] > acf[best]) best = lag;
  const y0 = acf[best - 1];
  const y1 = acf[best];
  const y2 = acf[best + 1];
  const denom = y0 - 2 * y1 + y2;
  let delta = 0;
  if (denom !== 0) delta = Math.max(-0.6, Math.min(0.6, (0.5 * (y0 - y2)) / denom));
  return frameRate * (60 / (best + delta));
}

type TempoPeak = { bpm: number; strength: number };

/** Peak frames in the onset envelope. Peaks closer than 50ms collapse to the louder one. */
function onsetHits(flux: Float32Array): number[] {
  let max = 0;
  for (let i = 0; i < flux.length; i++) if (flux[i] > max) max = flux[i];
  if (max <= 0) return [];
  const hits: number[] = [];
  const minGap = 2;
  for (let i = 1; i < flux.length - 1; i++) {
    if (flux[i] < max * 0.28) continue;
    if (flux[i] < flux[i - 1] || flux[i] < flux[i + 1]) continue;
    if (hits.length > 0 && i - hits[hits.length - 1] < minGap) {
      if (flux[i] > flux[hits[hits.length - 1]]) hits[hits.length - 1] = i;
      continue;
    }
    hits.push(i);
  }
  return hits;
}

function estimateTempo(flux: Float32Array, frameRate: number): {
  bpm: number;
  label: MatchLabel;
  alternateBpm: number | null;
  alternateKind: "half time" | "double time" | null;
  steady: boolean;
} {
  const maxLag = Math.min(flux.length - 2, Math.ceil(frameRate * (60 / (MIN_BPM - 5))));
  const acf = autoCorrelation(flux, Math.max(2, maxLag));
  const lagOf = (bpm: number) => frameRate * (60 / bpm);
  const acfAt = (bpm: number) => Math.max(0, sampleAcf(acf, lagOf(bpm)));

  // Onset times snap to the hop grid, so a 120 BPM click alternates 21 and 22
  // frames and autocorrelation prefers the steady two-beat lag (60 BPM).
  // Intervals between hits vote directly for a tempo, which stays on the beat.
  const hits = onsetHits(flux);
  const observations: { bpm: number; weight: number }[] = [];
  for (const stride of [1, 2, 3]) {
    const weight = 1 / stride;
    for (let i = stride; i < hits.length; i++) {
      const dt = (hits[i] - hits[i - stride]) / frameRate;
      if (dt <= 0) continue;
      const bpm = 60 / dt;
      if (bpm < MIN_BPM - 8 || bpm > MAX_BPM + 20) continue;
      observations.push({ bpm, weight });
    }
  }
  const useIntervals = observations.length >= 4;
  const sigma = 4;
  const densityAt = (bpm: number) => {
    let sum = 0;
    for (const obs of observations) {
      const d = (bpm - obs.bpm) / sigma;
      if (d > 3.5 || d < -3.5) continue;
      sum += obs.weight * Math.exp(-0.5 * d * d);
    }
    return sum;
  };

  const scoreAt = (bpm: number) => {
    const pulse = acfAt(bpm);
    if (!useIntervals) return pulse;
    return densityAt(bpm) * (0.3 + 0.7 * pulse);
  };

  const peaks: TempoPeak[] = [];
  let strongest = 0;
  for (let bpm = MIN_BPM; bpm <= MAX_BPM; bpm += 0.5) {
    const strength = scoreAt(bpm);
    if (strength > strongest) strongest = strength;
    const prev = scoreAt(bpm + 0.5);
    const next = scoreAt(bpm - 0.5);
    if (strength >= prev && strength > next && strength > 0) peaks.push({ bpm, strength });
  }
  for (let i = peaks.length - 1; i >= 0; i--) {
    if (peaks[i].strength < strongest * 0.35) peaks.splice(i, 1);
  }

  if (peaks.length === 0 || strongest < 0.08) {
    return { bpm: 0, label: "Best guess", alternateBpm: null, alternateKind: null, steady: false };
  }

  const strong = peaks.filter((peak) => peak.strength >= strongest * 0.82);
  const pool = strong.length > 0 ? strong : peaks;
  const base = pool.reduce((best, peak) => (peak.bpm > best.bpm ? peak : best));

  const series: TempoPeak[] = [];
  for (const divisor of [1, 2, 3, 4]) {
    const target = base.bpm / divisor;
    if (target < MIN_BPM || target > MAX_BPM) continue;
    let nearest: TempoPeak | null = null;
    let nearestDist = Infinity;
    for (const peak of peaks) {
      const dist = Math.abs(Math.log2(peak.bpm / target));
      if (dist < nearestDist) {
        nearest = peak;
        nearestDist = dist;
      }
    }
    if (!nearest || nearestDist > 0.06) continue;
    // A subdivision (hats) scores higher than the beat. Keep the slower harmonic
    // when it still carries a real share of the onsets, then prefer the one
    // nearer a typical song tempo.
    if (divisor > 1 && nearest.strength < base.strength * 0.4) continue;
    if (!series.some((item) => Math.abs(item.bpm - nearest.bpm) < 1)) series.push(nearest);
  }
  if (series.length === 0) series.push(base);

  const distance = (bpm: number) => Math.abs(Math.log2(bpm / TEMPO_CENTER));
  const chosen = series.reduce((best, peak) => (distance(peak.bpm) < distance(best.bpm) ? peak : best));
  // Onset times are the clock. Average the intervals that landed on this tempo
  // instead of the autocorrelation lag, which snaps to the hop grid.
  const near = observations.filter((obs) => Math.abs(Math.log2(obs.bpm / chosen.bpm)) <= 0.1);
  let bpm: number;
  if (near.length >= 3) {
    let sum = 0;
    let weight = 0;
    for (const obs of near) {
      sum += obs.bpm * obs.weight;
      weight += obs.weight;
    }
    bpm = sum / weight;
  } else {
    bpm = refineLag(acf, frameRate, chosen.bpm);
  }

  let alternate: TempoPeak | null = null;
  for (const peak of series) {
    if (Math.abs(peak.bpm - chosen.bpm) < 5) continue;
    const gap = distance(peak.bpm) - distance(chosen.bpm);
    if (gap < 0.5 && (!alternate || peak.strength > alternate.strength)) alternate = peak;
  }

  const chosenPulse = acfAt(bpm);
  const steady = chosenPulse >= 0.2 && hits.length >= 4;
  const label: MatchLabel = !steady
    ? "Best guess"
    : chosenPulse >= 0.4
      ? "Strong match"
      : "Likely";
  const alternateBpm = alternate ? refineLag(acf, frameRate, alternate.bpm) : null;
  const alternateKind = alternateBpm === null ? null : alternateBpm > bpm ? "double time" : "half time";
  return { bpm, label, alternateBpm, alternateKind, steady };
}

function pearson(a: number[], b: number[]): number {
  const n = a.length;
  let meanA = 0;
  let meanB = 0;
  for (let i = 0; i < n; i++) {
    meanA += a[i];
    meanB += b[i];
  }
  meanA /= n;
  meanB /= n;
  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}

function rotate(profile: number[], tonic: number): number[] {
  const out = new Array<number>(12);
  for (let i = 0; i < 12; i++) out[(i + tonic) % 12] = profile[i];
  return out;
}

export type KeyReading = AnalysisResult["key"];

/** Best major or minor key for a 12-bin pitch-class vector. */
export function keyFromChroma(chroma: number[]): KeyReading {
  let best: KeyReading = {
    name: "C major",
    tonic: "C",
    mode: "major",
    camelot: "8B",
    label: "Best guess",
    correlation: -Infinity,
  };
  let runnerUp = -Infinity;
  for (let tonic = 0; tonic < 12; tonic++) {
    const candidates: { mode: KeyMode; score: number }[] = [
      { mode: "major", score: pearson(chroma, rotate(MAJOR_PROFILE, tonic)) },
      { mode: "minor", score: pearson(chroma, rotate(MINOR_PROFILE, tonic)) },
    ];
    for (const candidate of candidates) {
      if (candidate.score > best.correlation) {
        runnerUp = best.correlation;
        const name = candidate.mode === "major" ? MAJOR_NAME[tonic] : MINOR_NAME[tonic];
        const camelot = candidate.mode === "major" ? CAMELOT_MAJOR[tonic] : CAMELOT_MINOR[tonic];
        best = {
          name: `${name} ${candidate.mode}`,
          tonic: name,
          mode: candidate.mode,
          camelot,
          label: "Best guess",
          correlation: candidate.score,
        };
      } else if (candidate.score > runnerUp) {
        runnerUp = candidate.score;
      }
    }
  }
  const margin = best.correlation - (Number.isFinite(runnerUp) ? runnerUp : 0);
  const label: MatchLabel =
    best.correlation >= 0.65 && margin >= 0.06 ? "Strong match" : best.correlation >= 0.5 && margin >= 0.03 ? "Likely" : "Best guess";
  return { ...best, label };
}

const HIST_BINS = 120;

function addPeak(hist: Float64Array, freq: number, weight: number) {
  if (!(freq > 0) || !(weight > 0)) return;
  const midi = 69 + 12 * Math.log2(freq / 440);
  // Center each semitone on its equal-tempered pitch. Exact C lands mid-bin,
  // and a note a few cents flat of C stays in C instead of falling into B.
  const pc = ((midi % 12) + 12) % 12;
  const x = (pc * 10 + 4.5) % HIST_BINS;
  const i0 = Math.floor(x) % HIST_BINS;
  const frac = x - Math.floor(x);
  hist[i0] += weight * (1 - frac);
  hist[(i0 + 1) % HIST_BINS] += weight * frac;
}

function foldHist(hist: Float64Array, shiftBins: number): number[] {
  const chroma = new Array<number>(12).fill(0);
  for (let i = 0; i < HIST_BINS; i++) {
    const src = (i + shiftBins + HIST_BINS) % HIST_BINS;
    chroma[Math.floor(i / 10)] += hist[src];
  }
  return chroma;
}

async function estimateKey(
  samples: Float32Array,
  rate: number,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<KeyReading> {
  const frames = Math.max(0, Math.floor((samples.length - KEY_FFT) / KEY_HOP));
  const hist = new Float64Array(HIST_BINS);
  const re = new Float64Array(KEY_FFT);
  const im = new Float64Array(KEY_FFT);
  const window = hann(KEY_FFT);
  const bins = KEY_FFT / 2;
  const binHz = rate / KEY_FFT;
  const minBin = Math.max(1, Math.floor(70 / binHz));
  const maxBin = Math.min(bins - 2, Math.floor(5000 / binHz));
  const mag = new Float64Array(bins);

  for (let frame = 0; frame < frames; frame++) {
    const offset = frame * KEY_HOP;
    let energy = 0;
    for (let i = 0; i < KEY_FFT; i++) {
      const sample = samples[offset + i];
      energy += sample * sample;
      re[i] = sample * window[i];
      im[i] = 0;
    }
    if (energy < 1e-6 * KEY_FFT) continue;
    fft(re, im);
    let maxMag = 0;
    for (let k = minBin; k <= maxBin; k++) {
      const m = Math.hypot(re[k], im[k]);
      mag[k] = m;
      if (m > maxMag) maxMag = m;
    }
    const threshold = maxMag * 0.08;
    for (let k = minBin; k <= maxBin; k++) {
      if (mag[k] < threshold || mag[k] < mag[k - 1] || mag[k] < mag[k + 1]) continue;
      const left = mag[k - 1];
      const mid = mag[k];
      const right = mag[k + 1];
      const denom = left - 2 * mid + right;
      const delta = denom === 0 ? 0 : Math.max(-0.5, Math.min(0.5, (0.5 * (left - right)) / denom));
      const freq = (k + delta) * binHz;
      addPeak(hist, freq, Math.log1p(mid));
    }
    if (onProgress && frame % 12 === 0) {
      onProgress({ stage: "key", ratio: 0.55 + 0.4 * (frame / Math.max(1, frames)) });
      await yieldNow();
    }
  }

  let best = keyFromChroma(foldHist(hist, 0));
  for (let shift = -4; shift <= 4; shift++) {
    if (shift === 0) continue;
    const reading = keyFromChroma(foldHist(hist, shift));
    // A one-bin shift can nudge boundary energy into the next key and score a
    // hair higher. Only move off A440 when the match actually improves.
    if (reading.correlation > best.correlation + 0.04) best = reading;
  }
  return best;
}

export async function analyzePcm(
  samples: Float32Array,
  sampleRate: number,
  onProgress?: (progress: AnalysisProgress) => void,
): Promise<AnalysisResult> {
  if (!(sampleRate > 0) || samples.length < sampleRate * MIN_SECONDS) throw new AnalysisError("short");
  if (rmsOf(samples) < 1e-4) throw new AnalysisError("silent");

  const prepared = toAnalysisRate(samples, sampleRate);
  const { flux, frameRate } = await onsetFlux(prepared.samples, prepared.rate, onProgress);
  const tempo = estimateTempo(flux, frameRate);
  const key = await estimateKey(prepared.samples, prepared.rate, onProgress);
  onProgress?.({ stage: "key", ratio: 1 });

  return {
    bpm: tempo.bpm,
    bpmLabel: tempo.label,
    alternateBpm: tempo.alternateBpm,
    alternateKind: tempo.alternateKind,
    steady: tempo.steady,
    key,
    duration: samples.length / sampleRate,
  };
}
