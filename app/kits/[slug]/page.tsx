import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SECONDARY_BUTTON_CLASS } from "@/components/BuyButton";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { KitCover } from "@/components/KitCover";
import { Eyebrow } from "@/components/Section";
import { KitGrid } from "@/components/KitGrid";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/lib/faq";
import { faqJsonLd, kitJsonLd } from "@/lib/site";
import { catalogMetadata } from "@/lib/catalog-meta";
import { toCatalogTrack } from "@/lib/catalog";
import { prepareListing, type ListingSearch } from "@/lib/listing";
import { HeroBlock, ProductHero } from "@/components/ProductHero";
import { SiteFooter, SiteNav, StickyBuyBar } from "@/components/SiteChrome";
import { ONE_SHOT_COUNT, MIDI_PATTERN_COUNT } from "@/lib/bundle";
import { genreForKit, genrePath, PATTERNS } from "@/lib/patterns";
import {
  BUNDLE_ID,
  BUNDLE_NAME,
  BUNDLE_PRICE,
  KIT_PRODUCTS,
  kitBySlug,
  kitStats,
  midiKitFor,
} from "@/lib/products";
import { PRICING, formatUSD } from "@/lib/pricing";
import { googleConfigured } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<ListingSearch> };

export function generateStaticParams() {
  return KIT_PRODUCTS.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const kit = kitBySlug((await params).slug);
  if (!kit) return {};
  const stats = kitStats(kit);
  const title = `${kit.name} – MIDI Drum Kit, ${stats.patterns} Patterns`;
  const description = `${kit.tagline} ${stats.patterns} royalty-free MIDI drum patterns, ${stats.minBpm}–${stats.maxBpm} BPM. Drag and drop into FL Studio, Ableton, Logic or any DAW.`;
  return catalogMetadata({
    title,
    description,
    path: `/kits/${kit.slug}`,
    items: PATTERNS.filter((pattern) => pattern.kitId === kit.id),
    searchParams: await searchParams,
  });
}

export default async function KitPage({ params, searchParams }: Params) {
  const kit = kitBySlug((await params).slug);
  if (!kit) notFound();

  const stats = kitStats(kit);
  const parts = midiKitFor(kit).parts;
  const upgradeCost = BUNDLE_PRICE - kit.price;
  const patterns = PATTERNS.filter((pattern) => pattern.kitId === kit.id);
  const path = `/kits/${kit.slug}`;
  const prepared = prepareListing(patterns, await searchParams, path);
  if (prepared.status === "redirect") permanentRedirect(prepared.href);
  if (prepared.status === "not-found") notFound();
  const genre = genreForKit(kit.id);

  const specs = [
    ["Files", `${stats.patterns} MIDI`],
    ["Parts", parts.map((p) => `${p.patterns.length} ${p.label}`).join(" · ")],
    ["Tempo", `${stats.minBpm}–${stats.maxBpm} BPM`],
    ["Works in", "FL Studio, Ableton, Logic and any DAW"],
    ["License", "100% royalty-free"],
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-background pb-24 md:pb-0">
      <JsonLd data={[...kitJsonLd(kit), faqJsonLd(FAQS)]} />
      <SiteNav />

      <ProductHero
        product={kit.id}
        label="Kit Page Button"
        cover={<KitCover kit={kit} size="lg" priority />}
        eyebrow={`${kit.vibe} · MIDI kit`}
        title={kit.name}
        price={kit.price}
        originalPrice={kit.originalPrice}
        backLink={{ href: "/#kits", label: "All MIDI packs" }}
      >
        <HeroBlock title={kit.tagline}>
          <p className="text-[16px] leading-relaxed text-ink/80">{kit.description}</p>
        </HeroBlock>

        <HeroBlock title="Specs">
          <dl className="divide-y divide-line rounded-md border border-line text-sm">
            {specs.map(([term, value]) => (
              <div key={term} className="flex gap-4 px-4 py-3">
                <dt className="w-24 shrink-0 text-muted">{term}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </HeroBlock>

        {/* Bundle upsell: the whole store for a few dollars more */}
        <div className="rounded-md bg-canvas p-6">
          <Eyebrow>Better deal</Eyebrow>
          <p className="mt-2 text-[15px] leading-relaxed">
            Get <strong>all {KIT_PRODUCTS.length} kits + {ONE_SHOT_COUNT} one-shots</strong> for{" "}
            <span className="text-muted line-through">{formatUSD(PRICING.originalPrice)}</span>{" "}
            <strong className="text-brand">{formatUSD(BUNDLE_PRICE)}</strong>, only {formatUSD(upgradeCost)} more
            than this kit.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <AddToCartButton
              product={BUNDLE_ID}
              label={`Add ${BUNDLE_NAME} to cart`}
              className={SECONDARY_BUTTON_CLASS}
            />
            <Link href="/" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
              See what&apos;s in it
            </Link>
          </div>
        </div>
      </ProductHero>

      <section className="bg-canvas px-5 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow className="mb-3">{stats.patterns} MIDI patterns</Eyebrow>
          <h2 className="text-2xl md:text-[32px]">Hear every pattern</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Press play on any pattern. Each MIDI is played with drum samples from the bundle&apos;s one-shot kit.{" "}
            <Link href="/midi" className="font-semibold text-ink underline underline-offset-4">
              Browse all {MIDI_PATTERN_COUNT} pattern pages
            </Link>
          </p>
          {genre && (
            <p className="mt-3 text-sm">
              <Link href={genrePath(genre)} className="font-semibold text-ink underline underline-offset-4">
                Open every {genre.name.toLowerCase()} pattern page
              </Link>
            </p>
          )}
          <CatalogListing
            path={path}
            query={prepared.query}
            view={prepared.view}
            tracks={prepared.view.rows.map((pattern) => toCatalogTrack(pattern))}
            showKit={false}
            downloads
            google={googleConfigured}
            label={`${kit.name} patterns`}
          />
        </div>
      </section>

      <KitGrid excludeId={kit.id} title="More MIDI packs" eyebrow="Keep exploring" tone="white" />

      <FAQSection tone="canvas" />

      <StickyBuyBar product={kit.id} price={kit.price} originalPrice={kit.originalPrice} />

      <SiteFooter />
    </main>
  );
}
