import { TrackedLink } from "@/components/TrackedLink";

/** A sixteen-step row per lane: which steps light up, as a hint of the grid. */
const LANES = [
  { label: "Hats", color: "bg-chart-hats", steps: "1111111111111111" },
  { label: "Snare", color: "bg-chart-snare", steps: "0000100000001000" },
  { label: "Kick", color: "bg-chart-kick", steps: "1000001000100000" },
  { label: "808", color: "bg-chart-bass", steps: "1000001000100010" },
];

const CHORDS = ["Cm", "A♭", "E♭", "B♭"];

const LINK_CLASS =
  "mt-auto inline-flex h-11 items-center self-start rounded-key border border-strong px-5 text-sm font-semibold transition-colors hover:bg-foreground/[0.06]";

/**
 * The two free tools as side-by-side cards on the home page. The tools
 * themselves live on their own pages, so the home page stays short.
 */
export function FreeToolsCards() {
  return (
    <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-16 bg-background px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 id="tools-heading" className="mb-6 text-2xl md:text-[32px]">
          Free tools for your next beat
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-md border border-line bg-card p-6">
            <div aria-hidden className="space-y-1.5">
              {LANES.map((lane) => (
                <div key={lane.label} className="grid grid-cols-16 gap-1">
                  {[...lane.steps].map((on, i) => (
                    <span
                      key={i}
                      className={`h-3 rounded-[2px] ${on === "1" ? lane.color : "bg-foreground/[0.05]"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold">Make a trap beat in one click</h3>
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Generate hats, snare, kick and 808, shape it with tempo, key and mutes, then export the MIDI.
            </p>
            <TrackedLink
              href="/beat-maker"
              track={{ action: "click_beat_maker", category: "navigation", label: "home_promo" }}
              className={LINK_CLASS}
            >
              Open the beat maker
            </TrackedLink>
          </div>

          <div className="flex flex-col gap-4 rounded-md border border-line bg-card p-6">
            <div aria-hidden className="grid grid-cols-4 gap-1.5">
              {CHORDS.map((c) => (
                <span key={c} className="grid h-[57px] place-items-center rounded-[4px] bg-canvas font-bold">
                  {c}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold">Make a chord progression in seconds</h3>
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Pick a key, edit the chords on a piano roll, choose a rhythm and sound, then export the MIDI.
            </p>
            <TrackedLink
              href="/chord-maker"
              track={{ action: "click_chord_maker", category: "navigation", label: "home_promo" }}
              className={LINK_CLASS}
            >
              Open the chord maker
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FreeToolsCards;
