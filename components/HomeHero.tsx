import { BuyButton } from "@/components/BuyButton";
import { VaultStack } from "@/components/KitCover";
import { MIDI_PATTERN_COUNT } from "@/lib/midi-kits";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID } from "@/lib/products";
import { BUNDLE_PRICE_NOW, PRICING, REFUND_DAYS, centsPerPattern, formatUSD } from "@/lib/pricing";

/**
 * BUY_BUTTON_CLASS lives in a client module, so a server component can pass it
 * along but can't build a new string from it; this is its hero-sized copy.
 */
const HERO_BUY_CLASS =
  "w-full h-14 rounded-key bg-brand hover:bg-brand-hover text-on-brand text-base font-semibold shadow-[inset_0_0_0_1px_rgba(87,217,138,0.6)] transition-colors md:w-auto md:px-8 md:text-[17px]";

/**
 * Homepage hero, "night stage": the Vault on ink. The headline and the one
 * offer on the left, every kit's box stacked on the right (between the pitch
 * and the price on a phone).
 */
export function HomeHero() {
  const saving = PRICING.originalPrice > BUNDLE_PRICE_NOW;

  return (
    <section id="main-cta" className="tone-night relative scroll-mt-16 overflow-hidden bg-background px-5 pb-10 pt-8 md:pb-14 md:pt-16">
      {/* Light on the boxes: a green bloom behind the stack, a faint violet one low left. */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[640px] rounded-full bg-brand opacity-40 blur-[120px] md:right-[-6%] md:top-16 md:h-[620px] md:w-[760px]" />
      <div aria-hidden className="pointer-events-none absolute -left-48 bottom-0 hidden h-[400px] w-[600px] rounded-full bg-[#7c6cff] opacity-[0.12] blur-[130px] md:block" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-x-10">
        <div className="min-w-0 md:self-center">
          <p className="inline-flex rounded-full border border-strong px-3 py-1.5 text-xs font-semibold text-muted md:text-[13px]">
            MIDI drum kits for trap, drill &amp; RnB<span className="hidden md:inline">&nbsp;· royalty-free</span>
          </p>
          <h1 className="mt-4 text-balance text-[44px] leading-[0.96] tracking-[-0.045em] md:mt-5 md:text-[80px] md:leading-[0.95]">
            Hear the drums{" "}
            <span className="text-night-green [text-shadow:0_0_28px_rgba(43,217,107,0.5)]">before you buy</span> them.
          </h1>
          <p className="mt-4 max-w-[500px] text-pretty text-[15px] leading-relaxed text-muted md:mt-6 md:text-lg">
            {MIDI_PATTERN_COUNT} hi-hat, snare, kick and 808 patterns. Press play on any of them, then drag the MIDI into
            FL Studio, Ableton, Logic or any DAW.
          </p>

          {/* The stack sits here on a phone, between the pitch and the price. */}
          <div className="-mx-2 mt-6 md:hidden">
            <VaultStack idPrefix="hero-m" />
          </div>

          <div className="mt-6 flex flex-col gap-1.5 md:mt-8">
            <p className="text-[13px] font-semibold text-night-green md:text-sm">
              The Complete Vault · every kit + {ONE_SHOT_COUNT} one-shots
            </p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-wide text-[38px] leading-none text-ink md:text-[46px]">{formatUSD(BUNDLE_PRICE_NOW)}</span>
              {saving && (
                <>
                  <span className="text-[15px] text-muted line-through">{formatUSD(PRICING.originalPrice)}</span>
                  <span className="self-center rounded-full bg-night-green px-2.5 py-1 text-xs font-bold text-background">
                    Save {PRICING.discountPercent}%
                  </span>
                </>
              )}
            </p>
            <p className="text-[13px] text-muted md:text-sm">
              One payment, yours forever · about {centsPerPattern(MIDI_PATTERN_COUNT)}¢ a pattern
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 md:mt-7 md:flex-row md:items-center md:gap-5">
            <BuyButton product={BUNDLE_ID} label="Homepage hero" className={HERO_BUY_CLASS}>
              Get The Complete Vault
            </BuyButton>
            <p className="text-center text-xs text-muted md:text-left md:text-[13px]">
              {REFUND_DAYS}-day money-back guarantee
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 md:block md:self-center">
          <VaultStack reflect idPrefix="hero" />
        </div>
      </div>
    </section>
  );
}
