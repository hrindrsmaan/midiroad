"use client";

import { useRef, useState, type CSSProperties } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { useMidiPlayer, type MidiLayer } from "@/components/useMidiPlayer";
import { event } from "@/lib/gtag";
import { downloadMidi } from "@/lib/midi-file";
import {
  KEY_NAMES,
  generateBatch,
  generatePattern,
  rerollPattern,
  retunePattern,
  type DrumPart,
  type GenNote,
  type GeneratedPattern,
} from "@/lib/midi-generator";

const MIN_BPM = 60;
const MAX_BPM = 180;
const BPM_PRESETS = [70, 130, 140, 150, 160];
const START_BPM = 140;
const START_KEY = 5; // F minor
/** The takes shown before anyone presses Create; fixed so server and client agree. */
const START_TAKES: [number, number][] = [
  [11, 0.5],
  [23, 0.25],
  [37, 0.5],
];

/** Mix levels, matching the kit previews. */
const MIX: Record<DrumPart, number> = { kick: 1, snare: 0.8, hihat: 0.45, "open-hat": 0.4, "808": 0.85 };

/** Lanes top to bottom, high to low like a DAW. */
const LANES: { label: string; parts: DrumPart[]; height: string; color: string }[] = [
  { label: "Hats", parts: ["hihat", "open-hat"], height: "h-11 md:h-12", color: "#d8d1c7" },
  { label: "Snare", parts: ["snare"], height: "h-8 md:h-9", color: "#f4ede3" },
  { label: "Kick", parts: ["kick"], height: "h-8 md:h-9", color: "#f4ede3" },
  { label: "808", parts: ["808"], height: "h-20 md:h-24", color: "#e5392f" },
];

