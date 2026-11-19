"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon, Waveform } from "@/components/AudioPreviews";
import { Section, SectionHeader, type Tone } from "@/components/Section";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import { MIDI_KITS, MIDI_PARTS, MIDI_PATTERN_COUNT } from "@/lib/midi-kits";
import { kitDisplayName } from "@/lib/products";

/** Patterns shown per part before "Show all". */
const VISIBLE = 12;
/** Waveform height in px, shorter than the product-section previews. */
const WAVE_HEIGHT = 18;

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
                  <div className="mt-1.5 flex">
                    <Waveform peaks={pattern.peaks} progress={active ? progress : 0} height={WAVE_HEIGHT} fluid />
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
