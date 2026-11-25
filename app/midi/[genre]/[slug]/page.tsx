import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { FreeKitBanner, FreeKitLink } from "@/components/FreeKitCta";
import { JsonLd } from "@/components/JsonLd";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { PatternDownload } from "@/components/PatternDownload";
import { PatternStage } from "@/components/catalog/PatternStage";
import { TrackTable } from "@/components/catalog/TrackTable";
import { toCatalogTrack } from "@/lib/catalog";
import { waveCode } from "@/lib/tracks";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { googleConfigured } from "@/lib/auth";
import {
  PATTERNS,
  bpmPath,
  bpmRangeFor,
  genrePath,
  patternJsonLd,
  patternBySlug,
  relatedPatterns,
  sameGroove,
} from "@/lib/patterns";
import { formatUSD } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return PATTERNS.map((pattern) => ({ genre: pattern.genreSlug, slug: pattern.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ genre: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { genre, slug } = await params;
  const pattern = patternBySlug(genre, slug);
  if (!pattern) return {};
  const sig = pattern.timeSignature ? ` ${pattern.timeSignature}` : "";
  return pageMetadata({
    title: `${pattern.title} MIDI, ${pattern.bpm} BPM${sig}`,
    description: pattern.metaDescription,
    path: pattern.path,
  });
}

export default async function PatternPage({ params }: Params) {
  const { genre, slug } = await params;
  const pattern = patternBySlug(genre, slug);
  if (!pattern) notFound();

  const range = bpmRangeFor(pattern.bpm);
  const related = relatedPatterns(pattern);
  const copies = sameGroove(pattern);
  const sig = pattern.timeSignature ?? "—";

  const facts = [
    ["Style", pattern.genreName],
    ["Part", pattern.partLabel],
    ["Tempo", `${pattern.bpm} BPM`],
    ["Time", sig],
    ["Length", `${pattern.bars} bars`],
    ["Kit", pattern.kitName],
  ];

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={patternJsonLd(pattern)} />
      <SiteNav />
      <article className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm text-muted">
            <Link href="/midi" className="hover:text-ink">
              MIDI patterns
            </Link>
            <span aria-hidden> / </span>
            <Link href={genrePath({ slug: pattern.genreSlug })} className="hover:text-ink">
              {pattern.genreName}
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">{pattern.title}</span>
          </nav>
          <Eyebrow className="mb-3">
            {pattern.genreName} · {pattern.partLabel}
          </Eyebrow>
          <h1 className="text-3xl leading-tight md:text-5xl">{pattern.title}</h1>
          <p className="mt-3 text-muted">
            <span className="font-wide text-base text-ink">{pattern.bpm} BPM</span>
            {pattern.timeSignature ? ` · ${pattern.timeSignature}` : ""} · {pattern.bars} bars · {pattern.kitName}
          </p>

          <div className="mt-8">
            <PatternStage
              track={toCatalogTrack(pattern)}
              queue={[pattern, ...related].map((item) => toCatalogTrack(item))}
              detailWave={waveCode(pattern.peaks, 96)}
            />
          </div>

          <p className="mt-8 max-w-xl text-[16px] leading-relaxed">{pattern.description}</p>

          <dl className="mt-8 divide-y divide-line rounded-md border border-line text-sm">
            {facts.map(([term, value]) => (
              <div key={term} className="flex gap-4 px-4 py-3">
                <dt className="w-24 shrink-0 text-muted">{term}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col items-start gap-4">
            <AddToCartButton
              product={pattern.kitId}
              label={`Add ${pattern.kitName} · ${formatUSD(pattern.kitPrice)}`}
              className="h-12 rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
            />
            <PatternDownload
              libraryId={pattern.libraryId}
              fileName={pattern.title}
              google={googleConfigured}
              path={pattern.path}
            />
            <p className="text-sm text-muted">
              The kit includes this file. One credit unlocks just this MIDI.{" "}
              <Link href="/pricing" className="font-semibold text-ink underline underline-offset-4">
                See plans
              </Link>
            </p>
            <FreeKitLink
              source="pattern-page"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
            >
              Get {FREE_KIT_COUNT} patterns for $1
              <span aria-hidden>→</span>
            </FreeKitLink>
          </div>

          <ul className="mt-10 space-y-2 text-sm">
            <li>
              <Link href={`/kits/${pattern.kitSlug}`} className="text-ink underline underline-offset-4">
                More from {pattern.kitName}
              </Link>
            </li>
            <li>
              <Link href={genrePath({ slug: pattern.genreSlug })} className="text-ink underline underline-offset-4">
                All {pattern.genreName.toLowerCase()} patterns
              </Link>
            </li>
            {range && (
              <li>
                <Link href={bpmPath(range)} className="text-ink underline underline-offset-4">
                  More patterns at {range.label}
                </Link>
              </li>
            )}
          </ul>

          <FreeKitBanner source="pattern-page" count={FREE_KIT_COUNT} className="mt-10" />

          {copies.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Same groove, other kits</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {copies.map((other) => (
                  <li key={other.id}>
                    <Link href={other.path} className="text-ink underline underline-offset-4">
                      {other.title}
                    </Link>
                    <span className="text-muted"> · {other.kitName}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Related {pattern.partLabel.toLowerCase()}</h2>
              <div className="mt-4">
                <TrackTable
                  tracks={related.map((item) => toCatalogTrack(item))}
                  queue={[pattern, ...related].map((item) => toCatalogTrack(item))}
                  label={`Related ${pattern.partLabel}`}
                />
              </div>
            </section>
          )}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
