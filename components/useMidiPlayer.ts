"use client";

import { useEffect, useRef, useState } from "react";
import { claimPlayback, useStopOnOtherPlayback } from "@/components/AudioPreviews";
import {
  MIDI_NOTES_SRC,
  MIDI_TAIL,
  midiSampleSrc,
  type MidiHit,
  type MidiNotes,
} from "@/lib/midi-kits";

/** One sample and the hits that play it. */
/**
 * One sample and the hits that play it. `sample` names the layer (and is
 * what muting goes by); `src` overrides the kit sample it plays.
 */
export type MidiLayer = { sample: string; src?: string; hits: MidiHit[] };

/** Anything playable: an id to track it by and its length in seconds. */
type Playable = { id: string; duration: number };

/** Fade applied when a hit is cut short or playback is stopped. */
const FADE = 0.01;

/** A playing pattern: its master fader and one fader per sample, for muting. */
type Voice = { id: string; master: GainNode; faders: Map<string, GainNode> };

/**
 * Plays MIDI patterns in the browser with the bundle's own one-shots: a
 * pattern from midi-notes.json, or given `layers` (e.g. generated ones).
 * One pattern sounds at a time, and starting any other player on the page
 * stops this one.
 */
export function useMidiPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const notesRef = useRef<Promise<MidiNotes> | null>(null);
  const samplesRef = useRef(new Map<string, Promise<AudioBuffer>>());
  const voiceRef = useRef<Voice | null>(null);
  const frameRef = useRef(0);
  // Bumped on every play/stop so a pattern that finishes loading late is dropped.
  const requestRef = useRef(0);

  // Samples kept silent, applied to what's playing and to what plays next.
  const mutedRef = useRef(new Set<string>());

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const loadNotes = () =>
    (notesRef.current ??= fetch(MIDI_NOTES_SRC).then((r) => {
      if (!r.ok) throw new Error("Failed to load MIDI notes");
      return r.json();
    }));

  const loadSample = (ctx: AudioContext, src: string) => {
    let buffer = samplesRef.current.get(src);
    if (!buffer) {
      buffer = fetch(src)
        .then((r) => r.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data));
      // Let a failed download be retried on the next play.
      buffer.catch(() => samplesRef.current.delete(src));
      samplesRef.current.set(src, buffer);
    }
    return buffer;
  };

  const stop = () => {
    requestRef.current++;
    cancelAnimationFrame(frameRef.current);
    const voice = voiceRef.current;
    if (voice && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      voice.master.gain.cancelScheduledValues(now);
      voice.master.gain.setValueAtTime(voice.master.gain.value, now);
      voice.master.gain.linearRampToValueAtTime(0, now + FADE);
      setTimeout(() => voice.master.disconnect(), 50);
    }
    voiceRef.current = null;
    setPlayingId(null);
    setProgress(0);
  };

  // Only one player on the page sounds at a time.
  useStopOnOtherPlayback(voiceRef, stop);

  // Stop playback and release audio on unmount.
  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
      void ctxRef.current?.close();
    },
    [],
  );

  /**
   * Starts `pattern`, or stops it if it is playing. With `loop` (seconds per
   * cycle) it repeats until stopped, scheduling each cycle just ahead of time.
   */
  const toggle = async (pattern: Playable, layers?: MidiLayer[], loop?: number) => {
    const wasPlaying = playingId === pattern.id;
    stop();
    if (wasPlaying) return;
    claimPlayback(voiceRef);
    const request = requestRef.current;

    // The context has to be created from a user gesture to be allowed to play.
    const ctx = (ctxRef.current ??= new AudioContext());
    if (ctx.state === "suspended") void ctx.resume();
    setPlayingId(pattern.id);

    let voices: { sample: string; hits: MidiHit[]; buffer: AudioBuffer }[];
    try {
      const resolved = layers ?? [(await loadNotes())[pattern.id]];
      voices = await Promise.all(
        resolved.map(async (l) => ({
          sample: l.sample,
          hits: l.hits,
          buffer: await loadSample(ctx, l.src ?? midiSampleSrc(l.sample)),
        })),
      );
    } catch {
      notesRef.current = null;
      setPlayingId((id) => (id === pattern.id ? null : id));
      return;
    }
    // Another pattern was started (or this one stopped) while loading.
    if (requestRef.current !== request) return;

    const master = ctx.createGain();
    master.connect(ctx.destination);
    const faders = new Map<string, GainNode>();
    const fader = (sample: string) => {
      let node = faders.get(sample);
      if (!node) {
        node = ctx.createGain();
        node.gain.value = mutedRef.current.has(sample) ? 0 : 1;
        node.connect(master);
        faders.set(sample, node);
      }
      return node;
    };
    const t0 = ctx.currentTime + 0.05;
    const end = t0 + pattern.duration;
    if (!loop) {
      // Fade the ring-out tail, as in the offline render.
      master.gain.setValueAtTime(1, end - MIDI_TAIL);
      master.gain.linearRampToValueAtTime(0, end);
    }

    const schedule = (offset: number) => {
      for (const { sample, hits, buffer } of voices) for (const [at, semitones, gain, cut] of hits) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = 2 ** (semitones / 12);
        const amp = ctx.createGain();
        amp.gain.value = gain;
        source.connect(amp).connect(fader(sample));
        const start = offset + at;
        source.start(start);
        if (cut !== undefined) {
          // 808s hold for the note length, then cut with a short fade.
          const fade = Math.min(FADE, cut);
          amp.gain.setValueAtTime(gain, start + cut - fade);
          amp.gain.linearRampToValueAtTime(0, start + cut);
          source.stop(start + cut);
        } else if (!loop) {
          source.stop(end);
        }
      }
    };
    schedule(t0);
    let cycles = 1;

    const voice: Voice = { id: pattern.id, master, faders };
    voiceRef.current = voice;
    const tick = () => {
      if (voiceRef.current !== voice) return;
      const elapsed = Math.max(0, ctx.currentTime - t0);
      if (loop) {
        // Queue the next cycle half a second before it starts.
        if (elapsed > cycles * loop - 0.5) schedule(t0 + cycles++ * loop);
        setProgress((elapsed % loop) / loop);
      } else {
        if (elapsed >= pattern.duration) {
          stop();
          return;
        }
        setProgress(elapsed / pattern.duration);
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  /** Silences these samples, live on what's playing and on anything played next. */
  const setMuted = (samples: Iterable<string>) => {
    mutedRef.current = new Set(samples);
    const voice = voiceRef.current;
    const ctx = ctxRef.current;
    if (!voice || !ctx) return;
    for (const [sample, node] of voice.faders) {
      node.gain.setTargetAtTime(mutedRef.current.has(sample) ? 0 : 1, ctx.currentTime, 0.008);
    }
  };

  return { playingId, progress, toggle, setMuted };
}