const RED = "#e5392f";
const RED_FILL = "linear-gradient(to bottom, #ff6a5f, #c42a21)";

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

  const noteStyle = (n: GenNote, color: string, fill?: string): CSSProperties => {
    const played = playing && n.beat <= now;
    const hot = played && now - n.beat < glow;
    return {
      left: `${pct(n.beat)}%`,
      background: fill ?? color,
      opacity: !playing ? 0.92 : hot ? 1 : played ? 0.85 : 0.32,
      boxShadow: hot ? `0 0 14px 2px ${color}cc, 0 0 3px ${color}` : undefined,
      transform: hot ? "scaleY(1.12)" : undefined,
    };
  };

  return (
    <div className="relative grid grid-cols-[3.25rem_1fr] md:grid-cols-[4rem_1fr]">
      {/* Lane labels */}
      <div className="flex flex-col border-r border-white/[0.07]">
        {LANES.map((lane) => (
          <div
            key={lane.label}
            className={`flex items-center gap-1.5 border-b border-white/[0.05] pl-2 last:border-b-0 md:pl-3 ${lane.height}`}
          >
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full sm:block" style={{ background: lane.color }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/55 md:text-[11px] md:tracking-[0.12em]">
              {lane.label}
            </span>
          </div>
        ))}
      </div>

      {/* Roll */}
      <div className="relative overflow-hidden">
        {/* Alternate bar shading, then the 16th, beat and bar grid */}
        {[1, 3].map((bar) => (
          <span
            key={bar}
            className="absolute inset-y-0 bg-white/[0.022]"
            style={{ left: `${pct(bar * barBeats)}%`, width: `${pct(barBeats)}%` }}
          />
        ))}
        {Array.from({ length: sixteenths - 1 }, (_, i) => {
          const step = i + 1;
          const strength = step % 16 === 0 ? "bg-white/[0.14]" : step % 4 === 0 ? "bg-white/[0.06]" : "bg-white/[0.022]";
          return (
            <span key={step} className={`absolute inset-y-0 w-px ${strength}`} style={{ left: `${(step / sixteenths) * 100}%` }} />
          );
        })}

        {LANES.map((lane) => {
          const notes = laneNotes(pattern, lane.parts);
          const is808 = lane.label === "808";
          const pitches = notes.map((n) => n.pitch);
          const lo = Math.min(...pitches);
          const span = Math.max(1, Math.max(...pitches) - lo);
          return (
            <div key={lane.label} className={`relative border-b border-white/[0.05] last:border-b-0 ${lane.height}`}>
              {notes.map((n, i) => {
                if (is808) {
                  return (
                    <span
                      key={i}
                      className="absolute h-[18%] min-h-[6px] rounded-[3px] transition-[opacity,box-shadow] duration-150"
                      style={{
                        ...noteStyle(n, RED, RED_FILL),
                        width: `calc(${pct(n.dur)}% - 2px)`,
                        top: `${10 + (1 - (n.pitch - lo) / span) * 62}%`,
                      }}
                    />
                  );
                }
                const width = Math.min(n.room * 0.72, pattern.beats / 80);
                const open = n.part === "open-hat";
                return (
                  <span
                    key={i}
                    className="absolute bottom-[14%] origin-bottom rounded-[2px] transition-[opacity,box-shadow] duration-150"
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

        {/* Playhead with a short trail */}
        {playing && (
          <>
            <span
              className="pointer-events-none absolute inset-y-0"
              style={{
                left: `max(0%, ${progress * 100 - 9}%)`,
                width: `min(9%, ${progress * 100}%)`,
                background: `linear-gradient(to right, transparent, ${RED}26)`,
              }}
            />
            <span
              className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 rounded-full"
              style={{ left: `${progress * 100}%`, background: RED, boxShadow: `0 0 12px 2px ${RED}` }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/** A tiny hats, kick and 808 sketch of a take, for the take buttons. */
function TakeThumb({ pattern }: { pattern: GeneratedPattern }) {
  const x = (beat: number) => (beat / pattern.beats) * 100;
  const kick = pattern.tracks.find((t) => t.part === "kick")?.notes ?? [];
  const bass = pattern.tracks.find((t) => t.part === "808")?.notes ?? [];
  const hats = pattern.tracks.find((t) => t.part === "hihat")?.notes ?? [];
  const pitches = bass.map((n) => n.pitch);
  const lo = Math.min(...pitches);
  const span = Math.max(1, Math.max(...pitches) - lo);
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-6 w-full" aria-hidden>
      {hats.map((n, i) => (
        <rect key={`h${i}`} x={x(n.beat)} y={2} width={0.7} height={1 + (n.vel / 127) * 4} fill="currentColor" opacity={0.35} />
      ))}
      {kick.map((n, i) => (
        <rect key={`k${i}`} x={x(n.beat)} y={9} width={1.2} height={4} fill="currentColor" opacity={0.7} />
      ))}
      {bass.map((n, i) => (
        <rect
          key={`b${i}`}
          x={x(n.beat)}
          y={15 + (1 - (n.pitch - lo) / span) * 6}
          width={Math.max(1, x(n.dur) - 0.6)}
          height={2.2}
          rx={0.8}
          fill={RED}
        />
      ))}
    </svg>
  );
}

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

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/**
 * The home page's opening: a free trap beat maker. Pick a tempo and key,
 * create three takes, loop them, re-roll and download each as .mid.
 */
export function MidiGenerator() {
  const [bpm, setBpm] = useState(START_BPM);
  const [key, setKey] = useState(START_KEY);
  const [takes, setTakes] = useState<GeneratedPattern[]>(initialTakes);
  const [selected, setSelected] = useState(0);
  const { playingId, progress, toggle } = useMidiPlayer();
  const restartRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const current = takes[selected];
  const playing = playingId === current.id;
  const anyPlaying = takes.some((t) => t.id === playingId);

  const play = (p: GeneratedPattern) =>
    void toggle({ id: p.id, duration: loopSeconds(p) }, toLayers(p), loopSeconds(p));

  const create = () => {
    const batch = generateBatch("beat", bpm, key);
    setTakes(batch);
    setSelected(0);
    play(batch[0]);
    event({ action: "generate_midi", category: "midi_generator", label: `beat-${bpm}` });
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
    // Still "playing" mid-drag, while a restart is queued but not yet started.
    const wasPlaying = anyPlaying || restartRef.current !== undefined;
    const next = takes.map((t) => retunePattern(t, nextBpm, nextKey));
    setTakes(next);
    clearTimeout(restartRef.current);
    restartRef.current = undefined;
    // Let a slider drag settle before restarting the audio.
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
    event({ action: "download_generated_midi", category: "midi_generator", label: `beat-${current.bpm}` });
  };

  return (
    <section
      id="generator"
      aria-labelledby="generator-heading"
      className="relative scroll-mt-16 overflow-hidden bg-[#0c0b0b] px-5 pb-16 pt-14 text-white md:pb-24 md:pt-20"
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
            Kick, snare, rolling hats and an 808 in key. Hear it loop, re-roll what you don&apos;t like, and drag
            the MIDI straight into your DAW.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1b1a19] to-[#121111] shadow-[0_40px_120px_-30px_rgba(229,57,47,0.35)]">
          {/* Controls */}
          <div className="grid gap-5 border-b border-white/[0.07] p-5 md:grid-cols-[1fr_auto_auto] md:items-end md:gap-8 md:p-6">
            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <label htmlFor="gen-bpm" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  Tempo
                </label>
                <span className="flex items-baseline gap-1.5">
                  <input
                    type="number"
                    min={MIN_BPM}
                    max={MAX_BPM}
                    value={bpm}
                    onChange={(e) => changeBpm(Number(e.target.value))}
                    aria-label="BPM"
                    className="w-[4.5rem] appearance-none rounded-md border border-transparent bg-transparent px-1 text-right font-heading text-2xl font-extrabold tabular-nums [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none hover:border-white/10 focus:border-white/30 focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-white/45">BPM</span>
                </span>
              </div>
              <input
                id="gen-bpm"
                type="range"
                min={MIN_BPM}
                max={MAX_BPM}
                value={bpm}
                onChange={(e) => changeBpm(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#e5392f]"
              />
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {BPM_PRESETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => changeBpm(b)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium tabular-nums transition-colors ${
                      bpm === b ? "bg-white text-ink" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.12] hover:text-white"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="gen-key" className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Key
              </label>
              <select
                id="gen-key"
                value={key}
                onChange={(e) => changeKey(Number(e.target.value))}
                className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] px-3 text-sm font-semibold text-white focus:border-white/30 focus:outline-none md:w-36"
              >
                {KEY_NAMES.map((name, i) => (
                  <option key={name} value={i} className="bg-[#1b1a19]">
                    {name} minor
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={create}
              className="group flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ef4237] to-[#b3261e] px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-8px_rgba(229,57,47,0.7)] transition-[transform,filter] hover:brightness-110 active:scale-[0.98] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform group-hover:[&_svg]:rotate-12"
            >
              <SparkIcon />
              Create beat
            </button>
          </div>

          {/* Piano roll */}
          <div className="border-b border-white/[0.07] bg-black/25">
            <BeatRoll pattern={current} progress={playing ? progress : 0} playing={playing} />
          </div>

          {/* Transport and takes */}
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => play(current)}
                aria-label={playing ? "Stop beat" : "Play beat"}
                aria-pressed={playing}
                className={`grid h-14 w-14 shrink-0 cursor-pointer place-items-center rounded-full transition-all [&_svg]:h-5 [&_svg]:w-5 ${
                  playing
                    ? "bg-[#e5392f] text-white shadow-[0_0_0_6px_rgba(229,57,47,0.18),0_0_30px_rgba(229,57,47,0.6)]"
                    : "bg-white text-ink hover:scale-105"
                }`}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  Take {selected + 1}
                  <span className="ml-2 font-normal tabular-nums text-white/45">
                    {current.bpm} BPM · {playing ? "looping" : "4 bars"}
                  </span>
                </p>
                <p className="truncate text-xs text-white/45">{current.tags.join(" · ")}</p>
              </div>
            </div>

            <div role="tablist" aria-label="Takes" className="grid flex-1 grid-cols-3 gap-2">
              {takes.map((t, i) => {
                const active = i === selected;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectTake(i)}
                    className={`cursor-pointer rounded-xl border px-2.5 pb-1.5 pt-2 text-left transition-colors ${
                      active
                        ? "border-white/25 bg-white/[0.08] text-white"
                        : "border-white/[0.07] bg-white/[0.02] text-white/50 hover:border-white/15 hover:text-white/80"
                    }`}
                  >
                    <span className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em]">
                      Take {i + 1}
                      {t.id === playingId && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e5392f] shadow-[0_0_6px_#e5392f]" />
                      )}
                    </span>
                    <TakeThumb pattern={t} />
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 [&_svg]:h-4 [&_svg]:w-4">
              <button
                type="button"
                onClick={reroll}
                aria-label={`Re-roll take ${selected + 1}`}
                title="Re-roll this take"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <RerollIcon />
              </button>
              <button
                type="button"
                onClick={download}
                className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-white/85 md:flex-none"
              >
                <DownloadIcon />
                Download MIDI
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/50">
          Want patterns written by hand?{" "}
          <a
            href="#main-cta"
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            Get every MIDI kit in one bundle
          </a>
        </p>
      </div>
    </section>
  );
}

export default MidiGenerator;
