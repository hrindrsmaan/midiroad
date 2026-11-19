"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { Section, SectionHeader, type Tone } from "@/components/Section";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import { MIDI_KITS, MIDI_PARTS, MIDI_PATTERN_COUNT, type MidiPattern } from "@/lib/midi-kits";
import { kitDisplayName } from "@/lib/products";

/** Patterns shown per part before "Show all". */
const VISIBLE = 12;
/** Below this a bucket is drawn as a rest dot, not a hit. */
const HIT_THRESHOLD = 0.08;
/** One palette for every kit: ink at rest, brand red while playing. */
const INK = "linear-gradient(to bottom, #4a4743, #141414)";
const BRAND = "#b3261e";
const BRAND_FILL = "linear-gradient(to bottom, #e0453b, #8f1c16)";

/**
 * A pattern drawn like a lane in a MIDI editor: hits as pills, faint bar
 * lines from the BPM, and a playhead while it plays.
 */
function MidiLane({
  pattern,
  progress,
  active,
}: {
  pattern: MidiPattern;
  progress: number;
  active: boolean;
}) {
  const barSeconds = (4 * 60) / pattern.bpm;
  const bars = Math.floor(pattern.duration / barSeconds);
  const played = progress * pattern.peaks.length;

  return (
    <div
      aria-hidden
      className="relative h-8 overflow-hidden rounded-lg border border-line/70 bg-gradient-to-b from-canvas to-white"
      style={active ? { boxShadow: `inset 0 0 0 1px ${BRAND}33, 0 0 18px -6px ${BRAND}` } : undefined}
    >
      {/* bar lines */}
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="absolute inset-y-1.5 w-px bg-ink/[0.07]"
          style={{ left: `${(((i + 1) * barSeconds) / pattern.duration) * 100}%` }}
        />
      ))}
      {/* centre line */}
      <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-ink/[0.06]" />

      <div className="absolute inset-x-1.5 inset-y-1 flex items-center">
        {pattern.peaks.map((peak, i) => {
          const isHit = peak >= HIT_THRESHOLD;
          const lit = !active || i < played;
          return (
            <span key={i} className="flex h-full flex-1 items-center justify-center">
              {isHit ? (
                <span
                  className="block w-[3px] rounded-full transition-[opacity,box-shadow] duration-150 sm:w-1"
                  style={{
                    height: `${Math.max(28, peak * 100)}%`,
                    background: active && lit ? BRAND_FILL : INK,
                    opacity: lit ? 1 : 0.25,
                    boxShadow: active && lit ? `0 0 8px ${BRAND}99` : undefined,
                  }}
                />
              ) : (
                <span className="block h-[3px] w-[3px] rounded-full bg-ink/10" />
              )}
            </span>
          );
        })}
      </div>

      {active && (
        <span
          className="absolute inset-y-0 w-0.5 rounded-full"
          style={{
            left: `${progress * 100}%`,
            background: BRAND,
            boxShadow: `0 0 10px 1px ${BRAND}`,
          }}
        />
      )}
    </div>
  );
}

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
      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
        selected
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {label}
      <span className={`ml-1.5 ${selected ? "text-white/60" : "text-muted"}`}>
        {count}
      </span>
    </button>
  );
}

/**
 * Playable MIDI patterns. With `kitId`, shows only that kit (for its
 * product page); otherwise every kit with a kit filter.
 */
export function MidiKits({ kitId: onlyKit, tone = "white" }: { kitId?: string; tone?: Tone } = {}) {
  const PARTS = onlyKit
    ? MIDI_PARTS.map((p) => ({ ...p, patterns: p.patterns.filter((x) => x.kitId === onlyKit) })).filter(
        (p) => p.patterns.length > 0,
      )
    : MIDI_PARTS;
  const total = PARTS.reduce((n, p) => n + p.patterns.length, 0);
  const { playingId, progress, toggle } = useMidiPlayer();

  const [partId, setPartId] = useState(PARTS[0].id);
  /** null shows the part from every kit. */
  const [kitId, setKitId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const part = PARTS.find((p) => p.id === partId) ?? PARTS[0];
  const partKits = MIDI_KITS.filter((k) => part.patterns.some((p) => p.kitId === k.id));
  const filtered = kitId
    ? part.patterns.filter((p) => p.kitId === kitId)
    : part.patterns;
  const patterns = expanded ? filtered : filtered.slice(0, VISIBLE);

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
    <Section id="midi-kits" tone={tone}>
      <SectionHeader
        eyebrow={
          onlyKit ? `${total} MIDI patterns` : `${MIDI_PATTERN_COUNT} MIDI patterns · ${MIDI_KITS.length} kits`
        }
        title={onlyKit ? "Hear every pattern" : "Hear every MIDI kit"}
        intro="Press play on any pattern. Each MIDI is played with drum samples from the bundle's one-shot kit."
      />

      <div role="tablist" aria-label="Drum parts" className={`flex flex-wrap justify-center gap-2 ${onlyKit ? "mb-10" : "mb-5"}`}>
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

      {!onlyKit && (
        <div
          role="tablist"
          aria-label={`${part.label} by kit`}
          className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-line"
        >
          {[{ id: null, name: "All kits" }, ...partKits].map((k) => {
            const selected = k.id === kitId;
            const count = k.id ? part.patterns.filter((p) => p.kitId === k.id).length : part.patterns.length;
            return (
              <button
                key={k.id ?? "all"}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectKit(k.id)}
                className={`-mb-px cursor-pointer border-b-2 py-2.5 text-[13px] font-medium transition-colors ${
                  selected ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {k.id ? kitDisplayName(k.id, k.name) : k.name} <span className="text-muted">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div role="tabpanel" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => {
          const active = playingId === pattern.id;
          return (
            <div
              key={pattern.id}
              className={`min-w-0 rounded-xl border bg-white px-4 py-3.5 transition-colors ${active ? "border-brand" : "border-line"}`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void toggle(pattern)}
                  aria-label={`${active ? "Stop" : "Play"} ${kitDisplayName(pattern.kitId, pattern.kitName)} ${pattern.name}`}
                  aria-pressed={active}
                  className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors [&_svg]:h-4 [&_svg]:w-4 ${
                    active ? "bg-brand text-white" : "bg-ink text-white hover:bg-brand"
                  }`}
                >
                  {active ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline justify-between gap-2 text-sm font-medium">
                    <span className="truncate">{pattern.name}</span>
                    <span className="shrink-0 text-xs font-normal text-muted">{pattern.bpm} BPM</span>
                  </p>
                  {!onlyKit && (
                    <p className="truncate text-xs text-muted">{kitDisplayName(pattern.kitId, pattern.kitName)}</p>
                  )}
                  <div className="mt-2">
                    <MidiLane
                      pattern={pattern}
                      progress={active ? progress : 0}
                      active={active}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > VISIBLE && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="h-11 cursor-pointer rounded-full border border-ink px-6 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-white"
          >
            {expanded ? "Show fewer" : `Show all ${filtered.length}`}
          </button>
        </div>
      )}
    </Section>
  );
}

export default MidiKits;
