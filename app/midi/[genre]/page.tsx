import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PatternBrowser } from "@/components/PatternBrowser";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { genreCopy } from "@/lib/genre-content";
import { GENRES, genrePath, genreStats, patternGroups, patternListJsonLd } from "@/lib/patterns";
import { formatUSD } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL, absoluteUrl, faqJsonLd } from "@/lib/site";

export function generateStaticParams() {
  return GENRES.map((genre) => ({ genre: genre.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ genre: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const stats = genreStats((await params).genre);
  if (!stats) return {};
  const title = `${stats.genre.name} MIDI Drum Patterns`;
  const description = `${stats.kit.tagline} ${stats.patterns.length} royalty-free ${stats.genre.name.toLowerCase()} MIDI patterns, ${stats.minBpm}–${stats.maxBpm} BPM, from the ${stats.kit.name} kit.`;
  return pageMetadata({ title, description, path: genrePath(stats.genre) });
}

export default async function GenrePage({ params }: Params) {
  const stats = genreStats((await params).genre);
  if (!stats) notFound();
  const { genre, kit, patterns, minBpm, maxBpm } = stats;
  const title = `${genre.name} MIDI drum patterns`;
  const description = `${kit.tagline} ${patterns.length} royalty-free patterns from the ${kit.name} kit, ${minBpm}–${maxBpm} BPM. Preview each one, then buy the kit or unlock a single file with a credit.`;
  const path = genrePath(genre);
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

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[patternListJsonLd(title, description, absoluteUrl(path), patterns), breadcrumb, faqJsonLd(copy.faqs)]}
      />
      <SiteNav />
      <article className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 text-sm text-muted">
            <Link href="/midi" className="hover:text-ink">
              MIDI patterns
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">{genre.name}</span>
          </nav>
          <Eyebrow className="mb-3">{kit.name}</Eyebrow>
          <h1 className="max-w-3xl text-3xl leading-tight md:text-5xl">{title}</h1>
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
            </div>
          </section>
          <div className="mt-14">
            <PatternBrowser groups={patternGroups(patterns)} />
          </div>
          <div className="max-w-3xl">
            <FaqList faqs={copy.faqs} title={`${genre.name} MIDI FAQ`} />
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
