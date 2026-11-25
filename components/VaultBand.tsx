import { BundleSpread } from "@/components/KitCover";
import { BlackFridayDeal } from "@/components/BlackFriday";
import { BUY_BUTTON_CLASS, BuyButton } from "@/components/BuyButton";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { Eyebrow } from "@/components/Section";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, BUNDLE_NAME, KITS_TOTAL, KIT_PRODUCTS } from "@/lib/products";
import { BLACK_FRIDAY, PRICING, formatUSD } from "@/lib/pricing";

const STATS = [
  { value: KIT_PRODUCTS.length, label: "MIDI kits" },
  { value: MIDI_PATTERN_COUNT, label: "MIDI patterns" },
  { value: ONE_SHOT_COUNT, label: "One-shots", note: "Bundle only" },
];

/** The Complete Vault, visible on the homepage without taking over the page. */
export function VaultBand() {
  return (
    <section id="main-cta" className="scroll-mt-16 bg-canvas px-5 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="mx-auto w-full max-w-sm">
          <BundleSpread />
        </div>
        <div>
          <Eyebrow className="mb-3">{BLACK_FRIDAY.active ? "Black Friday sale · Every kit" : "Best value · Every kit"}</Eyebrow>
          <h2 className="text-[32px] leading-[1] tracking-[-0.03em] md:text-[48px]">{BUNDLE_NAME}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Every MidiRoad kit and all {ONE_SHOT_COUNT} one-shots in one download. Drag the MIDI into your DAW and
            start the beat.
          </p>
          <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="text-xl tabular-nums text-muted line-through">{formatUSD(PRICING.originalPrice)}</span>
            <span className="font-wide text-[34px] leading-none text-brand md:text-[44px]">{formatUSD(PRICING.currentPrice)}</span>
            <span className="self-center rounded-key bg-primary px-2.5 py-1 text-xs font-bold text-on-brand">
              {BLACK_FRIDAY.active ? "Black Friday · " : ""}Save {PRICING.discountPercent}%
            </span>
          </p>
          <div className="mt-5 max-w-md">
            <BlackFridayDeal />
          </div>
          <div className="mt-6 max-w-md space-y-3">
            <AddToCartButton product={BUNDLE_ID} className={BUY_BUTTON_CLASS} />
            <BuyButton product={BUNDLE_ID} label="Product Section Button" className="h-12 w-full rounded-key border border-strong bg-transparent text-sm font-semibold text-ink shadow-none hover:bg-foreground/[0.06]">
              Buy it now
            </BuyButton>
          </div>
          <dl className="mt-8 grid max-w-md grid-cols-3 divide-x divide-line overflow-hidden rounded-md border border-line">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-3 py-3.5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-wide text-2xl tabular-nums text-ink">{stat.value}</dd>
                <dd className="mt-0.5 text-xs text-muted">{stat.label}</dd>
                {stat.note && <dd className="mt-1 text-xs font-semibold text-brand">{stat.note}</dd>}
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-md text-pretty text-[15px] leading-relaxed text-ink/80">
            Every kit in the store in one download, for dark trap, RnB and soul. Bought separately the kits cost{" "}
            {formatUSD(KITS_TOTAL)}; the one-shots are only in the bundle.
          </p>
        </div>
      </div>
    </section>
  );
}
