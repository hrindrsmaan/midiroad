"use client";

import { useEffect, useRef, useState } from "react";
import { claimPlayback, useStopOnOtherPlayback } from "@/components/AudioPreviews";

/** A note to play: start and length in seconds, MIDI pitch, velocity 0–127. */
export type SynthNote = { at: number; dur: number; pitch: number; vel: number; bass?: boolean };

export type Instrument = "keys" | "pad" | "pluck";

export const INSTRUMENTS: { id: Instrument; label: string }[] = [
  { id: "keys", label: "Electric keys" },
  { id: "pad", label: "Warm pad" },
  { id: "pluck", label: "Pluck" },
];

const FADE = 0.02;
const hz = (pitch: number) => 440 * 2 ** ((pitch - 69) / 12);

type Voice = { master: GainNode; out: GainNode };

/**
 * Plays chord progressions with a small Web Audio synth (no samples to load),
 * looping until stopped. Like the beat maker's player, starting any other
 * player on the page stops this one.
 */
export function useChordPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<Voice | null>(null);
  const frameRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  // What the next scheduled cycle plays, so edits are heard on the next loop.
  const nextRef = useRef<{ notes: SynthNote[]; instrument: Instrument; loop: number } | null>(null);

  const stop = () => {
    cancelAnimationFrame(frameRef.current);
    const voice = voiceRef.current;
    const ctx = ctxRef.current;
    if (voice && ctx) {
      const now = ctx.currentTime;
      voice.master.gain.cancelScheduledValues(now);
      voice.master.gain.setValueAtTime(voice.master.gain.value, now);
      voice.master.gain.linearRampToValueAtTime(0, now + 0.08);
      setTimeout(() => voice.out.disconnect(), 200);
    }
    voiceRef.current = null;
    setPlaying(false);
    setProgress(0);
  };

  useStopOnOtherPlayback(voiceRef, stop);

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
      void ctxRef.current?.close();
    },
    [],
  );

  /** One synth note into `dest`. */
  const play = (ctx: AudioContext, dest: AudioNode, n: SynthNote, at: number, instrument: Instrument) => {
    const amp = ctx.createGain();
    const peak = (n.vel / 127) * (n.bass ? 0.32 : 0.16);
    const end = at + n.dur;
    const oscs: OscillatorNode[] = [];
    const osc = (type: OscillatorType, mult: number, detune = 0, gain = 1) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = hz(n.pitch) * mult;
      o.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = gain;
      o.connect(g);
      oscs.push(o);
      return g;
    };

    let release = 0.25;
    if (n.bass) {
      osc("sine", 1).connect(amp);
      osc("triangle", 1, 0, 0.25).connect(amp);
      amp.gain.setValueAtTime(0, at);
      amp.gain.linearRampToValueAtTime(peak, at + 0.01);
      amp.gain.setTargetAtTime(peak * 0.7, at + 0.01, 0.4);
      release = 0.12;
    } else if (instrument === "pad") {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      filter.Q.value = 0.7;
      osc("sawtooth", 1, -8, 0.5).connect(filter);
      osc("sawtooth", 1, 8, 0.5).connect(filter);
      osc("sine", 0.5, 0, 0.6).connect(filter);
      filter.connect(amp);
      const attack = Math.min(0.25, n.dur / 3);
      amp.gain.setValueAtTime(0, at);
      amp.gain.linearRampToValueAtTime(peak * 0.8, at + attack);
      release = 0.5;
    } else if (instrument === "pluck") {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 2;
      filter.frequency.setValueAtTime(4000, at);
      filter.frequency.exponentialRampToValueAtTime(500, at + 0.35);
      osc("square", 1, 0, 0.35).connect(filter);
      osc("sawtooth", 1, 5, 0.35).connect(filter);
      filter.connect(amp);
      amp.gain.setValueAtTime(0, at);
      amp.gain.linearRampToValueAtTime(peak, at + 0.004);
      amp.gain.setTargetAtTime(0.0001, at + 0.004, 0.22);
      release = 0.1;
    } else {
      // Keys: a sine with a bell-ish overtone, decaying like a Rhodes.
      osc("sine", 1).connect(amp);
      osc("sine", 2, 3, 0.18).connect(amp);
      osc("triangle", 1, -3, 0.25).connect(amp);
      amp.gain.setValueAtTime(0, at);
      amp.gain.linearRampToValueAtTime(peak, at + 0.006);
      amp.gain.setTargetAtTime(peak * 0.35, at + 0.006, 0.6);
      release = 0.3;
    }

    // Release from wherever the envelope got to.
    amp.gain.setTargetAtTime(0, end, release / 3);
    amp.connect(dest);
    for (const o of oscs) {
      o.start(at);
      o.stop(end + release + FADE);
    }
  };

  /** Starts looping `notes` (one cycle is `loop` seconds), or stops if playing. */
  const toggle = (notes: SynthNote[], instrument: Instrument, loop: number) => {
    if (voiceRef.current) {
      stop();
      return;
    }
    claimPlayback(voiceRef);
    const ctx = (ctxRef.current ??= new AudioContext());
    if (ctx.state === "suspended") void ctx.resume();

    // Master → compressor → a short stereo-ish echo for some space.
    const master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 3;
    const out = ctx.createGain();
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.28;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.22;
    const wet = ctx.createGain();
    wet.gain.value = 0.18;
    master.connect(comp).connect(out).connect(ctx.destination);
    comp.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(out);

    const voice: Voice = { master, out };
    voiceRef.current = voice;
    nextRef.current = { notes, instrument, loop };
    setPlaying(true);

    const t0 = ctx.currentTime + 0.06;
    /** Plays one cycle from `start` and returns how long it lasts. */
    const schedule = (start: number) => {
      const next = nextRef.current!;
      for (const n of next.notes) play(ctx, master, n, start + n.at, next.instrument);
      return next.loop;
    };
    let cur = { start: t0, len: schedule(t0) };
    let queued: typeof cur | null = null;

    const tick = () => {
      if (voiceRef.current !== voice) return;
      const now = ctx.currentTime;
      // Queue the next cycle shortly before this one ends.
      if (!queued && now > cur.start + cur.len - 0.3) {
        const start = cur.start + cur.len;
        queued = { start, len: schedule(start) };
      }
      if (queued && now >= queued.start) {
        cur = queued;
        queued = null;
      }
      setProgress(Math.min(1, Math.max(0, now - cur.start) / cur.len));
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  /** Changes what the loop plays from its next cycle. */
  const update = (notes: SynthNote[], instrument: Instrument, loop: number) => {
    if (voiceRef.current) nextRef.current = { notes, instrument, loop };
  };

  /** Plays one chord once, to audition it. */
  const audition = (pitches: number[], instrument: Instrument) => {
    if (voiceRef.current) return;
    const ctx = (ctxRef.current ??= new AudioContext());
    if (ctx.state === "suspended") void ctx.resume();
    const g = ctx.createGain();
    g.gain.value = 0.9;
    g.connect(ctx.destination);
    const at = ctx.currentTime + 0.02;
    for (const pitch of pitches) play(ctx, g, { at: 0, dur: 0.9, pitch, vel: 90 }, at, instrument);
    setTimeout(() => g.disconnect(), 2500);
  };

  return { playing, progress, toggle, update, audition, stop };
}
