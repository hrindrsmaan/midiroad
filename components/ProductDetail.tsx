import { BundlePreviews } from "@/components/BundlePreviews";
import { BundleSpread } from "@/components/KitCover";
import { ProductHero } from "@/components/ProductHero";
import { PRICING, formatUSD } from "@/lib/pricing";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, BUNDLE_NAME, KIT_PRODUCTS } from "@/lib/products";

/** What's in the box, at a glance. The poster beside it shows every kit. */
const STATS = [
  { value: KIT_PRODUCTS.length, label: "MIDI kits" },
  { value: MIDI_PATTERN_COUNT, label: "MIDI patterns" },
  { value: ONE_SHOT_COUNT, label: "One-shots", note: "Bundle only" },
];

/**
 * The bundle's product section. It leads the home page as its hero; on the
 * beat maker page it sits under the generator as a smaller upsell.
 */
export function ProductDetail({ variant = "hero" }: { variant?: "hero" | "upsell" }) {
  const hero = variant === "hero";
  return (
    <ProductHero
      id={hero ? "main-cta" : "bundle"}
      product={BUNDLE_ID}
      label={hero ? "Product Section Button" : "Beat Maker Upsell Button"}
      cover={<BundleSpread />}
      eyebrow="Best value · Every kit"
      title={BUNDLE_NAME}
      headingLevel={hero ? "h1" : "h2"}
      intro={
        hero
          ? `Every MidiRoad kit and all ${ONE_SHOT_COUNT} one-shots in one download. Drag the MIDI into your DAW and start the beat.`
          : `Want patterns written by hand? Get all ${KIT_PRODUCTS.length} kits and ${ONE_SHOT_COUNT} one-shots in one download.`
      }
      price={PRICING.currentPrice}
      originalPrice={PRICING.originalPrice}
      badge={`Save ${PRICING.discountPercent}%`}
      compact={!hero}
    >
      <div className="space-y-8">
        <BundlePreviews />
        <dl className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-md border border-line">
          {STATS.map((s) => (
            <div key={s.label} className="px-3 py-3.5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-wide text-2xl tabular-nums text-ink">{s.value}</dd>
              <dd className="mt-0.5 text-xs text-muted">{s.label}</dd>
              {s.note && (
                <dd className="mt-1 text-xs font-semibold text-brand">{s.note}</dd>
              )}
            </div>
          ))}
        </dl>
        <p className="text-pretty text-[15px] leading-relaxed text-ink/80">
          Every kit in the store in one download, for dark trap, RnB and soul. Bought separately the kits cost{" "}
          {formatUSD(PRICING.originalPrice)}; the one-shots are only in the bundle.
        </p>
      </div>
    </ProductHero>
  );
}

export default ProductDetail;
