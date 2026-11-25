import type { MidiPattern } from "@/lib/midi-kits";

/** Below this a bucket is drawn as a rest dot, not a hit. */
const HIT_THRESHOLD = 0.08;
const INK = "#c2b6a2";
const BRAND = "#2e6b45";

/**
 * A pattern drawn like a lane in a MIDI editor: hits as pills, faint bar
 * lines from the BPM, and a playhead while it plays.
 */
export function MidiLane({
  pattern,
  progress,
  active,
}: {
  pattern: Pick<MidiPattern, "bpm" | "duration" | "peaks">;
  progress: number;
  active: boolean;
}) {
  const barSeconds = (4 * 60) / pattern.bpm;
  const bars = Math.max(0, Math.floor(pattern.duration / barSeconds));
  const played = progress * pattern.peaks.length;

  return (
    <div
      aria-hidden
      className="relative h-8 overflow-hidden rounded-[3px] border border-line/70 bg-canvas/60"
      style={active ? { boxShadow: `inset 0 0 0 1px ${BRAND}33, 0 0 18px -6px ${BRAND}` } : undefined}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="absolute inset-y-1.5 w-px bg-ink/[0.07]"
          style={{ left: `${(((i + 1) * barSeconds) / pattern.duration) * 100}%` }}
        />
      ))}
      <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-ink/[0.06]" />
      <div className="absolute inset-x-1.5 inset-y-1 flex items-center">
        {pattern.peaks.map((peak, i) => {
          const isHit = peak >= HIT_THRESHOLD;
          const lit = !active || i < played;
          return (
            <span key={i} className="flex h-full flex-1 items-center justify-center">
              {isHit ? (
                <span
                  className="block w-[3px] rounded-[1px] sm:w-1"
                  style={{
                    height: `${Math.max(28, peak * 100)}%`,
                    background: active && lit ? BRAND : INK,
                    opacity: lit ? 1 : 0.25,
                  }}
                />
              ) : (
                <span className="block h-[3px] w-[3px] rounded-key bg-ink/10" />
              )}
            </span>
          );
        })}
      </div>
      {active && (
        <span
          className="absolute inset-y-0 w-0.5 rounded-full"
          style={{ left: `${progress * 100}%`, background: BRAND }}
        />
      )}
    </div>
  );
}
