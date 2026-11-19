import Link from "next/link";
import { AudioPreviews } from "@/components/AudioPreviews";
import { BundleCover } from "@/components/KitCover";
import { HeroBlock, ProductHero } from "@/components/ProductHero";
import { PRICING, formatUSD } from "@/lib/pricing";
import { DRUM_KIT_NAME, MIDI_PATTERN_COUNT, ONE_SHOTS, ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, BUNDLE_NAME, KIT_PRODUCTS, kitStats } from "@/lib/products";

/** The bundle's hero: the first thing on the home page. */
export function ProductDetail() {
  return (
    <ProductHero
      id="main-cta"
      product={BUNDLE_ID}
      label="Product Section Button"
      cover={<BundleCover />}
      eyebrow="Best value · Every kit"
      title={BUNDLE_NAME}
      price={PRICING.currentPrice}
      originalPrice={PRICING.originalPrice}
      badge={`Save ${PRICING.discountPercent}%`}
    >
      <AudioPreviews />

      <HeroBlock title="Finish beats faster">
        <p className="text-[16px] leading-relaxed text-ink/80">
          Every kit in the store in one download: {MIDI_PATTERN_COUNT} drag-and-drop MIDI drum
          patterns plus {ONE_SHOT_COUNT} one-shots for dark trap, RnB and soul. Bought separately the
          kits cost {formatUSD(PRICING.originalPrice)}; the one-shots are only in the bundle.
        </p>
      </HeroBlock>

      <HeroBlock title="What's included">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {KIT_PRODUCTS.map((kit) => (
              <li key={kit.id}>
                <Link
                  href={`/kits/${kit.slug}`}
                  className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-canvas"
                >
                  <span
                    aria-hidden
                    className="h-6 w-6 shrink-0 rounded-md ring-1 ring-black/5"
                    style={{ background: `linear-gradient(135deg, ${kit.accent}, ${kit.accent2})` }}
                  />
                  <span className="flex min-w-0 flex-1 items-baseline gap-2">
                    <span className="truncate text-sm font-semibold text-ink">{kit.name}</span>
                    <span className="hidden truncate text-xs text-muted sm:inline">{kit.vibe}</span>
                  </span>
                  <span className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-sm font-semibold tabular-nums text-ink">
                      {kitStats(kit).patterns}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted">MIDI</span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 shrink-0 text-muted/50 transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                  >
                    <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}

            <li className="bg-ink/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink text-white">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path d="M2 9V7M5 11V5M8 13V3M11 11V5M14 9V7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-ink">{DRUM_KIT_NAME} one-shots</span>
                  <span className="rounded border border-brand/20 bg-brand/5 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-brand">
                    Bundle only
                  </span>
                </span>
                <span className="flex items-baseline gap-1 whitespace-nowrap pr-[26px]">
                  <span className="text-sm font-semibold tabular-nums text-ink">{ONE_SHOT_COUNT}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted">WAV</span>
                </span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1 pl-9">
                {ONE_SHOTS.map((o) => (
                  <li
                    key={o.label}
                    className="rounded border border-line bg-white px-1.5 py-0.5 text-[11px] text-muted"
                  >
                    <span className="font-semibold tabular-nums text-ink">{o.count}</span> {o.label}
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="flex items-center justify-between border-t border-line bg-canvas px-4 py-2 text-sm">
            <span className="font-medium text-ink">Total</span>
            <span className="tabular-nums text-muted">
              <span className="font-semibold text-ink">{MIDI_PATTERN_COUNT}</span> MIDI ·{" "}
              <span className="font-semibold text-ink">{ONE_SHOT_COUNT}</span> WAV
            </span>
          </div>
        </div>
      </HeroBlock>
    </ProductHero>
  );
}

export default ProductDetail;
