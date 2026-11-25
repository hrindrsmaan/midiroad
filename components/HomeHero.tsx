import Link from "next/link";
import { MIDI_PATTERN_COUNT } from "@/lib/midi-kits";

/** Keyword-first homepage hero. The vault sits below it, not in place of it. */
export function HomeHero() {
  return (
    <section className="px-5 pb-8 pt-16 md:pb-12 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-muted">Royalty-free MIDI · one-time purchase</p>
        <h1 className="mt-4 max-w-4xl text-[42px] leading-[0.95] tracking-[-0.04em] md:text-[76px]">
          MIDI drum kits for trap, drill & more
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {MIDI_PATTERN_COUNT} hi-hats, snares, kicks and 808s you can preview in the browser, then drag into FL
          Studio, Ableton, Logic or any DAW.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/kits"
            className="inline-flex h-12 items-center rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
          >
            Shop kits
          </Link>
          <Link
            href="/free-midi-kit"
            className="inline-flex h-12 items-center rounded-key border border-strong px-6 text-sm font-semibold text-ink transition-colors hover:bg-white/10"
          >
            Get the free kit
          </Link>
        </div>
      </div>
    </section>
  );
}
