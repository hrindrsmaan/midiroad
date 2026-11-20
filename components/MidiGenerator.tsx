"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { useMidiPlayer, type MidiLayer } from "@/components/useMidiPlayer";
import { BEAT_SOUNDS, type BeatSound, type SoundGroup } from "@/lib/beat-sounds";
import { event } from "@/lib/gtag";
import { paidDownload, type PaidDownload } from "@/lib/paid-download";
import { SIGNUP_CREDITS } from "@/lib/plans";
import {
  KEY_NAMES,
  generatePattern,
  newPattern,
  retunePattern,
  type DrumPart,
  type GenNote,
  type GeneratedPattern,
} from "@/lib/midi-generator";

const MIN_BPM = 60;
const MAX_BPM = 180;
const START_BPM = 140;
const START_KEY = 5; // F minor
/** How many beats the history keeps. */
const HISTORY = 50;

/** Mix levels, matching the kit previews. */
const MIX: Record<DrumPart, number> = { kick: 1, snare: 0.8, hihat: 0.45, "open-hat": 0.4, "808": 0.85 };

const DRUM = "#e7e5e4";
const BASS = "#e5392f";

type LaneId = "hats" | "snare" | "kick" | "808";

type Lane = {
  id: LaneId;
  label: string;
  parts: DrumPart[];
  height: string;
  color: string;
  /** Sounds to pick from; the first one is the default. */
  sounds: SoundGroup[];
};

/** Channels top to bottom, high to low like a DAW. */
const LANES: Lane[] = [
  {
    id: "hats",
    label: "Hats",
    parts: ["hihat", "open-hat"],
    height: "h-12",
    color: DRUM,
    sounds: [{ label: "Hi-hats", sounds: BEAT_SOUNDS.hihat }],
  },
  {
    id: "snare",
    label: "Snare",
    parts: ["snare"],
    height: "h-11",
    color: DRUM,
    sounds: [
      { label: "Snares", sounds: BEAT_SOUNDS.snare },
      { label: "Claps", sounds: BEAT_SOUNDS.clap },
    ],
  },
  {
    id: "kick",
    label: "Kick",
    parts: ["kick"],
    height: "h-11",
    color: DRUM,
    sounds: [{ label: "Kicks", sounds: BEAT_SOUNDS.kick }],
  },
  { id: "808", label: "808", parts: ["808"], height: "h-24", color: BASS, sounds: [{ label: "808s", sounds: BEAT_SOUNDS["808"] }] },
];

/** The sound picked for each lane. */
type Kit = Record<LaneId, BeatSound>;

const DEFAULT_KIT = Object.fromEntries(LANES.map((l) => [l.id, l.sounds[0].sounds[0]])) as Kit;

/** What the player tracks a beat by: the pattern and the sounds it plays with. */
const playKey = (p: GeneratedPattern, kit: Kit) => `${p.id}|${LANES.map((l) => kit[l.id].src).join("|")}`;

const laneOf = (part: DrumPart) => LANES.find((l) => l.parts.includes(part))!;

const mutedParts = (muted: Set<LaneId>) => LANES.filter((l) => muted.has(l.id)).flatMap((l) => l.parts);

const spb = (p: GeneratedPattern) => 60 / p.bpm;
const loopSeconds = (p: GeneratedPattern) => p.beats * spb(p);

function toLayers(p: GeneratedPattern, kit: Kit): MidiLayer[] {
  return p.tracks.map((t) => {
    // Open hats keep the kit's own open hat; every other part plays the lane's pick.
    const sound = t.part === "open-hat" ? undefined : kit[laneOf(t.part).id];
    const tune = sound?.tune ?? 0;
    return {
      sample: t.part,
      src: sound?.src,
      hits: t.notes.map((n) => {
        const gain = (MIX[t.part] * n.vel) / 127;
        const at = n.beat * spb(p);
        return t.part === "808" ? [at, n.pitch + tune, gain, n.dur * spb(p)] : [at, n.pitch + tune, gain];
      }),
    };
  });
}

/** The beat shown before anyone presses New beat; fixed so server and client agree. */
const firstBeat = () => generatePattern("beat", START_BPM, START_KEY, 11, 0.5, "dark");

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

