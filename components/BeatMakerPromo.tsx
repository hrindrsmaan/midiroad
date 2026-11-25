import { Eyebrow } from "@/components/Section";
import { TrackedLink } from "@/components/TrackedLink";
import { SIGNUP_CREDITS } from "@/lib/plans";

/** A sixteen-step row per lane: which steps light up, as a hint of the grid. */
const LANES = [
  { label: "Hats", color: "bg-chart-hats", steps: "1111111111111111" },
  { label: "Snare", color: "bg-chart-snare", steps: "0000100000001000" },
  { label: "Kick", color: "bg-chart-kick", steps: "1000001000100000" },
  { label: "808", color: "bg-chart-bass", steps: "1000001000100010" },
];

/** A band on the home page pointing to the free beat maker on its own page. */
export function BeatMakerPromo() {
  return (
    <section aria-labelledby="beat-maker-promo" className="bg-background px-5 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 rounded-md border border-line bg-card p-6 md:grid-cols-[1fr_1.1fr] md:gap-12 md:p-10">
        <div>
          <Eyebrow className="mb-3">Free · {SIGNUP_CREDITS} free downloads with an account</Eyebrow>
          <h2 id="beat-maker-promo" className="text-[28px] leading-[1.05] md:text-[40px]">
            Make a trap beat in one click
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Generate hats, snare, kick and 808, shape it with tempo, key and mutes, then export the MIDI.
          </p>
          <TrackedLink
            href="/beat-maker"
            track={{ action: "click_beat_maker", category: "navigation", label: "home_promo" }}
            className="mt-6 inline-flex h-12 items-center rounded-key bg-primary px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-primary-hover"
          >
            Open the beat maker
          </TrackedLink>
        </div>
        <div aria-hidden className="space-y-2">
          {LANES.map((lane) => (
            <div key={lane.label} className="flex items-center gap-3">
              <span className="w-10 shrink-0 text-xs text-muted">{lane.label}</span>
              <div className="grid flex-1 grid-cols-16 gap-1">
                {[...lane.steps].map((on, i) => (
                  <span
                    key={i}
                    className={`aspect-square rounded-[2px] ${on === "1" ? lane.color : "bg-foreground/[0.05]"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BeatMakerPromo;
