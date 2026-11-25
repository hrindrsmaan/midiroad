import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { toCatalogTrack } from "@/lib/catalog";
import { catalogMetadata } from "@/lib/catalog-meta";
import { prepareListing, type ListingSearch } from "@/lib/listing";
import {
  BPM_RANGES,
  bpmPath,
  bpmRangeBySlug,
  patternListJsonLd,
  patternsInRange,
} from "@/lib/patterns";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return BPM_RANGES.map((range) => ({ range: range.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ range: string }>; searchParams: Promise<ListingSearch> };

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const range = bpmRangeBySlug((await params).range);
  if (!range) return {};
  const count = patternsInRange(range).length;
  return catalogMetadata({
    title: `${range.label} MIDI Drum Patterns`,
    description: `${range.description} ${count} hi-hats, snares, kicks, open hats and 808s you can preview in the browser.`,
    path: bpmPath(range),
    items: patternsInRange(range),
    searchParams: await searchParams,
  });
}

export default async function TempoPage({ params, searchParams }: Params) {
  const range = bpmRangeBySlug((await params).range);
  if (!range) notFound();
  const patterns = patternsInRange(range);
  const title = `${range.label} MIDI drum patterns`;
  const description = `${range.description} ${patterns.length} patterns from every MidiRoad kit. Preview one, then buy its kit or unlock the file with a credit.`;
  const path = bpmPath(range);
  const prepared = prepareListing(patterns, await searchParams, path);
  if (prepared.status === "redirect") permanentRedirect(prepared.href);
  if (prepared.status === "not-found") notFound();
  const collection =
    prepared.meta.indexable && prepared.query.page === 1
      ? patternListJsonLd(title, description, absoluteUrl(path), patterns)
      : prepared.meta.indexable
        ? patternListJsonLd(title, description, absoluteUrl(prepared.meta.canonicalPath), prepared.view.rows)
        : null;

  return (
    <main className="min-h-screen bg-background">
      {collection && <JsonLd data={collection} />}
      <SiteNav />
      <article className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 text-sm text-muted">
            <Link href="/midi" className="hover:text-ink">
              MIDI patterns
            </Link>
            <span aria-hidden> / </span>
            <Link href="/midi/bpm" className="hover:text-ink">
              Tempo
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">{range.label}</span>
          </nav>
          <Eyebrow className="mb-3">Tempo</Eyebrow>
          <h1 className="max-w-3xl text-3xl leading-[1.05] md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{description}</p>
          <CatalogListing
            path={path}
            query={prepared.query}
            view={prepared.view}
            tracks={prepared.view.rows.map((pattern) => toCatalogTrack(pattern))}
            label={`${range.label} patterns`}
          />
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
