import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { Eyebrow } from "@/components/Section";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, BUNDLE_NAME, KIT_PRODUCTS, kitStats } from "@/lib/products";
import { BUNDLE_PRICE_NOW, PRICING, formatUSD } from "@/lib/pricing";

/**
 * The one-time products: the bundle and each kit, with a price. Used on the
 * pricing page so someone who lands there asking "how much is it" finds
 * something they can actually buy, instead of only plans.
 */
export function OneTimeProducts({ heading = "Prefer to own it once?" }: { heading?: string }) {
  return (
    <div>
      <Eyebrow className="mb-3">One-time purchase</Eyebrow>
      <h2 className="text-[26px] leading-tight tracking-[-0.02em] md:text-[36px]">{heading}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        One payment, the files are yours forever, and they&apos;re royalty-free for music you release. The plans
        below are only for unlocking single patterns and beat maker exports.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li className="rounded-md border border-brand/40 bg-card p-4">
          <p className="text-xs font-semibold text-brand">Best value</p>
          <h3 className="mt-2 font-sans text-lg font-semibold leading-tight">{BUNDLE_NAME}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            All {KIT_PRODUCTS.length} kits, plus {ONE_SHOT_COUNT} one-shots that are only in the bundle.
          </p>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-wide text-xl text-brand">{formatUSD(BUNDLE_PRICE_NOW)}</span>
            <span className="text-sm text-muted line-through">{formatUSD(PRICING.currentPrice)}</span>
          </p>
          <p className="mt-1 text-xs text-muted">One payment. Yours forever.</p>
          <div className="mt-4 space-y-2">
            <BuyButton
              product={BUNDLE_ID}
              label="Pricing page bundle"
              className="h-11 w-full rounded-key bg-brand text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
            >
              Buy The Complete Vault
            </BuyButton>
            <AddToCartButton
              product={BUNDLE_ID}
              label={`Add ${BUNDLE_NAME}`}
              className="h-11 w-full rounded-key border border-strong text-sm font-semibold transition-colors hover:bg-foreground/[0.06]"
            />
          </div>
        </li>

        {KIT_PRODUCTS.map((kit) => {
          const stats = kitStats(kit);
          return (
            <li key={kit.id} className="rounded-md border border-line bg-card p-4">
              <Link href={`/kits/${kit.slug}`} className="block">
                <h3 className="font-sans text-base font-semibold leading-tight hover:underline">{kit.name}</h3>
                <p className="mt-1 text-xs text-muted">
                  {stats.patterns} patterns · {stats.minBpm}–{stats.maxBpm} BPM
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{kit.tagline}</p>
              </Link>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="font-wide text-lg text-brand">{formatUSD(kit.price)}</p>
                <AddToCartButton
                  product={kit.id}
                  label={`Add ${kit.name}`}
                  className="h-10 rounded-key border border-strong px-4 text-xs font-semibold transition-colors hover:bg-foreground/[0.06]"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
