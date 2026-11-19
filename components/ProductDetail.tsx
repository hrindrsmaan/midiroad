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
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {KIT_PRODUCTS.map((kit) => (
            <li key={kit.id}>
              <Link
                href={`/kits/${kit.slug}`}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-canvas"
              >
                <span className="flex items-center gap-2.5 font-medium">
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: kit.accent }} />
                  {kit.name}
                </span>
                <span className="text-muted">{kitStats(kit).patterns} MIDI</span>
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <span className="flex items-center gap-2.5 font-medium">
              <span aria-hidden className="h-2 w-2 rounded-full bg-ink" />
              {DRUM_KIT_NAME} one-shots
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                Bundle only
              </span>
            </span>
            <span className="text-muted">{ONE_SHOT_COUNT} WAV</span>
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          One-shots: {ONE_SHOTS.map((o) => `${o.count} ${o.label}`).join(" · ")}. 44.1 kHz WAV.
        </p>
      </HeroBlock>
    </ProductHero>
  );
}

export default ProductDetail;
