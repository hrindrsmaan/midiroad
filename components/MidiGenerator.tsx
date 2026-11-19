"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { useMidiPlayer, type MidiLayer } from "@/components/useMidiPlayer";
import { event } from "@/lib/gtag";
import { downloadMidi, midiFileName } from "@/lib/midi-file";
import {
  KEY_NAMES,
  VIBES,
  VIBE_IDS,
  generateBatch,
  generatePattern,
  rerollPattern,
  retunePattern,
  type DrumPart,
  type GenNote,
  type GeneratedPattern,
  type Vibe,
} from "@/lib/midi-generator";

const MIN_BPM = 60;
const MAX_BPM = 180;
const START_BPM = 140;
const START_KEY = 5; // F minor
/** The takes shown before anyone presses New beat; fixed so server and client agree. */
const START_TAKES: [number, number][] = [
  [11, 0.5],
  [23, 0.25],
  [37, 0.5],
];

/** Mix levels, matching the kit previews. */
const MIX: Record<DrumPart, number> = { kick: 1, snare: 0.8, hihat: 0.45, "open-hat": 0.4, "808": 0.85 };

/* DAW palette: slate panels, an LCD green readout, green drum notes, red 808s. */
const LCD = "#9ff06b";
const NOTE = "#8fd46a";
const RED = "#e5392f";
const RED_FILL = "linear-gradient(to bottom, #ff6a5f, #c42a21)";

/** Channels top to bottom, high to low like a DAW. */
const LANES: { label: string; parts: DrumPart[]; height: string; color: string }[] = [
  { label: "Hats", parts: ["hihat", "open-hat"], height: "h-11 md:h-12", color: NOTE },
  { label: "Snare", parts: ["snare"], height: "h-8 md:h-9", color: NOTE },
  { label: "Kick", parts: ["kick"], height: "h-8 md:h-9", color: NOTE },
  { label: "808", parts: ["808"], height: "h-20 md:h-24", color: RED },
];

const spb = (p: GeneratedPattern) => 60 / p.bpm;
const loopSeconds = (p: GeneratedPattern) => p.beats * spb(p);

function toLayers(p: GeneratedPattern): MidiLayer[] {
  return p.tracks.map((t) => ({
    sample: t.part,
    hits: t.notes.map((n) => {
      const gain = (MIX[t.part] * n.vel) / 127;
      return t.part === "808"
        ? [n.beat * spb(p), n.pitch, gain, n.dur * spb(p)]
        : [n.beat * spb(p), n.pitch, gain];
    }),
  }));
}

const initialTakes = () =>
  START_TAKES.map(([seed, base]) => generatePattern("beat", START_BPM, START_KEY, seed, base));

/** Bar:beat:step of the loop, like a DAW's song position. */
function position(progress: number) {
  const step = Math.floor(progress * 64);
  return `${Math.floor(step / 16) + 1}:${(Math.floor(step / 4) % 4) + 1}:${(step % 4) + 1}`;
}

/* ------------------------------------------------------------------ */
/* Piano roll                                                          */
/* ------------------------------------------------------------------ */

/** Notes of the given parts, each with the room it has before the next. */
function laneNotes(p: GeneratedPattern, parts: DrumPart[]) {
  const notes = p.tracks
    .filter((t) => parts.includes(t.part))
    .flatMap((t) => t.notes.map((n) => ({ ...n, part: t.part })))
    .sort((a, b) => a.beat - b.beat);
  return notes.map((n, i) => ({ ...n, room: (notes[i + 1]?.beat ?? p.beats) - n.beat }));
}

