import Link from "next/link";
import { BUY_BUTTON_CLASS, BuyButton } from "@/components/BuyButton";
import { MIDI_PATTERN_COUNT } from "@/lib/midi-kits";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, KIT_PRODUCTS } from "@/lib/products";
import { BUNDLE_PRICE_NOW, PRICING, REFUND_DAYS, centsPerPattern, formatUSD } from "@/lib/pricing";

const CHEAPEST_KIT = Math.min(...KIT_PRODUCTS.map((kit) => kit.price));

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

        <div className="mt-8 max-w-xl">
          <p className="text-sm font-semibold text-brand">
            The Complete Vault · every kit + {ONE_SHOT_COUNT} one-shots
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-wide text-[40px] leading-none text-ink">{formatUSD(BUNDLE_PRICE_NOW)}</span>
            {PRICING.originalPrice > BUNDLE_PRICE_NOW && (
              <span className="text-lg text-muted line-through">{formatUSD(PRICING.originalPrice)}</span>
            )}
            <span className="text-sm text-muted">one payment · yours forever</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {PRICING.discountPercent}% less than buying the kits one by one · about {centsPerPattern(MIDI_PATTERN_COUNT)}¢ a
            pattern
          </p>
          <div className="mt-5 max-w-sm">
            <BuyButton product={BUNDLE_ID} label="Homepage hero" className={BUY_BUTTON_CLASS}>
              Get The Complete Vault
            </BuyButton>
            <p className="mt-2 text-xs text-muted">{REFUND_DAYS}-day money-back guarantee</p>
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link href="/#main-cta" className="font-semibold text-ink underline underline-offset-4">
              See what&apos;s in it
            </Link>
            <span className="mx-2 text-line">·</span>
            <Link href="/kits" className="font-semibold text-ink underline underline-offset-4">
              Or buy one kit at a time
            </Link>{" "}
            from {formatUSD(CHEAPEST_KIT)}
            <span className="mx-2 text-line">·</span>
            <Link href="/free-midi-kit" className="font-semibold text-ink underline underline-offset-4">
              Get 12 patterns for $1
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
