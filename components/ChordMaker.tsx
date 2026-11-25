"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { SignInModal, type DownloadGate } from "@/components/auth/SignInModal";
import { INSTRUMENTS, useChordPlayer, type Instrument, type SynthNote } from "@/components/useChordPlayer";
import { parseChordSpec, type ChordSpec } from "@/lib/chord-midi";
import {
  BARS,
  BEATS_PER_BAR,
  CHORD_KINDS,
  HIGH,
  KEY_LABELS,
  LOW,
  PRESETS,
  RHYTHMS,
  TOTAL_BEATS,
  chordName,
  degreeChordName,
  noteName,
  presetSlots,
  progressionNotes,
  romanNumeral,
  usesFlats,
  voiceProgression,
  type ChordKind,
  type Mode,
  type RhythmId,
  type Slot,
} from "@/lib/chords";
import { event } from "@/lib/gtag";

const MIN_BPM = 50;
const MAX_BPM = 180;

/** Chart colors (DESIGN.md): chords violet, bass play green. */
const CHORD = "#d07bd4";
const BASS = "#3f8f5e";

/** Pitches on the roll, high to low like a DAW. */
const ROWS = Array.from({ length: HIGH - LOW + 1 }, (_, i) => HIGH - i);
const isBlack = (n: number) => [1, 3, 6, 8, 10].includes(((n % 12) + 12) % 12);
const ROW_PX = 10;

const track = (action: string, label: string) => event({ action, category: "chord_maker", label });

/** Moves notes by `by` semitones, folding any that leave the roll back in by an octave. */
const transpose = (notes: number[], by: number) =>
  notes.map((n) => {
    let m = n + by;
    while (m > HIGH) m -= 12;
    while (m < LOW) m += 12;
    return m;
  });

/** A progression that isn't one of the presets: starts home, then wanders the key. */
function randomSlots(mode: Mode): Slot[] {
  const pool = mode === "minor" ? [0, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5];
  const pick = () => pool[Math.floor(Math.random() * pool.length)];
  const degrees = [0, pick(), pick(), pick()];
  // No chord twice in a row, except a held last chord.
  for (let i = 1; i < 3; i++) while (degrees[i] === degrees[i - 1]) degrees[i] = pick();
  const kind: ChordKind = Math.random() < 0.3 ? "7th" : Math.random() < 0.15 ? "add9" : "triad";
  return presetSlots(degrees, kind);
}

/**
 * A download blocked by sign-in or by not having a plan keeps the progression
 * here (localStorage, since the magic link may open in a new tab), so coming
 * back finds it as it was. Back from sign-in with ?download=chords, it also
 * downloads.
 */
const PENDING_KEY = "midiroad:pending-chords";
const RESUME_PARAM = "download";
const PENDING_TTL = 24 * 60 * 60 * 1000;

function savePending(spec: ChordSpec) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ spec, at: Date.now() }));
  } catch {}
}

function readPending(): ChordSpec | null {
  try {
    const raw = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "null");
    if (!raw || Date.now() - raw.at > PENDING_TTL) return null;
    return parseChordSpec(raw.spec);
  } catch {
    return null;
  }
}

function clearPending() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {}
}

type DownloadResult = { ok: true } | { ok: false; error: "sign_in" | "no_subscription" | "failed" };

/** Asks the server for the MIDI (subscribers only) and saves it. */
async function downloadChords(spec: ChordSpec): Promise<DownloadResult> {
  let res: Response;
  try {
    res = await fetch("/api/chords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spec),
    });
  } catch {
    return { ok: false, error: "failed" };
  }
  if (res.status === 401) return { ok: false, error: "sign_in" };
  if (res.status === 403) return { ok: false, error: "no_subscription" };
  if (!res.ok) return { ok: false, error: "failed" };
  const filename = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "midiroad-chords.mid";
  const href = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/**
 * The chord maker: four bars of chords in a key, voice-led so they move
 * smoothly, shown on a piano roll that can be drawn on. Playing is free; the
 * MIDI download is for subscribers. On its own page it leads with an h1;
 * set into another page (the home page), `heading="h2"`.
 */
