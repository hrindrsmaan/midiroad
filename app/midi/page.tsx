import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { MIDI_PATTERN_COUNT } from "@/lib/midi-kits";
import { BPM_RANGES, GENRES, bpmPath, genrePath, genreStats, patternsInRange } from "@/lib/patterns";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const title = "MIDI Drum Patterns for Trap, Drill and 808s";
const description = `Browse ${MIDI_PATTERN_COUNT} royalty-free MIDI drum patterns by style and tempo. Preview hi-hats, snares, kicks and 808s in the browser, then buy a kit or unlock one file.`;

export const metadata: Metadata = pageMetadata({ title, description, path: "/midi" });

export default function PatternsIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: absoluteUrl("/midi"),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: GENRES.length,
            itemListElement: GENRES.map((genre, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${genre.name} MIDI patterns`,
              url: absoluteUrl(genrePath(genre)),
            })),
          },
        }}
      />
      <SiteNav />
      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow className="mb-3">MIDI patterns</Eyebrow>
          <h1 className="max-w-3xl text-3xl leading-tight md:text-5xl">
            {MIDI_PATTERN_COUNT} drum patterns, one page each
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
            Every hi-hat, snare, kick, open hat and 808 has its own page with a preview. The MIDI file stays a
            paid download: buy the kit it comes in, or unlock that one file with a credit.
          </p>

          <h2 className="mt-14 text-2xl md:text-[32px]">By style</h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GENRES.map((genre) => {
              const stats = genreStats(genre.slug);
              if (!stats) return null;
              return (
                <li key={genre.slug}>
                  <Link
                    href={genrePath(genre)}
                    className="block h-full rounded-md border border-line bg-card p-5 transition-colors hover:border-strong"
                  >
                    <p className="text-lg font-semibold">{genre.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{stats.kit.tagline}</p>
                    <p className="mt-3 text-sm text-ink">
                      <span className="font-wide text-sm">{stats.patterns.length}</span> patterns ·{" "}
                      <span className="font-wide text-sm">
                        {stats.minBpm}–{stats.maxBpm}
                      </span>{" "}
                      BPM
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-14 text-2xl md:text-[32px]">By tempo</h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BPM_RANGES.map((range) => {
              const count = patternsInRange(range).length;
              return (
                <li key={range.slug}>
                  <Link
                    href={bpmPath(range)}
                    className="block rounded-md border border-line bg-card p-5 transition-colors hover:border-strong"
                  >
                    <p className="text-lg font-semibold">{range.label}</p>
                    <p className="mt-2 text-sm text-muted">
                      <span className="font-wide text-sm">{count}</span> patterns across every kit
                    </p>
                  </Link>
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
