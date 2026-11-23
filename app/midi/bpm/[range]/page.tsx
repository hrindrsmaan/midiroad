import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PatternBrowser } from "@/components/PatternBrowser";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import {
  BPM_RANGES,
  bpmPath,
  bpmRangeBySlug,
  patternGroups,
  patternListJsonLd,
  patternsInRange,
} from "@/lib/patterns";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return BPM_RANGES.map((range) => ({ range: range.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ range: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const range = bpmRangeBySlug((await params).range);
  if (!range) return {};
  const count = patternsInRange(range).length;
  return pageMetadata({
    title: `${range.label} MIDI Drum Patterns`,
    description: `${range.description} ${count} hi-hats, snares, kicks, open hats and 808s you can preview in the browser.`,
    path: bpmPath(range),
  });
}

export default async function TempoPage({ params }: Params) {
  const range = bpmRangeBySlug((await params).range);
  if (!range) notFound();
  const patterns = patternsInRange(range);
  const title = `${range.label} MIDI drum patterns`;
  const description = `${range.description} ${patterns.length} patterns from every MidiRoad kit. Preview one, then buy its kit or unlock the file with a credit.`;

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={patternListJsonLd(title, description, absoluteUrl(bpmPath(range)), patterns)} />
      <SiteNav />
      <article className="px-5 py-16 md:py-20">
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
          <h1 className="max-w-3xl text-3xl leading-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{description}</p>
          <div className="mt-14">
            <PatternBrowser groups={patternGroups(patterns)} />
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
