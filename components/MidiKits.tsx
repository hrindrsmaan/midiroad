"use client";

import { useEffect, useRef, useState } from "react";
import {
  PauseIcon,
  PlayIcon,
  Waveform,
  claimPlayback,
  useStopOnOtherPlayback,
} from "@/components/AudioPreviews";
import {
  MIDI_KITS,
  MIDI_PARTS,
  MIDI_NOTES_SRC,
  MIDI_PATTERN_COUNT,
  MIDI_TAIL,
  midiSampleSrc,
  type MidiNotes,
  type MidiPattern,
} from "@/lib/midi-kits";
import { kitDisplayName } from "@/lib/products";

/** Patterns shown per part before "Show all". */
const VISIBLE = 12;
/** Waveform height in px, shorter than the product-section previews. */
const WAVE_HEIGHT = 18;
/** Fade applied when a hit is cut short or playback is stopped. */
const FADE = 0.01;

type Voice = { id: string; master: GainNode };

function Chip({
  selected,
  onClick,
  label,
  count,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[12px] uppercase tracking-wider transition-colors cursor-pointer ${
        selected
          ? "bg-[#2bd96b] border-[#2bd96b] text-black"
          : "border-white/15 text-gray-300 hover:border-white/40 hover:text-white"
      }`}
    >
      {label}
      <span className={`ml-1.5 ${selected ? "text-black/60" : "text-gray-500"}`}>
        {count}
      </span>
    </button>
  );
}

/**
 * Playable MIDI patterns. With `kitId`, shows only that kit (for its
 * product page); otherwise every kit with a kit filter.
 */
export function MidiKits({ kitId: onlyKit }: { kitId?: string } = {}) {
  const PARTS = onlyKit
    ? MIDI_PARTS.map((p) => ({ ...p, patterns: p.patterns.filter((x) => x.kitId === onlyKit) })).filter(
        (p) => p.patterns.length > 0,
      )
    : MIDI_PARTS;
  const total = PARTS.reduce((n, p) => n + p.patterns.length, 0);
  const ctxRef = useRef<AudioContext | null>(null);
  const notesRef = useRef<Promise<MidiNotes> | null>(null);
  const samplesRef = useRef(new Map<string, Promise<AudioBuffer>>());
  const voiceRef = useRef<Voice | null>(null);
  const frameRef = useRef(0);
  // Bumped on every play/stop so a pattern that finishes loading late is dropped.
  const requestRef = useRef(0);

  const [partId, setPartId] = useState(PARTS[0].id);
  /** null shows the part from every kit. */
  const [kitId, setKitId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const part = PARTS.find((p) => p.id === partId) ?? PARTS[0];
  const partKits = MIDI_KITS.filter((k) => part.patterns.some((p) => p.kitId === k.id));
  const filtered = kitId
    ? part.patterns.filter((p) => p.kitId === kitId)
    : part.patterns;
  const patterns = expanded ? filtered : filtered.slice(0, VISIBLE);

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

  // Stop playback and release audio if the section unmounts.
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

  const selectPart = (id: string) => {
    setPartId(id);
    // Keep the kit filter when that kit has this part too.
    if (kitId && !PARTS.find((p) => p.id === id)!.patterns.some((p) => p.kitId === kitId)) {
      setKitId(null);
    }
    setExpanded(false);
  };

  const selectKit = (id: string | null) => {
    setKitId(id);
    setExpanded(false);
  };

  return (
    <section
      id="midi-kits"
      className="py-16 md:py-24 px-6 bg-[#0e1014] border-t border-white/10 text-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
              {onlyKit
                ? `${total} MIDI patterns`
                : `${MIDI_PATTERN_COUNT} MIDI patterns · ${MIDI_KITS.length} kits`}
            </p>
            <h2 className="text-2xl md:text-3xl leading-tight">
              {onlyKit ? "Hear every pattern in this kit" : "Hear every MIDI drum kit"}
            </h2>
          </div>
          <p className="text-sm font-light tracking-wide text-gray-400 max-w-sm">
            Press play on any pattern. Each MIDI is played with drum samples
            from the bundle&apos;s one-shot kit.
          </p>
        </div>

        <div role="tablist" aria-label="Drum parts" className={`flex flex-wrap gap-2 ${onlyKit ? "mb-8" : "mb-3"}`}>
          {PARTS.map((p) => (
            <Chip
              key={p.id}
              selected={p.id === part.id}
              onClick={() => selectPart(p.id)}
              label={p.label}
              count={p.patterns.length}
            />
          ))}
        </div>

        {!onlyKit && <div role="tablist" aria-label={`${part.label} by kit`} className="flex flex-wrap gap-x-5 gap-y-2 mb-8 border-b border-white/10">
          {[{ id: null, name: "All kits" }, ...partKits].map((k) => {
            const selected = k.id === kitId;
            const count = k.id
              ? part.patterns.filter((p) => p.kitId === k.id).length
              : part.patterns.length;
            return (
              <button
                key={k.id ?? "all"}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectKit(k.id)}
                className={`-mb-px border-b-2 py-2 text-[12px] uppercase tracking-wider transition-colors cursor-pointer ${
                  selected
                    ? "border-[#2bd96b] text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {k.id ? kitDisplayName(k.id, k.name) : k.name} <span className="text-gray-500">{count}</span>
              </button>
            );
          })}
        </div>}

        <div role="tabpanel" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          {patterns.map((pattern) => {
            const active = playingId === pattern.id;
            return (
              <div key={pattern.id} className="min-w-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void toggle(pattern)}
                    aria-label={`${active ? "Stop" : "Play"} ${kitDisplayName(pattern.kitId, pattern.kitName)} ${pattern.name}`}
                    aria-pressed={active}
                    className={`shrink-0 transition-colors cursor-pointer hover:text-[#2bd96b] ${active ? "text-[#2bd96b]" : "text-white"}`}
                  >
                    {active ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <Waveform
                    peaks={pattern.peaks}
                    progress={active ? progress : 0}
                    height={WAVE_HEIGHT}
                  />
                </div>
                <p className="mt-2 pl-10 text-sm font-light tracking-wider text-gray-300">
                  {pattern.name}
                  <span className="block text-xs text-gray-500">
                    {onlyKit ? `${pattern.bpm} BPM` : `${kitDisplayName(pattern.kitId, pattern.kitName)} · ${pattern.bpm} BPM`}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {filtered.length > VISIBLE && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-8 rounded-full border border-white/15 px-5 py-2 text-[12px] uppercase tracking-wider text-gray-300 hover:border-white/40 hover:text-white transition-colors cursor-pointer"
          >
            {expanded ? "Show fewer" : `Show all ${filtered.length}`}
          </button>
        )}
      </div>
    </section>
  );
}

export default MidiKits;