function BeatRoll({ pattern, progress, playing }: { pattern: GeneratedPattern; progress: number; playing: boolean }) {
  const pct = (beat: number) => (beat / pattern.beats) * 100;
  const now = progress * pattern.beats;
  // How long a note glows after it plays: about a 16th of the feel.
  const glow = pattern.beats / 64;
  const barBeats = pattern.beats / 4;
  const sixteenths = 64;
  const currentBar = Math.min(3, Math.floor(progress * 4));
  const isHot = (n: GenNote) => playing && n.beat <= now && now - n.beat < glow;

  const noteStyle = (n: GenNote, color: string, fill?: string): CSSProperties => {
    const played = playing && n.beat <= now;
    const hot = isHot(n);
    return {
      left: `${pct(n.beat)}%`,
      animationDelay: `${Math.round((n.beat / pattern.beats) * 420)}ms`,
      background: fill ?? color,
      opacity: !playing ? 0.95 : hot ? 1 : played ? 0.85 : 0.4,
      boxShadow: hot
        ? `0 0 12px 2px ${color}cc, inset 0 0 0 1px rgba(0,0,0,0.35)`
        : "inset 0 0 0 1px rgba(0,0,0,0.35)",
      transform: hot ? "scaleY(1.12)" : undefined,
    };
  };

  const lanes = LANES.map((lane) => ({ ...lane, notes: laneNotes(pattern, lane.parts) }));

  return (
    <div className="relative grid grid-cols-[4.5rem_1fr] md:grid-cols-[6rem_1fr]">
      {/* Bar ruler */}
      <div className="h-7 border-b border-r border-black/40 bg-[#3a4046]" />
      <div className="relative h-7 border-b border-black/40 bg-[#3a4046]">
        {[0, 1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`absolute top-1/2 -translate-y-1/2 border-l border-white/20 pl-1.5 font-mono text-[11px] font-bold tabular-nums transition-colors ${
              playing && bar === currentBar ? "text-[#ffb347]" : "text-white/55"
            }`}
            style={{ left: `${pct(bar * barBeats)}%` }}
          >
            {bar + 1}
          </span>
        ))}
        {playing && (
          <span
            className="absolute top-0 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-[#ffb347]"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>

      {/* Channel buttons, each with an LED that lights on its hits */}
      <div className="flex flex-col gap-px border-r border-black/40 bg-[#2a2f34] p-1">
        {lanes.map((lane) => {
          const lit = lane.notes.some(isHot);
          return (
            <div
              key={lane.label}
              className={`flex items-center gap-2 rounded-[3px] bg-gradient-to-b from-[#535b62] to-[#41484e] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_0_rgba(0,0,0,0.4)] ${lane.height}`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full transition-[background,box-shadow] duration-75"
                style={{
                  background: lit ? LCD : "#1f2a1a",
                  boxShadow: lit ? `0 0 8px ${LCD}` : "inset 0 1px 1px rgba(0,0,0,0.6)",
                }}
              />
              <span className="truncate text-[11px] font-semibold text-[#e3e7ea] md:text-xs">{lane.label}</span>
            </div>
          );
        })}
      </div>

      {/* Roll */}
      <div className="relative overflow-hidden bg-[#2c3238]">
        {/* Alternate bar shading, then the 16th, beat and bar grid */}
        {[1, 3].map((bar) => (
          <span
            key={bar}
            className="absolute inset-y-0 bg-black/[0.12]"
            style={{ left: `${pct(bar * barBeats)}%`, width: `${pct(barBeats)}%` }}
          />
        ))}
        {Array.from({ length: sixteenths - 1 }, (_, i) => {
          const step = i + 1;
          const strength = step % 16 === 0 ? "bg-black/60" : step % 4 === 0 ? "bg-black/35" : "bg-black/15";
          return (
            <span key={step} className={`absolute inset-y-0 w-px ${strength}`} style={{ left: `${(step / sixteenths) * 100}%` }} />
          );
        })}

        {lanes.map((lane) => {
          const is808 = lane.label === "808";
          const pitches = lane.notes.map((n) => n.pitch);
          const lo = Math.min(...pitches);
          const span = Math.max(1, Math.max(...pitches) - lo);
          return (
            <div key={lane.label} className={`relative border-b border-black/30 last:border-b-0 ${lane.height}`}>
              {lane.notes.map((n, i) => {
                if (is808) {
                  const name = KEY_NAMES[((n.pitch % 12) + 12) % 12];
                  return (
                    <span
                      key={i}
                      className="animate-note-in absolute flex h-[20%] min-h-[9px] origin-left items-center overflow-hidden rounded-[2px] pl-1 font-mono text-[8px] font-bold leading-none text-black/60 transition-[opacity,box-shadow] duration-150 md:text-[9px]"
                      style={{
                        ...noteStyle(n, RED, RED_FILL),
                        width: `calc(${pct(n.dur)}% - 2px)`,
                        top: `${8 + (1 - (n.pitch - lo) / span) * 62}%`,
                      }}
                    >
                      {pct(n.dur) > 2.5 ? name : ""}
                    </span>
                  );
                }
                const width = Math.min(n.room * 0.72, pattern.beats / 80);
                const open = n.part === "open-hat";
                return (
                  <span
                    key={i}
                    className="animate-note-in absolute bottom-[14%] origin-bottom rounded-[2px] transition-[opacity,box-shadow] duration-150"
                    style={{
                      ...noteStyle(n, lane.color, open ? "transparent" : undefined),
                      width: `max(2px, calc(${pct(width)}% - 1px))`,
                      height: `${lane.parts.includes("hihat") ? 22 + (n.vel / 127) * 56 : 72}%`,
                      outline: open ? `1.5px solid ${lane.color}` : undefined,
                      outlineOffset: "-1.5px",
                    }}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Playhead */}
        {playing && (
          <span
            className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-[#ffb347] shadow-[0_0_8px_#ffb347]"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bits                                                                */
/* ------------------------------------------------------------------ */

function RerollIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zm6.5 11l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
    </svg>
  );
}

/** A dark LCD readout with a tiny caption, as on a DAW's toolbar. */
function Lcd({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-11 flex-col justify-center rounded-[4px] border border-black/60 bg-[#12181b] px-2.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] ${className}`}
    >
      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#9ff06b]/45">{label}</span>
      <span className="font-mono text-lg font-bold leading-none tabular-nums" style={{ color: LCD, textShadow: `0 0 6px ${LCD}66` }}>
        {children}
      </span>
    </div>
  );
}

/** Raised slate button, as on a DAW toolbar. */
const PANEL_BTN =
  "cursor-pointer rounded-[4px] border border-black/50 bg-gradient-to-b from-[#58616a] to-[#434b52] text-[#e3e7ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[filter] hover:brightness-110 active:brightness-95";

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded-[3px] border border-white/15 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-white/55">
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/**
 * The home page's opening: a free trap beat maker styled like a DAW. Pick a
 * vibe, tempo and key, loop three takes, re-roll and download each as .mid.
 */
export function MidiGenerator() {
  const [vibe, setVibe] = useState<Vibe>("dark");
  const [bpm, setBpm] = useState(START_BPM);
  const [key, setKey] = useState(START_KEY);
  const [takes, setTakes] = useState<GeneratedPattern[]>(initialTakes);
  const [selected, setSelected] = useState(0);
  const { playingId, progress, toggle } = useMidiPlayer();
  const restartRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const current = takes[selected];
  const playing = playingId === current.id;
  const anyPlaying = takes.some((t) => t.id === playingId);

  const play = (p: GeneratedPattern) => {
    setHasPlayed(true);
    void toggle({ id: p.id, duration: loopSeconds(p) }, toLayers(p), loopSeconds(p));
  };

  const createWith = (nextVibe: Vibe, nextBpm: number) => {
    clearTimeout(restartRef.current);
    restartRef.current = undefined;
    const batch = generateBatch("beat", nextBpm, key, 3, nextVibe);
    setTakes(batch);
    setSelected(0);
    play(batch[0]);
    event({ action: "generate_midi", category: "midi_generator", label: `${nextVibe}-${nextBpm}` });
  };

  const create = () => createWith(vibe, bpm);

  /** A new vibe brings its own tempo and a fresh batch, straight into playback. */
  const chooseVibe = (v: Vibe) => {
    setVibe(v);
    setBpm(VIBES[v].bpm);
    createWith(v, VIBES[v].bpm);
  };

  /** Switches take, keeping the beat going if one was playing. */
  const selectTake = (i: number) => {
    setSelected(i);
    if (anyPlaying && takes[i].id !== playingId) play(takes[i]);
  };

  const reroll = () => {
    const next = rerollPattern(current);
    setTakes((ts) => ts.map((t, i) => (i === selected ? next : t)));
    play(next);
  };

  /** Re-makes every take at the new tempo or key and, if one was playing, carries on. */
  const retune = (nextBpm: number, nextKey: number) => {
    // Still "playing" while a restart is queued but not yet started.
    const wasPlaying = anyPlaying || restartRef.current !== undefined;
    const next = takes.map((t) => retunePattern(t, nextBpm, nextKey));
    setTakes(next);
    clearTimeout(restartRef.current);
    restartRef.current = undefined;
    // Let quick clicks or typing settle before restarting the audio.
    if (wasPlaying) {
      restartRef.current = setTimeout(() => {
        restartRef.current = undefined;
        play(next[selected]);
      }, 180);
    }
  };

  const changeBpm = (value: number) => {
    const clamped = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(value) || MIN_BPM));
    setBpm(clamped);
    retune(clamped, key);
  };

  const changeKey = (value: number) => {
    setKey(value);
    retune(bpm, value);
  };

  const download = () => {
    downloadMidi(current, selected);
    setDownloaded(midiFileName(current, selected));
    event({ action: "download_generated_midi", category: "midi_generator", label: `${current.vibe}-${current.bpm}` });
  };

  // Keyboard shortcuts, while the beat maker is on screen. The handlers
  // change every render, so the listener reads them through a ref.
  const keysRef = useRef({ play: () => play(current), create, reroll, selectTake });
  useEffect(() => {
    keysRef.current = { play: () => play(current), create, reroll, selectTake };
  });
  useEffect(() => {
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.4 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, select, textarea, [contenteditable]")) return;
      const k = keysRef.current;
      if (e.code === "Space") {
        // Buttons and links already activate on Space.
        if (target.closest("button, a")) return;
        e.preventDefault();
        k.play();
      } else if (e.key === "n" || e.key === "N") k.create();
      else if (e.key === "r" || e.key === "R") k.reroll();
      else if (["1", "2", "3"].includes(e.key)) k.selectTake(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="generator"
      aria-labelledby="generator-heading"
      className="relative scroll-mt-16 overflow-hidden bg-[#0c0b0b] px-4 pb-16 pt-14 text-white md:px-5 md:pb-24 md:pt-20"
    >
      {/* Backdrop: a red glow from above and a faint grid fading out */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% -10%, rgba(229,57,47,0.28), transparent 70%), radial-gradient(40% 40% at 85% 110%, rgba(229,57,47,0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10 text-center md:mb-12">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e5392f] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e5392f]" />
            </span>
            Free trap beat maker
          </p>
          <h2 id="generator-heading" className="text-4xl leading-[1.05] md:text-6xl">
            Make a trap beat
            <br />
            <span className="bg-gradient-to-r from-[#ff6a5f] to-[#e5392f] bg-clip-text text-transparent">in one click</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Pick a vibe, hear it loop, re-roll what you don&apos;t like, and drag the MIDI straight into your DAW.
          </p>
        </div>

        {/* The DAW window */}
        <div className="overflow-hidden rounded-lg border border-black bg-[#2f353a] shadow-[0_40px_120px_-30px_rgba(229,57,47,0.35),0_0_0_1px_rgba(255,255,255,0.06)]">
          {/* Title bar: vibe and pattern pickers */}
          <div className="flex flex-col gap-3 border-b border-black/50 bg-gradient-to-b from-[#454c53] to-[#3a4046] px-3 py-3 md:flex-row md:items-center md:justify-between md:px-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-semibold text-[#e3e7ea]">Choose your vibe</span>
              <div role="radiogroup" aria-label="Vibe" className="flex flex-wrap gap-1.5">
                {VIBE_IDS.map((v) => {
                  const active = v === vibe;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => chooseVibe(v)}
                      className={`h-8 cursor-pointer rounded-full px-3.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#e5392f]/20 text-[#ff7a70] shadow-[inset_0_0_0_1px_rgba(229,57,47,0.45)]"
                          : "bg-black/25 text-[#e3e7ea]/85 hover:bg-black/40 hover:text-white"
                      }`}
                    >
                      {VIBES[v].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div role="tablist" aria-label="Takes" className="flex items-center gap-1">
              <span className="mr-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Pattern</span>
              {takes.map((t, i) => {
                const active = i === selected;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Take ${i + 1}`}
                    onClick={() => selectTake(i)}
                    className={`relative h-8 w-9 cursor-pointer rounded-[4px] border font-mono text-sm font-bold transition-colors ${
                      active
                        ? "border-black/60 bg-[#12181b] text-[#9ff06b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                        : "border-black/50 bg-gradient-to-b from-[#58616a] to-[#434b52] text-[#e3e7ea]/80 hover:brightness-110"
                    }`}
                  >
                    {i + 1}
                    {t.id === playingId && (
                      <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#9ff06b] shadow-[0_0_5px_#9ff06b]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-black/50 bg-[#353b41] px-3 py-2.5 md:gap-3 md:px-4">
            <button
              type="button"
              onClick={() => play(current)}
              aria-label={playing ? "Stop beat" : "Play beat"}
              aria-pressed={playing}
              className={`relative grid h-11 w-12 shrink-0 cursor-pointer place-items-center rounded-[4px] border border-black/60 transition-all [&_svg]:h-5 [&_svg]:w-5 ${
                playing
                  ? "bg-[#12181b] text-[#ffb347] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7),0_0_14px_rgba(255,179,71,0.35)]"
                  : "bg-gradient-to-b from-[#58616a] to-[#434b52] text-[#9ff06b] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:brightness-110"
              }`}
            >
              {!hasPlayed && !playing && (
                <span className="absolute -inset-1 animate-ping rounded-[6px] border-2 border-[#9ff06b]/60" aria-hidden />
              )}
              <span className="relative">{playing ? <PauseIcon /> : <PlayIcon />}</span>
            </button>

            {/* Tempo LCD with nudge buttons */}
            <div className="flex items-center gap-1">
              <Lcd label="Tempo" className="w-[5.5rem]">
                <input
                  type="number"
                  min={MIN_BPM}
                  max={MAX_BPM}
                  value={bpm}
                  onChange={(e) => changeBpm(Number(e.target.value))}
                  aria-label="Tempo in BPM"
                  className="w-full appearance-none bg-transparent font-mono text-lg font-bold tabular-nums [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ color: LCD }}
                />
              </Lcd>
              <div className="flex flex-col gap-px">
                <button
                  type="button"
                  onClick={() => changeBpm(bpm + 1)}
                  aria-label="Faster"
                  className={`${PANEL_BTN} grid h-[21px] w-6 place-items-center text-[10px] leading-none`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => changeBpm(bpm - 1)}
                  aria-label="Slower"
                  className={`${PANEL_BTN} grid h-[21px] w-6 place-items-center text-[10px] leading-none`}
                >
                  ▼
                </button>
              </div>
            </div>

            <Lcd label="Bar:Beat:Step" className="hidden w-[7.5rem] sm:flex">
              {playing ? position(progress) : "1:1:1"}
            </Lcd>

            {/* Key */}
            <label className="relative">
              <span className="sr-only">Key</span>
              <select
                value={key}
                onChange={(e) => changeKey(Number(e.target.value))}
                className={`${PANEL_BTN} h-11 appearance-none pl-3 pr-8 text-sm font-semibold focus:outline-none`}
              >
                {KEY_NAMES.map((name, i) => (
                  <option key={name} value={i} className="bg-[#2f353a]">
                    {name} minor
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </label>

            <div className="flex w-full gap-2 sm:ml-auto sm:w-auto [&_svg]:h-4 [&_svg]:w-4">
              <button
                type="button"
                onClick={reroll}
                aria-label={`Re-roll take ${selected + 1}`}
                title="Re-roll this take (R)"
                className={`${PANEL_BTN} grid h-11 w-11 shrink-0 place-items-center`}
              >
                <RerollIcon />
              </button>
              <button
                type="button"
                onClick={create}
                title="New beats (N)"
                className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-black/50 bg-gradient-to-b from-[#ef4237] to-[#b3261e] px-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_24px_-8px_rgba(229,57,47,0.7)] transition-[filter] hover:brightness-110 active:brightness-95 sm:flex-none"
              >
                <SparkIcon />
                New beat
              </button>
              <button
                type="button"
                onClick={download}
                className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-black/50 bg-gradient-to-b from-white to-[#dfe3e6] px-4 text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-[inset_0_1px_0_white] transition-[filter] hover:brightness-105 active:brightness-95 sm:flex-none"
              >
                <DownloadIcon />
                MIDI
              </button>
            </div>
          </div>

          {/* Piano roll: click anywhere on it to play or stop */}
          <div className="group/roll relative cursor-pointer" onClick={() => play(current)}>
            <BeatRoll
              key={`${current.vibe}-${current.seed}-${current.hatBase}`}
              pattern={current}
              progress={playing ? progress : 0}
              playing={playing}
            />
            {!playing && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center transition-colors group-hover/roll:bg-black/20">
                <span
                  className={`flex items-center gap-2 rounded-[4px] border border-black/60 bg-[#12181b]/95 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] shadow-xl transition-opacity [&_svg]:h-3.5 [&_svg]:w-3.5 ${
                    hasPlayed ? "opacity-0 group-hover/roll:opacity-100" : "opacity-100"
                  }`}
                  style={{ color: LCD }}
                >
                  <PlayIcon />
                  {hasPlayed ? "Play" : "Hear this beat"}
                </span>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between gap-3 border-t border-black/50 bg-[#262b30] px-3 py-1.5 font-mono text-[11px] text-white/50 md:px-4">
            <span className="truncate">
              {current.bpm} BPM · {current.tags.join(" · ")}
            </span>
            <span className="hidden shrink-0 items-center gap-1.5 md:flex">
              <Kbd>Space</Kbd> play <Kbd>N</Kbd> new <Kbd>R</Kbd> re-roll
            </span>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          {downloaded ? (
            <p className="inline-block rounded-full border border-[#e5392f]/30 bg-[#e5392f]/10 px-4 py-2 text-white/80">
              <span className="font-semibold text-white">Saved {downloaded}.</span> Drag it into your DAW. Want
              hundreds more, written by hand?{" "}
              <a
                href="#main-cta"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                Get the bundle
              </a>
            </p>
          ) : (
            <p className="text-white/50">
              Want patterns written by hand?{" "}
              <a
                href="#main-cta"
                className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                Get every MIDI kit in one bundle
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MidiGenerator;