export function ChordMaker({ google, heading = "h1" }: { google: boolean; heading?: "h1" | "h2" }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [key, setKey] = useState(5); // F
  const [mode, setMode] = useState<Mode>("minor");
  const [bpm, setBpm] = useState(90);
  const [bpmText, setBpmText] = useState<string | null>(null);
  const [preset, setPreset] = useState(PRESETS.minor[0].name);
  const [slots, setSlots] = useState<Slot[]>(() => presetSlots(PRESETS.minor[0].degrees));
  const [rhythm, setRhythm] = useState<RhythmId>("stabs");
  const [instrument, setInstrument] = useState<Instrument>("keys");
  const [withBass, setWithBass] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [gate, setGate] = useState<DownloadGate | null>(null);
  const closeGate = useCallback(() => setGate(null), []);
  const player = useChordPlayer();

  const voiced = useMemo(() => voiceProgression(key, mode, slots), [key, mode, slots]);
  const notes = useMemo(() => progressionNotes(key, mode, slots, rhythm, withBass), [key, mode, slots, rhythm, withBass]);
  const flats = usesFlats(key, mode);
  const names = slots.map((s, i) => (s.custom ? (chordName(voiced[i], flats) ?? "Custom") : degreeChordName(key, mode, s)));
  const numerals = slots.map((s) => (s.custom ? "x" : romanNumeral(key, mode, s)));

  const spb = 60 / bpm;
  const synthNotes = useMemo<SynthNote[]>(
    () => [
      ...notes.chords.map((n) => ({ at: n.beat * spb, dur: n.dur * spb, pitch: n.pitch, vel: n.vel })),
      ...notes.bass.map((n) => ({ at: n.beat * spb, dur: n.dur * spb, pitch: n.pitch, vel: n.vel, bass: true })),
    ],
    [notes, spb],
  );
  const loop = TOTAL_BEATS * spb;

  // Edits made while playing are heard from the next loop.
  const { update } = player;
  useEffect(() => update(synthNotes, instrument, loop), [update, synthNotes, instrument, loop]);

  const togglePlay = () => {
    if (!player.playing) {
      track("play_chords", `${KEY_LABELS[key]}${mode}-${preset}`);
      setHasPlayed(true);
    }
    player.toggle(synthNotes, instrument, loop);
  };

  const changeBpm = (v: number) => setBpm(Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(v))));
  const commitBpm = () => {
    if (bpmText !== null && bpmText.trim() !== "" && !Number.isNaN(Number(bpmText))) changeBpm(Number(bpmText));
    setBpmText(null);
  };

  const changeKey = (k: number) => {
    const by = k - key;
    setSlots((s) => s.map((slot) => (slot.custom ? { ...slot, custom: transpose(slot.custom, by) } : slot)));
    setKey(k);
  };

  const changeMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    const first = PRESETS[m][0];
    setPreset(first.name);
    setSlots(presetSlots(first.degrees, first.kind));
  };

  const pickPreset = (name: string) => {
    const p = PRESETS[mode].find((x) => x.name === name);
    if (!p) return;
    setPreset(name);
    setSlots(presetSlots(p.degrees, p.kind));
  };

  const shuffle = () => {
    track("new_chords", `${KEY_LABELS[key]}${mode}`);
    if (Math.random() < 0.5) {
      const options = PRESETS[mode].filter((p) => p.name !== preset);
      const p = options[Math.floor(Math.random() * options.length)];
      setPreset(p.name);
      setSlots(presetSlots(p.degrees, p.kind));
    } else {
      setPreset("");
      setSlots(randomSlots(mode));
    }
  };

  const editSlot = (bar: number, patch: Partial<Slot>) => {
    setPreset("");
    setSlots((s) => s.map((slot, i) => (i === bar ? { ...slot, ...patch, custom: undefined } : slot)));
  };

  /** Adds or removes one note of a bar's chord, from a click on the roll. */
  const toggleNote = (bar: number, pitch: number) => {
    const current = voiced[bar];
    const next = current.includes(pitch) ? current.filter((n) => n !== pitch) : [...current, pitch];
    setPreset("");
    setSlots((s) => s.map((slot, i) => (i === bar ? { ...slot, custom: next } : slot)));
    if (!current.includes(pitch)) player.audition([pitch], instrument);
  };

  const spec: ChordSpec = { key, mode, bpm, rhythm, bass: withBass, slots };

  const exportChords = async (which: ChordSpec) => {
    if (downloading) return;
    setDownloading(true);
    setFailed(false);
    const label = `${KEY_LABELS[which.key]}${which.mode}-${which.bpm}`;
    track("click_download_chords", label);
    const result = await downloadChords(which);
    setDownloading(false);
    if (result.ok) {
      clearPending();
      track("download_chord_midi", label);
      return;
    }
    track("download_blocked", result.error);
    if (result.error === "failed") setFailed(true);
    else {
      savePending(which);
      setGate(result.error);
    }
  };

  // Coming back with a saved progression: put it back, and download it when
  // back from sign-in.
  const resumed = useRef(false);
  const resumeRef = useRef(exportChords);
  useEffect(() => {
    resumeRef.current = exportChords;
  });
  useEffect(() => {
    if (resumed.current) return;
    resumed.current = true;
    const saved = readPending();
    const url = new URL(window.location.href);
    const resume = url.searchParams.get(RESUME_PARAM) === "chords";
    if (resume) {
      url.searchParams.delete(RESUME_PARAM);
      window.history.replaceState(null, "", url.toString());
    }
    if (!saved) return;
    // One-off sync from storage (an outside source), not a render loop.
    /* eslint-disable react-hooks/set-state-in-effect */
    setKey(saved.key);
    setMode(saved.mode);
    setBpm(saved.bpm);
    setRhythm(saved.rhythm);
    setWithBass(saved.bass);
    setSlots(saved.slots);
    setPreset("");
    /* eslint-enable react-hooks/set-state-in-effect */
    if (resume) void resumeRef.current(saved);
  }, []);

  // Space plays, N makes new chords, while the chord maker is on screen (so
  // Space still scrolls the rest of a page) and not while typing in a field.
  const keysRef = useRef({ togglePlay, shuffle });
  useEffect(() => {
    keysRef.current = { togglePlay, shuffle };
  });
  useEffect(() => {
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.4 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!visible || e.metaKey || e.ctrlKey || e.altKey || e.repeat || target.closest("input, select, textarea")) return;
      if (e.code === "Space") {
        if (target.closest("button, a")) return;
        e.preventDefault();
        keysRef.current.togglePlay();
      } else if (e.key === "n" || e.key === "N") keysRef.current.shuffle();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const Heading = heading;
  const headingId = heading === "h1" ? "chord-maker-heading" : "chord-maker-home-heading";

  const playing = player.playing;
  const progress = playing ? player.progress : 0;
  const currentBar = playing ? Math.min(BARS - 1, Math.floor(progress * BARS)) : -1;

  return (
    <section ref={sectionRef} id="chord-maker" aria-labelledby={headingId} className="scroll-mt-16 bg-graphite px-5 pb-16 pt-12 text-ivory md:pb-24 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 md:mb-10">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
            <span aria-hidden className="flex gap-1">
              {[CHORD, "#9b8ce8", "#6a4ce8", BASS].map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
              ))}
            </span>
            Free to play · MIDI download for subscribers
          </p>
          <Heading
            id={headingId}
            className={`max-w-4xl text-balance leading-[0.95] tracking-[-0.03em] ${
              heading === "h1" ? "text-[38px] md:text-[72px]" : "text-[32px] md:text-[56px]"
            }`}
          >
            Make a chord progression in seconds
          </Heading>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Pick a key and a progression, shape the chords on the piano roll, then drag the MIDI into your DAW.
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_-26px_rgba(31,31,31,0.30)]">
          {/* Toolbar */}
          <div className="flex flex-wrap items-end gap-x-5 gap-y-4 border-b border-line/70 px-4 py-4 md:px-5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Stop" : "Play"}
              aria-pressed={playing}
              title="Play / stop (Space)"
              className={`grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-key transition-colors [&_svg]:h-5 [&_svg]:w-5 ${
                playing ? "bg-ivory text-graphite hover:bg-foreground/80" : "bg-brand text-on-brand hover:bg-brand-hover"
              }`}
            >
              {playing ? <PauseIcon /> : <span className="translate-x-px"><PlayIcon /></span>}
            </button>

            <Field label="Tempo">
              <div className="flex h-9 items-center rounded-key border border-line bg-background">
                <button type="button" onClick={() => changeBpm(bpm - 1)} aria-label="Slower" className={`${GHOST_BTN} h-full w-8 rounded-l-key`}>
                  −
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={bpmText ?? bpm}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setBpmText(e.target.value.replace(/\D/g, ""))}
                  onBlur={commitBpm}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                      changeBpm(bpm + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1));
                    }
                  }}
                  aria-label={`Tempo in BPM, ${MIN_BPM} to ${MAX_BPM}`}
                  className="w-10 bg-transparent text-center text-sm font-semibold tabular-nums text-brand focus:outline-none"
                />
                <button type="button" onClick={() => changeBpm(bpm + 1)} aria-label="Faster" className={`${GHOST_BTN} h-full w-8 rounded-r-key`}>
                  +
                </button>
              </div>
            </Field>

            <Field label="Key">
              <div className="flex gap-2">
                <Select label="Key" value={String(key)} onChange={(v) => changeKey(Number(v))}>
                  {KEY_LABELS.map((n, i) => (
                    <option key={n} value={i} className="bg-graphite">
                      {n}
                    </option>
                  ))}
                </Select>
                <div className="flex h-9 rounded-key border border-line bg-background p-0.5" role="group" aria-label="Scale">
                  {(["minor", "major"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => changeMode(m)}
                      aria-pressed={mode === m}
                      className={`cursor-pointer rounded-[5px] px-2.5 text-sm font-semibold capitalize transition-colors ${
                        mode === m ? "bg-foreground/[0.06] text-brand" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            <Field label="Progression">
              <Select label="Progression" value={preset} onChange={pickPreset}>
                {!preset && (
                  <option value="" className="bg-graphite">
                    Your own
                  </option>
                )}
                {PRESETS[mode].map((p) => (
                  <option key={p.name} value={p.name} className="bg-graphite">
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid w-full grid-cols-2 items-center gap-2 sm:ml-auto sm:flex sm:w-auto [&_svg]:h-4 [&_svg]:w-4">
              <button
                type="button"
                onClick={shuffle}
                title="New chords (N)"
                className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-key bg-primary px-3 text-sm font-semibold text-on-brand transition-colors hover:bg-primary-hover md:px-4"
              >
                <ShuffleIcon />
                New chords
              </button>
              <button
                type="button"
                onClick={() => exportChords(spec)}
                disabled={downloading}
                title="Download the progression as MIDI (subscribers)"
                className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-key border border-strong px-3 text-sm font-semibold text-ivory transition-colors hover:bg-foreground/[0.05] disabled:opacity-60 md:px-4"
              >
                <DownloadIcon />
                {downloading ? "Preparing…" : "Download MIDI"}
              </button>
            </div>
          </div>

          {/* Second row: how it plays */}
          <div className="flex flex-wrap items-end gap-x-5 gap-y-3 border-b border-line/70 px-4 py-3 md:px-5">
            <Field label="Rhythm">
              <Select label="Rhythm" value={rhythm} onChange={(v) => setRhythm(v as RhythmId)}>
                {RHYTHMS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-graphite">
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Sound">
              <Select label="Sound" value={instrument} onChange={(v) => setInstrument(v as Instrument)}>
                {INSTRUMENTS.map((i) => (
                  <option key={i.id} value={i.id} className="bg-graphite">
                    {i.label}
                  </option>
                ))}
              </Select>
            </Field>
            <label className="flex h-9 cursor-pointer items-center gap-2 text-sm font-medium text-foreground/75">
              <input type="checkbox" checked={withBass} onChange={(e) => setWithBass(e.target.checked)} className="h-4 w-4 cursor-pointer" />
              Bass notes
            </label>
          </div>

          {/* Chord slots, one per bar, lined up with the roll */}
          <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr]">
            <div className="border-b border-r border-line/70" />
            <div className="grid grid-cols-4 border-b border-line/70">
              {slots.map((slot, bar) => {
                const diatonic = Array.from({ length: 7 }, (_, d) => d);
                return (
                  <div
                    key={bar}
                    className={`flex min-w-0 flex-col gap-1.5 border-l border-line/70 px-2 py-2.5 transition-colors first:border-l-0 md:px-3 ${
                      bar === currentBar ? "bg-foreground/[0.04]" : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => player.audition(voiced[bar], instrument)}
                        title="Hear this chord"
                        className="min-w-0 cursor-pointer truncate text-left text-base font-semibold leading-tight text-foreground hover:text-brand md:text-xl"
                      >
                        {names[bar]}
                      </button>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-muted">{bar + 1}</span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1 md:flex-row">
                      <MiniSelect
                        label={`Bar ${bar + 1} chord`}
                        value={slot.custom ? "" : String(slot.degree)}
                        onChange={(v) => editSlot(bar, { degree: Number(v) })}
                      >
                        {slot.custom && (
                          <option value="" className="bg-graphite">
                            Drawn
                          </option>
                        )}
                        {diatonic.map((d) => {
                          const s = { degree: d, kind: slot.kind };
                          return (
                            <option key={d} value={d} className="bg-graphite">
                              {romanNumeral(key, mode, s)} · {degreeChordName(key, mode, s)}
                            </option>
                          );
                        })}
                      </MiniSelect>
                      <MiniSelect label={`Bar ${bar + 1} chord type`} value={slot.kind} onChange={(v) => editSlot(bar, { kind: v as ChordKind })}>
                        {CHORD_KINDS.map((k) => (
                          <option key={k.id} value={k.id} className="bg-graphite">
                            {k.label}
                          </option>
                        ))}
                      </MiniSelect>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Piano roll: click to add or remove a note in that bar's chord */}
          <div className="relative grid grid-cols-[2.5rem_1fr] bg-canvas md:grid-cols-[3.5rem_1fr]">
            <div className="border-r border-line/70" aria-hidden>
              {ROWS.map((n) => (
                <div
                  key={n}
                  className={`flex items-center justify-end pr-1 text-[9px] font-semibold leading-none ${
                    isBlack(n) ? "bg-foreground text-foreground/0" : "bg-card text-foreground/45"
                  } ${n % 12 === 0 ? "border-b border-foreground/20" : ""}`}
                  style={{ height: ROW_PX }}
                >
                  {n % 12 === 0 ? noteName(n) : ""}
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden" style={{ height: ROWS.length * ROW_PX }}>
              {ROWS.map((n, i) => (
                <span
                  key={n}
                  className={`absolute inset-x-0 ${isBlack(n) ? "bg-foreground/25" : ""} ${n % 12 === 0 ? "border-b border-line/80" : ""}`}
                  style={{ top: i * ROW_PX, height: ROW_PX }}
                />
              ))}
              {Array.from({ length: TOTAL_BEATS - 1 }, (_, i) => {
                const beat = i + 1;
                return (
                  <span
                    key={beat}
                    className={`absolute inset-y-0 w-px ${beat % BEATS_PER_BAR === 0 ? "bg-foreground/[0.09]" : "bg-foreground/[0.04]"}`}
                    style={{ left: `${(beat / TOTAL_BEATS) * 100}%` }}
                  />
                );
              })}

              {notes.chords.map((n, i) => {
                const hot = playing && n.bar === currentBar && progress * TOTAL_BEATS >= n.beat && progress * TOTAL_BEATS < n.beat + n.dur;
                return (
                  <span
                    key={i}
                    className="pointer-events-none absolute rounded-[2px] transition-opacity duration-100"
                    style={{
                      left: `${(n.beat / TOTAL_BEATS) * 100}%`,
                      width: `calc(${(n.dur / TOTAL_BEATS) * 100}% - 2px)`,
                      top: (HIGH - n.pitch) * ROW_PX + 1,
                      height: ROW_PX - 2,
                      background: CHORD,
                      opacity: !playing ? 0.9 : hot ? 1 : 0.5,
                      boxShadow: hot ? `0 0 10px ${CHORD}aa` : undefined,
                    }}
                  />
                );
              })}

              {/* One click target per bar and row */}
              <div className="absolute inset-0 grid grid-cols-4">
                {Array.from({ length: BARS }, (_, bar) => (
                  <div key={bar} className="flex flex-col">
                    {ROWS.map((pitch) => (
                      <button
                        key={pitch}
                        type="button"
                        tabIndex={-1}
                        aria-label={`${voiced[bar].includes(pitch) ? "Remove" : "Add"} ${noteName(pitch, flats)} in bar ${bar + 1}`}
                        onClick={() => toggleNote(bar, pitch)}
                        className="w-full shrink-0 cursor-pointer hover:bg-foreground/[0.05]"
                        style={{ height: ROW_PX }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {playing && (
                <span
                  className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-ivory shadow-[0_0_6px_rgba(31,31,31,0.35)]"
                  style={{ left: `${progress * 100}%` }}
                />
              )}
              {!hasPlayed && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 whitespace-nowrap rounded-key bg-ivory px-4 py-2 text-xs font-semibold text-graphite shadow-lg [&_svg]:h-3 [&_svg]:w-3"
                >
                  <PlayIcon />
                  Play chords
                </button>
              )}
            </div>
          </div>

          {/* Bass lane */}
          {withBass && (
            <div className="grid grid-cols-[2.5rem_1fr] border-t border-line/70 bg-canvas md:grid-cols-[3.5rem_1fr]">
              <div className="flex items-center justify-center border-r border-line/70 text-xs font-semibold text-muted">Bass</div>
              <div className="relative h-9">
                {notes.bass.map((n, i) => (
                  <span
                    key={i}
                    className="absolute top-1/2 flex h-5 -translate-y-1/2 items-center overflow-hidden rounded-[2px] pl-1.5 text-xs font-bold leading-none text-foreground/70"
                    style={{
                      left: `${(n.beat / TOTAL_BEATS) * 100}%`,
                      width: `calc(${(n.dur / TOTAL_BEATS) * 100}% - 2px)`,
                      background: BASS,
                      opacity: !playing ? 0.9 : n.bar === currentBar ? 1 : 0.5,
                    }}
                  >
                    {noteName(n.pitch, flats)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status bar */}
          <div className="flex items-center justify-between gap-3 border-t border-line/70 px-4 py-2.5 text-xs text-muted md:px-5">
            <span className="truncate">
              {[`${KEY_LABELS[key]} ${mode}`, numerals.join(" – "), `${bpm} BPM`].join("  ·  ")}
            </span>
            <span className="hidden shrink-0 items-center gap-1.5 md:flex">
              <Kbd>Space</Kbd> play <Kbd>N</Kbd> new · click the roll to add or remove notes
            </span>
          </div>
        </div>

        <p className="mt-5 max-w-prose text-pretty text-sm text-muted" aria-live="polite">
          {failed ? (
            <span className="font-semibold text-foreground">Download failed. Try again.</span>
          ) : (
            <>
              <span className="font-semibold text-foreground">Playing is free. Downloading is for subscribers</span>, and
              doesn&apos;t use credits.{" "}
              <Link href="/pricing" className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                See plans
              </Link>
              . The MIDI has a Chords track and, with bass notes on, a Bass track, so each lands on its own instrument
              in FL Studio, Ableton, Logic or any DAW.
            </>
          )}
        </p>
        <SignInModal
          reason={gate}
          fileName="Your progression"
          google={google}
          callbackURL={`/chord-maker?${RESUME_PARAM}=chords`}
          onClose={closeGate}
          subscribersOnly
        />
      </div>
    </section>
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
const DownloadIcon = () => icon(<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>);
const ShuffleIcon = () =>
  icon(<><path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="m15 15 6 6" /><path d="M4 4l5 5" /></>);
const Chevron = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const GHOST_BTN =
  "grid cursor-pointer place-items-center text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </div>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-key border border-line bg-background pl-3 pr-8 text-sm font-semibold text-brand hover:border-strong focus:outline-none"
      >
        {children}
      </select>
      <Chevron className="right-2.5 h-3.5 w-3.5" />
    </label>
  );
}

function MiniSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-full min-w-0 cursor-pointer appearance-none truncate rounded border border-line bg-background pl-1.5 pr-5 text-xs font-medium text-foreground/80 hover:border-strong hover:text-foreground focus:outline-none"
      >
        {children}
      </select>
      <Chevron className="right-1 h-3 w-3" />
    </label>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded-[3px] border border-line bg-foreground/[0.04] px-1.5 py-px font-sans text-xs font-semibold text-muted">
      {children}
    </kbd>
  );
}
