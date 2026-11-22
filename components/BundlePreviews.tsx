"use client";

import { PauseIcon, PlayIcon, Waveform } from "@/components/AudioPreviews";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import { MIDI_KITS, type MidiKit, type MidiPattern } from "@/lib/midi-kits";
import { kitDisplayName } from "@/lib/products";

/** A kit's showcase pattern: the first one from its biggest part. */
export function featuredPattern(kit: MidiKit): { pattern: MidiPattern; part: string } | null {
  const main = [...kit.parts].sort((a, b) => b.patterns.length - a.patterns.length)[0];
  const pattern = main?.patterns[0];
  return pattern ? { pattern, part: main.label } : null;
}

/**
 * "Hear it before you buy" for the bundle: one pattern from every kit, played
 * through the bundle's own one-shots, right beside the buy buttons.
 */
export function BundlePreviews() {
  const { playingId, progress, toggle } = useMidiPlayer();
  const items = MIDI_KITS.flatMap((kit) => {
    const f = featuredPattern(kit);
    return f ? [{ kit, ...f }] : [];
  });
  if (items.length === 0) return null;

  return (
    <div className="rounded-md border border-line p-5 sm:p-6">
      <p className="mb-5 text-xs font-semibold text-muted">Hear a pattern from every kit</p>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        {items.map(({ kit, pattern, part }) => {
          const active = playingId === pattern.id;
          const name = kitDisplayName(kit.id, kit.name);
          const label = `${name} · ${part}`;
          return (
            <li key={pattern.id} className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => void toggle(pattern)}
                aria-label={`${active ? "Stop" : "Play"} ${label}`}
                aria-pressed={active}
                className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-key border transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5 ${
                  active
                    ? "border-brand text-brand"
                    : "border-strong text-ink hover:bg-white/10"
                }`}
              >
                {active ? <PauseIcon /> : <PlayIcon />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 truncate text-[13px] font-medium leading-snug">
                  {name} <span className="font-normal text-muted">· {part}</span>
                </p>
                <Waveform peaks={pattern.peaks} progress={active ? progress : 0} height={12} fluid />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A small play button for a kit card in the store grid. */
export function KitCardPlay({ kitId, kitName }: { kitId: string; kitName: string }) {
  const { playingId, toggle } = useMidiPlayer();
  const kit = MIDI_KITS.find((k) => k.id === kitId);
  const f = kit ? featuredPattern(kit) : null;
  if (!f) return null;
  const active = playingId === f.pattern.id;
  return (
    <button
      type="button"
      onClick={() => void toggle(f.pattern)}
      aria-label={`${active ? "Stop" : "Play"} a ${kitName} pattern`}
      aria-pressed={active}
      className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-key border px-3 text-[13px] font-semibold transition-colors [&_svg]:h-3 [&_svg]:w-3 ${
        active ? "border-brand text-brand" : "border-strong hover:bg-white/10"
      }`}
    >
      {active ? <PauseIcon /> : <PlayIcon />}
      {active ? "Stop" : "Play"}
    </button>
  );
}

export default BundlePreviews;
