"use client";

import { useEffect, useRef, useState } from "react";
import { claimPlayback, useStopOnOtherPlayback } from "@/components/AudioPreviews";
import {
  MIDI_NOTES_SRC,
  MIDI_TAIL,
  midiSampleSrc,
  type MidiNotes,
  type MidiPattern,
} from "@/lib/midi-kits";

/** Fade applied when a hit is cut short or playback is stopped. */
const FADE = 0.01;

type Voice = { id: string; master: GainNode };

/**
 * Plays MIDI patterns in the browser with the bundle's own one-shots.
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

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const loadNotes = () =>
    (notesRef.current ??= fetch(MIDI_NOTES_SRC).then((r) => {
      if (!r.ok) throw new Error("Failed to load MIDI notes");
      return r.json();
    }));

  const loadSample = (ctx: AudioContext, sample: string) => {
    let buffer = samplesRef.current.get(sample);
    if (!buffer) {
      buffer = fetch(midiSampleSrc(sample))
        .then((r) => r.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data));
      // Let a failed download be retried on the next play.
      buffer.catch(() => samplesRef.current.delete(sample));
      samplesRef.current.set(sample, buffer);
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

  const toggle = async (pattern: MidiPattern) => {
    const wasPlaying = playingId === pattern.id;
    stop();
    if (wasPlaying) return;
    claimPlayback(voiceRef);
    const request = requestRef.current;

    // The context has to be created from a user gesture to be allowed to play.
    const ctx = (ctxRef.current ??= new AudioContext());
    if (ctx.state === "suspended") void ctx.resume();
    setPlayingId(pattern.id);

    let hits, buffer;
    try {
      const notes = (await loadNotes())[pattern.id];
      hits = notes.hits;
      buffer = await loadSample(ctx, notes.sample);
    } catch {
      notesRef.current = null;
      setPlayingId((id) => (id === pattern.id ? null : id));
      return;
    }
    // Another pattern was started (or this one stopped) while loading.
    if (requestRef.current !== request) return;

    const master = ctx.createGain();
    master.connect(ctx.destination);
    const t0 = ctx.currentTime + 0.05;
    const end = t0 + pattern.duration;
    // Fade the ring-out tail, as in the offline render.
    master.gain.setValueAtTime(1, end - MIDI_TAIL);
    master.gain.linearRampToValueAtTime(0, end);

    for (const [at, semitones, gain, cut] of hits) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = 2 ** (semitones / 12);
      const amp = ctx.createGain();
      amp.gain.value = gain;
      source.connect(amp).connect(master);
      const start = t0 + at;
      source.start(start);
      if (cut !== undefined) {
        // 808s hold for the note length, then cut with a short fade.
        const fade = Math.min(FADE, cut);
        amp.gain.setValueAtTime(gain, start + cut - fade);
        amp.gain.linearRampToValueAtTime(0, start + cut);
        source.stop(start + cut);
      } else {
        source.stop(end);
      }
    }

    const voice: Voice = { id: pattern.id, master };
    voiceRef.current = voice;
    const tick = () => {
      if (voiceRef.current !== voice) return;
      const elapsed = ctx.currentTime - t0;
      if (elapsed >= pattern.duration) {
        stop();
        return;
      }
      setProgress(Math.max(0, elapsed / pattern.duration));
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  return { playingId, progress, toggle };
}
