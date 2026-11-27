import Link from "next/link";
import { KitCardPlay } from "@/components/BundlePreviews";
import { KitCover } from "@/components/KitCover";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { KIT_PRODUCTS } from "@/lib/products";
import { formatUSD } from "@/lib/pricing";

/**
 * The single kits on the home page, each playable and buyable on its own.
 * The Vault itself is sold in the hero, so this section doesn't repeat it.
 */
export function KitShelf() {
  return (
    <section id="kits" aria-labelledby="kits-heading" className="scroll-mt-16 bg-canvas px-5 py-14 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="kits-heading" className="text-2xl md:text-[32px]">
              Or buy one kit at a time
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Every kit is also sold on its own. Press play to hear it first.
            </p>
          </div>
          <Link href="/kits" className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-brand">
            Compare all kits
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-5">
          {KIT_PRODUCTS.map((kit) => (
            <li key={kit.id}>
              <Link
                href={`/kits/${kit.slug}`}
                className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  <KitCover kit={kit} idPrefix="shelf" />
                </div>
                <p className="mt-3 text-sm font-medium leading-snug">{kit.name}</p>
                <p className="mt-1 text-sm tabular-nums">
                  {kit.originalPrice !== undefined && (
                    <span className="mr-2 text-muted line-through">{formatUSD(kit.originalPrice)}</span>
                  )}
                  <span className="font-bold text-brand">{formatUSD(kit.price)}</span>
                </p>
              </Link>
              <div className="mt-2 flex flex-wrap gap-2">
                <KitCardPlay kitId={kit.id} kitName={kit.name} />
                <AddToCartButton
                  product={kit.id}
                  className="h-11 rounded-key border border-strong px-3.5 text-[13px] font-semibold transition-colors hover:bg-foreground/[0.06]"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