function BeatRoll({
  pattern,
  progress,
  playing,
  muted,
  onToggleMute,
  kit,
  onPickSound,
}: {
  pattern: GeneratedPattern;
  progress: number;
  playing: boolean;
  muted: Set<LaneId>;
  onToggleMute: (lane: LaneId) => void;
  kit: Kit;
  onPickSound: (lane: LaneId, sound: BeatSound) => void;
}) {
  const pct = (beat: number) => (beat / pattern.beats) * 100;
  const now = progress * pattern.beats;
  // How long a note glows after it plays: about a 16th of the feel.
  const glow = pattern.beats / 64;
  const barBeats = pattern.beats / 4;
  const currentBar = Math.min(3, Math.floor(progress * 4));
  const isHot = (n: GenNote) => playing && n.beat <= now && now - n.beat < glow;

  const noteStyle = (n: GenNote, color: string, off: boolean): CSSProperties => {
    const hot = isHot(n) && !off;
    return {
      left: `${pct(n.beat)}%`,
      animationDelay: `${Math.round((n.beat / pattern.beats) * 360)}ms`,
      background: color,
      opacity: off ? 0.12 : !playing ? 0.9 : hot ? 1 : n.beat <= now ? 0.8 : 0.45,
      boxShadow: hot ? `0 0 10px ${color}aa` : undefined,
    };
  };

  const lanes = LANES.map((lane) => ({ ...lane, notes: laneNotes(pattern, lane.parts) }));

  return (
    <div className="grid grid-cols-[6.75rem_1fr] md:grid-cols-[9.5rem_1fr]">
      {/* Bar ruler */}
      <div className="h-7 border-b border-r border-white/[0.06]" />
      <div className="relative h-7 border-b border-white/[0.06]">
        {[0, 1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`absolute inset-y-0 flex items-center border-l border-white/10 pl-1.5 font-mono text-[11px] tabular-nums transition-colors ${
              playing && bar === currentBar ? "text-white" : "text-white/35"
            }`}
            style={{ left: `${pct(bar * barBeats)}%` }}
          >
            {bar + 1}
          </span>
        ))}
      </div>

      {/* Channel strips: name, sound picker, hit light, mute */}
      <div className="flex flex-col border-r border-white/[0.06]">
        {lanes.map((lane) => {
          const off = muted.has(lane.id);
          const lit = !off && lane.notes.some(isHot);
          const all = lane.sounds.flatMap((g) => g.sounds);
          return (
            <div
              key={lane.id}
              className={`flex items-center gap-2 border-b border-white/[0.06] px-2.5 md:px-3 last:border-b-0 ${lane.height}`}
            >
              <span
                aria-hidden
                className="hidden h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-75 md:block"
                style={{ background: lit ? lane.color : "rgba(255,255,255,0.12)" }}
              />
              <div className={`flex min-w-0 flex-1 flex-col gap-0.5 ${off ? "opacity-40" : ""}`}>
                <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-white/40">
                  {BEAT_SOUNDS.clap.includes(kit[lane.id]) ? "Clap" : lane.label}
                </span>
                <label className="group/pick relative flex min-w-0 items-center">
                  <span className="sr-only">{lane.label} sound</span>
                  <select
                    value={kit[lane.id].src}
                    onChange={(e) => onPickSound(lane.id, all.find((s) => s.src === e.target.value)!)}
                    title={`Change ${lane.label.toLowerCase()} sound`}
                    className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-3.5 text-xs font-medium leading-tight text-white/85 hover:text-white focus:outline-none focus-visible:underline"
                  >
                    {lane.sounds.map((group) => (
                      <optgroup key={group.label} label={group.label} className="bg-[#131315]">
                        {group.sounds.map((s) => (
                          <option key={s.src} value={s.src} className="bg-[#131315]">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute right-0 h-3 w-3 text-white/35 group-hover/pick:text-white/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </label>
              </div>
              <button
                type="button"
                onClick={() => onToggleMute(lane.id)}
                aria-pressed={off}
                aria-label={`${off ? "Unmute" : "Mute"} ${lane.label}`}
                title={off ? "Unmute" : "Mute"}
                className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded font-mono text-[10px] font-semibold transition-colors ${
                  off ? "bg-[#e5392f] text-white" : "bg-white/[0.06] text-white/45 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                M
              </button>
            </div>
          );
        })}
      </div>

      {/* Roll */}
      <div className="relative overflow-hidden">
        {[1, 3].map((bar) => (
          <span
            key={bar}
            className="absolute inset-y-0 bg-white/[0.015]"
            style={{ left: `${pct(bar * barBeats)}%`, width: `${pct(barBeats)}%` }}
          />
        ))}
        {Array.from({ length: 63 }, (_, i) => {
          const step = i + 1;
          const strength = step % 16 === 0 ? "bg-white/[0.12]" : step % 4 === 0 ? "bg-white/[0.06]" : "bg-white/[0.025]";
          return <span key={step} className={`absolute inset-y-0 w-px ${strength}`} style={{ left: `${(step / 64) * 100}%` }} />;
        })}

        {lanes.map((lane) => {
          const off = muted.has(lane.id);
          const pitches = lane.notes.map((n) => n.pitch);
          const lo = Math.min(...pitches);
          const span = Math.max(1, Math.max(...pitches) - lo);
          return (
            <div key={lane.id} className={`relative border-b border-white/[0.06] last:border-b-0 ${lane.height}`}>
              {lane.notes.map((n, i) => {
                if (lane.id === "808") {
                  return (
                    <span
                      key={i}
                      className="animate-note-in absolute flex h-[18%] min-h-[9px] origin-left items-center overflow-hidden rounded-[2px] pl-1 font-mono text-[9px] font-semibold leading-none text-black/55 transition-opacity duration-150"
                      style={{
                        ...noteStyle(n, lane.color, off),
                        width: `calc(${pct(n.dur)}% - 2px)`,
                        top: `${10 + (1 - (n.pitch - lo) / span) * 62}%`,
                      }}
                    >
                      {pct(n.dur) > 2.5 ? KEY_NAMES[((n.pitch % 12) + 12) % 12] : ""}
                    </span>
                  );
                }
                const width = Math.min(n.room * 0.72, pattern.beats / 80);
                const open = n.part === "open-hat";
                return (
                  <span
                    key={i}
                    className="animate-note-in absolute bottom-[16%] origin-bottom rounded-[1.5px] transition-opacity duration-150"
                    style={{
                      ...noteStyle(n, lane.color, off),
                      ...(open && { background: "transparent", outline: `1.5px solid ${lane.color}`, outlineOffset: "-1.5px" }),
                      width: `max(2px, calc(${pct(width)}% - 1px))`,
                      height: `${lane.id === "hats" ? 22 + (n.vel / 127) * 54 : 68}%`,
                    }}
                  />
                );
              })}
            </div>
          );
        })}

        {playing && (
          <span
            className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white/90"
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

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {path}
  </svg>
);
const ChevronLeft = () => icon(<path d="m15 6-6 6 6 6" />);
const ChevronRight = () => icon(<path d="m9 6 6 6-6 6" />);
const DownloadIcon = () => icon(<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>);
const ShuffleIcon = () =>
  icon(<><path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="m15 15 6 6" /><path d="M4 4l5 5" /></>);

/** A small caption over a control, as on a hardware panel. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</span>
      {children}
    </div>
  );
}

const GHOST_BTN =
  "grid cursor-pointer place-items-center text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-px font-mono text-[10px] text-white/50">
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/**
 * The home page's opening: a free trap beat maker. Each new beat comes in a
 * random style; earlier ones stay in a history to step back through. Parts
 * can be muted live, and muted parts are left out of the download.
 */
export function MidiGenerator() {
  const [bpm, setBpm] = useState(START_BPM);
  /** What's in the tempo field while it's being typed; null shows `bpm`. */
  const [bpmText, setBpmText] = useState<string | null>(null);
  const [key, setKey] = useState(START_KEY);
  const [history, setHistory] = useState<GeneratedPattern[]>(() => [firstBeat()]);
  const [index, setIndex] = useState(0);
  const [muted, setMutedLanes] = useState<Set<LaneId>>(() => new Set());
  const [kit, setKit] = useState<Kit>(DEFAULT_KIT);
  const { playingId, progress, toggle, setMuted } = useMidiPlayer();
  const restartRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tempoTrackRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [downloadState, setDownload] = useState<PaidDownload | "busy" | null>(null);

  const current = history[index];
  const playing = playingId === playKey(current, kit);
  /** Whether a beat is sounding, or about to restart after a retune. */
  const isLive = () => playingId !== null || restartRef.current !== undefined;

  /** Starts `p` with kit `k` (or stops it, if that's what's playing). */
  const play = (p: GeneratedPattern, k: Kit = kit) => {
    setHasPlayed(true);
    void toggle({ id: playKey(p, k), duration: loopSeconds(p) }, toLayers(p, k), loopSeconds(p));
  };

  /** Sends a beat maker event to Google Analytics. */
  const track = (action: string, label: string) => event({ action, category: "midi_generator", label });

  /** Play / stop from the user (button, grid or Space); only starts are tracked. */
  const togglePlay = () => {
    if (!playing) track("play_beat", `${current.vibe}-${current.bpm}`);
    play(current);
  };

  /** If a beat is playing, restarts it with `start` once quick changes settle. */
  const restartIfLive = (start: () => void, delay: number) => {
    const wasPlaying = isLive();
    clearTimeout(restartRef.current);
    restartRef.current = undefined;
    if (wasPlaying) {
      restartRef.current = setTimeout(() => {
        restartRef.current = undefined;
        start();
      }, delay);
    }
    return wasPlaying;
  };

  /** Swaps a lane's sound: live if a beat is playing, otherwise a one-shot preview. */
  const pickSound = (lane: LaneId, sound: BeatSound) => {
    const next = { ...kit, [lane]: sound };
    setKit(next);
    if (!restartIfLive(() => play(current, next), 60)) {
      try {
        const audio = new Audio(sound.src);
        audio.volume = 0.7;
        void audio.play().catch(() => {});
      } catch {}
    }
    track("pick_sound", `${lane}-${sound.id}`);
  };

  /** Makes `p` current and, if something was playing or `start` is set, plays it. */
  const show = (p: GeneratedPattern, start: boolean) => {
    const live = isLive();
    clearTimeout(restartRef.current);
    restartRef.current = undefined;
    setDownload(null);
    if ((start || live) && playingId !== playKey(p, kit)) play(p);
  };

  const create = () => {
    const next = newPattern("beat", bpm, key, current.vibe);
    const kept = [...history.slice(0, index + 1), next].slice(-HISTORY);
    setHistory(kept);
    setIndex(kept.length - 1);
    show(next, true);
    track("generate_midi", `${next.vibe}-${bpm}`);
  };

  const step = (by: number) => {
    const i = index + by;
    if (i < 0 || i >= history.length) return;
    setIndex(i);
    show(history[i], false);
    track("history_step", by < 0 ? "previous" : "next");
  };

  /** Re-makes the history at the new tempo or key and, if a beat was playing, carries on. */
  const retune = (nextBpm: number, nextKey: number) => {
    const next = history.map((t) => retunePattern(t, nextBpm, nextKey));
    setHistory(next);
    // Let quick clicks or typing settle before restarting the audio.
    restartIfLive(() => play(next[index]), 180);
  };

  /** While typing: keep the raw digits, and apply them as soon as they're a valid tempo. */
  const typeBpm = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 3);
    setBpmText(digits);
    const n = Number(digits);
    if (digits && n >= MIN_BPM && n <= MAX_BPM) changeBpm(n);
  };

  /** On Enter or leaving the field: settle on the typed tempo, kept in range. */
  const commitBpm = () => {
    if (bpmText) changeBpm(Number(bpmText));
    setBpmText(null);
  };

  const changeBpm = (value: number) => {
    setBpmText(null);
    const clamped = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(value) || MIN_BPM));
    if (clamped === bpm) return;
    setBpm(clamped);
    retune(clamped, key);
    // One event per settled tempo, not one per click or keystroke.
    clearTimeout(tempoTrackRef.current);
    tempoTrackRef.current = setTimeout(() => track("change_tempo", String(clamped)), 1500);
  };

  const changeKey = (value: number) => {
    setKey(value);
    retune(bpm, value);
    track("change_key", `${KEY_NAMES[value]} minor`);
  };

  const toggleMute = (lane: LaneId) => {
    const next = new Set(muted);
    if (!next.delete(lane)) next.add(lane);
    // Keep at least one part sounding.
    if (next.size === LANES.length) return;
    setMutedLanes(next);
    setMuted(mutedParts(next));
    track(next.has(lane) ? "mute_lane" : "unmute_lane", lane);
  };

  /** Exports through the server, which charges 1 credit (re-downloads are free). */
  const download = async () => {
    if (downloadState === "busy") return;
    setDownload("busy");
    track("click_download_midi", `${current.vibe}-${current.bpm}`);
    const { kind, bpm, key, seed, hatBase, vibe } = current;
    const off = mutedParts(muted);
    const result = await paidDownload("/api/export", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind,
        bpm,
        key,
        seed,
        hatBase,
        vibe,
        index,
        parts: current.tracks.map((t) => t.part).filter((p) => !off.includes(p)),
      }),
    });
    setDownload(result);
    if (result.ok) track("download_generated_midi", `${current.vibe}-${current.bpm}`);
    // Why it didn't download: "sign_in", "no_credits" or "failed".
    else track("download_blocked", result.error);
  };

  // Keyboard shortcuts, while the beat maker is on screen. The handlers
  // change every render, so the listener reads them through a ref.
  const keysRef = useRef({ play: togglePlay, create, step });
  useEffect(() => {
    keysRef.current = { play: togglePlay, create, step };
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
      else if (e.key === "ArrowLeft") k.step(-1);
      else if (e.key === "ArrowRight") k.step(1);
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
      className="scroll-mt-16 bg-[#0b0b0c] px-4 pb-16 pt-14 text-white md:px-5 md:pb-24 md:pt-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 md:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#e5392f]">Free beat maker</p>
          <h2 id="generator-heading" className="text-3xl leading-tight md:text-5xl">
            Make a trap beat in one click
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55">
            Generate a beat, shape it with tempo, key and mutes, then drag the MIDI straight into your DAW.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#131315] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
          {/* Toolbar */}
          <div className="flex flex-wrap items-end gap-x-5 gap-y-4 border-b border-white/[0.06] px-4 py-4 md:px-5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Stop" : "Play"}
              aria-pressed={playing}
              title="Play / stop (Space)"
              className={`grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full transition-colors [&_svg]:h-5 [&_svg]:w-5 ${
                playing ? "bg-white/10 text-white hover:bg-white/15" : "bg-white text-black hover:bg-white/90"
              }`}
            >
              {playing ? <PauseIcon /> : <span className="translate-x-px"><PlayIcon /></span>}
            </button>

            <Field label="Tempo">
              <div className="flex h-9 items-center rounded-md border border-white/10">
                <button type="button" onClick={() => changeBpm(bpm - 1)} aria-label="Slower" className={`${GHOST_BTN} h-full w-8 rounded-l-md`}>
                  −
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={bpmText ?? bpm}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => typeBpm(e.target.value)}
                  onBlur={commitBpm}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    else if (e.key === "Escape") {
                      setBpmText(null);
                      e.currentTarget.blur();
                    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                      changeBpm(bpm + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1));
                    }
                  }}
                  aria-label={`Tempo in BPM, ${MIN_BPM} to ${MAX_BPM}`}
                  className="w-10 appearance-none bg-transparent text-center font-mono text-sm tabular-nums [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button type="button" onClick={() => changeBpm(bpm + 1)} aria-label="Faster" className={`${GHOST_BTN} h-full w-8 rounded-r-md`}>
                  +
                </button>
              </div>
            </Field>

            <Field label="Key">
              <label className="relative">
                <span className="sr-only">Key</span>
                <select
                  value={key}
                  onChange={(e) => changeKey(Number(e.target.value))}
                  className="h-9 cursor-pointer appearance-none rounded-md border border-white/10 bg-transparent pl-3 pr-8 text-sm hover:border-white/20 focus:outline-none"
                >
                  {KEY_NAMES.map((name, i) => (
                    <option key={name} value={i} className="bg-[#131315]">
                      {name} minor
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </label>
            </Field>

            <div className="grid w-full grid-cols-[auto_1fr_1fr] items-center gap-2 sm:ml-auto sm:flex sm:w-auto [&_svg]:h-4 [&_svg]:w-4">
              <div className="flex h-10 items-center rounded-md border border-white/10">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={index === 0}
                  aria-label="Previous beat"
                  title="Previous beat (←)"
                  className={`${GHOST_BTN} h-full w-9 rounded-l-md`}
                >
                  <ChevronLeft />
                </button>
                <span className="hidden min-w-[2.75rem] whitespace-nowrap text-center sm:inline font-mono text-xs tabular-nums text-white/55" aria-live="polite">
                  {index + 1} / {history.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={index === history.length - 1}
                  aria-label="Next beat"
                  title="Next beat (→)"
                  className={`${GHOST_BTN} h-full w-9 rounded-r-md`}
                >
                  <ChevronRight />
                </button>
              </div>
              <button
                type="button"
                onClick={create}
                title="New beat (N)"
                className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#e5392f] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#d02f25] md:px-4 sm:flex-none"
              >
                <ShuffleIcon />
                New beat
              </button>
              <button
                type="button"
                onClick={download}
                disabled={downloadState === "busy"}
                title="Download MIDI (1 credit)"
                className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/15 px-3 text-sm md:px-4 font-semibold text-white transition-colors hover:bg-white/[0.06] disabled:opacity-60 sm:flex-none"
              >
                <DownloadIcon />
                {downloadState === "busy" ? "Preparing…" : "MIDI"}
              </button>
            </div>
          </div>

          {/* Piano roll: click the grid to play or stop */}
          <div className="relative">
            <BeatRoll
              key={`${current.vibe}-${current.seed}-${current.hatBase}`}
              pattern={current}
              progress={playing ? progress : 0}
              playing={playing}
              muted={muted}
              onToggleMute={toggleMute}
              kit={kit}
              onPickSound={pickSound}
            />
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={togglePlay}
              className="absolute inset-y-0 left-[6.75rem] right-0 top-7 cursor-pointer md:left-[9.5rem]"
            >
              {!hasPlayed && (
                <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg [&_svg]:h-3 [&_svg]:w-3">
                  <PlayIcon />
                  Play beat
                </span>
              )}
            </button>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-2.5 text-xs text-white/45 md:px-5">
            <span className="truncate">{[...current.tags, `${current.bpm} BPM`].join("  ·  ")}</span>
            <span className="hidden shrink-0 items-center gap-1.5 md:flex">
              <Kbd>Space</Kbd> play <Kbd>N</Kbd> new <Kbd>←</Kbd>
              <Kbd>→</Kbd> history
            </span>
          </div>
        </div>

        <div className="mt-5 text-sm">
          <DownloadNotice state={downloadState} />
        </div>
      </div>
    </section>
  );
}

const NOTICE_LINK = "font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white";

/** Under the beat maker: what the last download did, or what each one costs. */
function DownloadNotice({ state }: { state: PaidDownload | "busy" | null }) {
  if (state && state !== "busy" && !state.ok) {
    if (state.error === "sign_in") {
      return (
        <p className="text-white/70">
          <span className="font-semibold text-white">Sign in to download.</span> New accounts get {SIGNUP_CREDITS} free
          credits.{" "}
          <a href="/login?next=/%23generator" className={NOTICE_LINK}>
            Sign in
          </a>
        </p>
      );
    }
    if (state.error === "no_credits") {
      return (
        <p className="text-white/70">
          <span className="font-semibold text-white">You&apos;re out of credits.</span>{" "}
          <a href="/pricing" className={NOTICE_LINK}>
            Get a plan
          </a>{" "}
          for up to 1,200 MIDI files a month.
        </p>
      );
    }
    return <p className="text-white/70">{state.message}</p>;
  }
  if (state && state !== "busy" && state.ok) {
    return (
      <p className="text-white/70">
        <span className="font-semibold text-white">Saved {state.filename}.</span> Drag it into your DAW.{" "}
        {state.charged ? "1 credit used" : "Already yours, no credit used"} · {state.credits} left.
      </p>
    );
  }
  return (
    <p className="text-white/45">
      Each download uses 1 credit, and muted parts are left out of the file. Want patterns written by hand?{" "}
      <a href="/library" className={NOTICE_LINK}>
        Browse the library
      </a>{" "}
      or{" "}
      <a href="#main-cta" className={NOTICE_LINK}>
        get the bundle
      </a>
      .
    </p>
  );
}

export default MidiGenerator;
