import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { FaqList } from "@/components/FaqList";
import { FreeKitBanner } from "@/components/FreeKitCta";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { toCatalogTrack } from "@/lib/catalog";
import { catalogMetadata } from "@/lib/catalog-meta";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { GENRE_BUY_LINK } from "@/lib/buyer-intent";
import { genreCopy } from "@/lib/genre-content";
import { prepareListing, type ListingSearch } from "@/lib/listing";
import { GENRES, genrePath, genreStats, patternListJsonLd } from "@/lib/patterns";
import { formatUSD } from "@/lib/pricing";
import { SITE_URL, absoluteUrl, faqJsonLd } from "@/lib/site";

export function generateStaticParams() {
  return GENRES.map((genre) => ({ genre: genre.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ genre: string }>; searchParams: Promise<ListingSearch> };

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const stats = genreStats((await params).genre);
  if (!stats) return {};
  const title = `${stats.genre.name} MIDI Drum Patterns`;
  const description = `${stats.kit.tagline} ${stats.patterns.length} royalty-free ${stats.genre.name.toLowerCase()} MIDI patterns, ${stats.minBpm}–${stats.maxBpm} BPM, from the ${stats.kit.name} kit.`;
  return catalogMetadata({
    title,
    description,
    path: genrePath(stats.genre),
    items: stats.patterns,
    searchParams: await searchParams,
  });
}

export default async function GenrePage({ params, searchParams }: Params) {
  const stats = genreStats((await params).genre);
  if (!stats) notFound();
  const { genre, kit, patterns, minBpm, maxBpm } = stats;
  const title = `${genre.name} MIDI drum patterns`;
  const description = `${kit.tagline} ${patterns.length} royalty-free patterns from the ${kit.name} kit, ${minBpm}–${maxBpm} BPM. Preview each one, then buy the kit or unlock a single file with a credit.`;
  const path = genrePath(genre);
  const prepared = prepareListing(patterns, await searchParams, path);
  if (prepared.status === "redirect") permanentRedirect(prepared.href);
  if (prepared.status === "not-found") notFound();
  const copy = genreCopy(genre.slug);
  if (!copy) throw new Error(`No hub copy for genre ${genre.slug} in lib/genre-content.ts`);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "MIDI", item: absoluteUrl("/midi") },
      { "@type": "ListItem", position: 3, name: `${genre.name} MIDI patterns`, item: absoluteUrl(path) },
    ],
  };
  const collection =
    prepared.meta.indexable && prepared.query.page === 1
      ? patternListJsonLd(title, description, absoluteUrl(path), patterns)
      : prepared.meta.indexable
        ? patternListJsonLd(title, description, absoluteUrl(prepared.meta.canonicalPath), prepared.view.rows)
        : null;

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={[...(collection ? [collection] : []), breadcrumb, faqJsonLd(copy.faqs)]} />
      <SiteNav />
      <article className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 text-sm text-muted">
            <Link href="/midi" className="hover:text-ink">
              MIDI patterns
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">{genre.name}</span>
          </nav>
          <Eyebrow className="mb-3">{kit.name}</Eyebrow>
          <h1 className="max-w-3xl text-3xl leading-[1.05] md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <AddToCartButton
              product={kit.id}
              label={`Add ${kit.name} · ${formatUSD(kit.price)}`}
              className="h-12 rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
            />
            <Link href={`/kits/${kit.slug}`} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
              Kit details
            </Link>
          </div>
          <FreeKitBanner source="genre-page" count={FREE_KIT_COUNT} className="mt-10 max-w-3xl" />
          <section aria-labelledby="about-heading" className="mt-12 max-w-3xl">
            <h2 id="about-heading" className="text-2xl md:text-[32px]">
              About {genre.name.toLowerCase()} drums
            </h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-foreground/90">
              {copy.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p>
                New to MIDI drums? Read{" "}
                <Link href="/guides/how-to-make-trap-drums" className="text-ink underline underline-offset-4">
                  how to make trap drums
                </Link>
                , or the step-by-step guides for{" "}
                <Link href="/guides/how-to-use-midi-drums-in-fl-studio" className="text-ink underline underline-offset-4">
                  FL Studio
                </Link>{" "}
                and{" "}
                <Link href="/guides/how-to-use-midi-drums-in-ableton" className="text-ink underline underline-offset-4">
                  Ableton
                </Link>
                .
              </p>
              {GENRE_BUY_LINK[genre.slug] && (
                <p>
                  Shopping for a kit rather than browsing files? See{" "}
                  <Link href={GENRE_BUY_LINK[genre.slug].href} className="text-ink underline underline-offset-4">
                    {GENRE_BUY_LINK[genre.slug].label}
                  </Link>
                  .
                </p>
              )}
            </div>
          </section>
          <CatalogListing
            path={path}
            query={prepared.query}
            view={prepared.view}
            tracks={prepared.view.rows.map((pattern) => toCatalogTrack(pattern))}
            label={`${genre.name} patterns`}
          />
          <div className="max-w-3xl">
            <FaqList faqs={copy.faqs} title={`${genre.name} MIDI FAQ`} />
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
