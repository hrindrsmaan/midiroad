import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { BPM_RANGES, bpmPath, patternsInRange } from "@/lib/patterns";
import { pageMetadata } from "@/lib/seo";

const title = "MIDI Drum Patterns by Tempo";
const description =
  "Royalty-free MIDI drum patterns grouped by BPM: under 120, trap tempos, fast trap and drill, and uptempo patterns at 160 BPM and above.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/midi/bpm" });

export default function TempoIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 text-sm text-muted">
            <Link href="/midi" className="hover:text-ink">
              MIDI patterns
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">Tempo</span>
          </nav>
          <Eyebrow className="mb-3">Tempo</Eyebrow>
          <h1 className="max-w-3xl text-3xl leading-tight md:text-5xl">Patterns by BPM</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{description}</p>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BPM_RANGES.map((range) => (
              <li key={range.slug}>
                <Link
                  href={bpmPath(range)}
                  className="block rounded-md border border-line bg-card p-5 transition-colors hover:border-strong"
                >
                  <p className="text-lg font-semibold">{range.label}</p>
                  <p className="mt-2 text-sm text-muted">
                    <span className="font-wide text-sm">{patternsInRange(range).length}</span> patterns
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
