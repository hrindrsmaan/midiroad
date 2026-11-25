import type { Metadata } from "next";
import Link from "next/link";
import { KitCover } from "@/components/KitCover";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { BUNDLE_ID, BUNDLE_NAME, BUNDLE_PRICE, KIT_PRODUCTS, kitStats } from "@/lib/products";
import { PRICING, formatUSD } from "@/lib/pricing";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

const title = "MIDI Drum Kits for Trap, Drill and 808s";
const description = "Shop royalty-free MIDI drum kits for trap, drill, dark trap and 808s, or get every kit in The Complete Vault.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/kits" });

export default function KitsIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: absoluteUrl("/kits"),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: KIT_PRODUCTS.length + 1,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: BUNDLE_NAME,
                url: absoluteUrl("/"),
              },
              ...KIT_PRODUCTS.map((kit, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: kit.name,
                url: absoluteUrl(`/kits/${kit.slug}`),
              })),
            ],
          },
        }}
      />
      <SiteNav />
      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow className="mb-3">Shop</Eyebrow>
          <h1 className="max-w-3xl text-4xl leading-[0.98] md:text-6xl">MIDI drum kits</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Buy one kit, or take every pattern and the one-shots in {BUNDLE_NAME}. One-time purchase, royalty-free,
            instant download.
          </p>
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li className="rounded-md border border-brand/40 bg-card p-4">
              <Link href="/#main-cta" className="block">
                <p className="text-xs font-semibold text-brand">Best value</p>
                <h2 className="mt-2 font-sans text-xl font-semibold">{BUNDLE_NAME}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">Every kit, plus one-shots that are only in the bundle.</p>
              </Link>
              <p className="mt-4 text-sm">
                <span className="mr-2 text-muted line-through">{formatUSD(PRICING.originalPrice)}</span>
                <span className="font-wide text-lg text-brand">{formatUSD(BUNDLE_PRICE)}</span>
              </p>
              <AddToCartButton product={BUNDLE_ID} label={`Add ${BUNDLE_NAME}`} className="mt-4 h-11 w-full rounded-key bg-brand text-sm font-semibold text-on-brand hover:bg-brand-hover" />
            </li>
            {KIT_PRODUCTS.map((kit) => {
              const stats = kitStats(kit);
              return (
                <li key={kit.id} className="rounded-md border border-line bg-card p-4">
                  <Link href={`/kits/${kit.slug}`} className="grid grid-cols-[5.5rem_1fr] gap-4">
                    <KitCover kit={kit} />
                    <span>
                      <h2 className="font-sans text-lg font-semibold leading-tight">{kit.name}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{kit.tagline}</p>
                      <p className="mt-2 text-xs text-muted">
                        <span className="font-wide text-xs">{stats.patterns}</span> patterns · {stats.minBpm}–{stats.maxBpm} BPM
                      </p>
                    </span>
                  </Link>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-wide text-lg text-brand">{formatUSD(kit.price)}</p>
                    <AddToCartButton product={kit.id} label={`Add ${kit.name}`} className="h-10 rounded-key border border-strong px-4 text-xs font-semibold hover:bg-foreground/[0.06]" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
