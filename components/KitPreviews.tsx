"use client";

import { PauseIcon, PlayIcon, Waveform } from "@/components/AudioPreviews";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import { MIDI_KITS, type MidiPattern } from "@/lib/midi-kits";

const SMALL = 6;

/**
 * Compact players for a kit's product page: one featured pattern full width,
 * then a few more drawn from every part of the kit, three to a row.
 */
export function KitPreviews({ kitId, kitName }: { kitId: string; kitName: string }) {
  const { playingId, progress, toggle } = useMidiPlayer();
  const kit = MIDI_KITS.find((k) => k.id === kitId);
  if (!kit) return null;

  // Feature the first pattern of the kit's biggest part.
  const main = [...kit.parts].sort((a, b) => b.patterns.length - a.patterns.length)[0];
  const featured = main.patterns[0];

  // Round-robin across parts so every drum part is heard.
  const rest: MidiPattern[] = [];
  for (let i = 0; rest.length < SMALL; i++) {
    const row = kit.parts.map((p) => p.patterns[i]).filter((p) => p && p !== featured);
    if (row.length === 0 && kit.parts.every((p) => i >= p.patterns.length)) break;
    rest.push(...row.slice(0, SMALL - rest.length));
  }

  const player = (pattern: MidiPattern, label: string, height: number) => {
    const active = playingId === pattern.id;
    return (
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void toggle(pattern)}
            aria-label={`${active ? "Stop" : "Play"} ${label}`}
            aria-pressed={active}
            className={`shrink-0 cursor-pointer transition-colors hover:text-brand [&_svg]:h-5 [&_svg]:w-5 ${active ? "text-brand" : "text-ink"}`}
          >
            {active ? <PauseIcon /> : <PlayIcon />}
          </button>
          <Waveform
            peaks={pattern.peaks}
            progress={active ? progress : 0}
            height={height}
            fluid
          />
        </div>
        <p className="mt-1.5 pl-7 text-center text-[13px] font-medium leading-snug">{label}</p>
      </div>
    );
  };

  return (
    <div className="space-y-5 rounded-md border border-line p-5 sm:p-6">
      {player(featured, `${kitName} · ${main.label}`, 28)}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
        {rest.map((p) => (
          <div key={p.id}>{player(p, p.name, 14)}</div>
        ))}
      </div>
    </div>
  );
}

export default KitPreviews;
