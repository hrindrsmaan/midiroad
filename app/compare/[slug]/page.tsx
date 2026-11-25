import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyerShell } from "@/components/buyer/BuyerShell";
import { CompareBody } from "@/components/buyer/CompetitorBody";
import {
  BEST_PATH,
  COMPARE_HUB,
  COMPETITORS,
  DRILL_BUY_PATH,
  TRAP_BUY_PATH,
  alternativePath,
  comparePath,
  trademarkDisclaimer,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";

const DISCLAIMER: Record<(typeof COMPETITORS)[number]["slug"], string> = {
  unison: trademarkDisclaimer("Unison and the Unison Trap MIDI Drum Collection"),
  splice: trademarkDisclaimer("Splice and Splice Sounds"),
  cymatics: trademarkDisclaimer("Cymatics and APEX MIDI"),
  ghosthack: trademarkDisclaimer("Ghosthack, Trap Drums and UK Drill Essentials"),
  toontrack: trademarkDisclaimer("Toontrack, EZdrummer, Superior Drummer and Hip-Hop Grooves MIDI"),
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPETITORS.map((competitor) => ({ slug: `midiroad-vs-${competitor.slug}` }));
}

export const dynamicParams = false;

function byCompareSlug(slug: string) {
  return COMPETITORS.find((competitor) => `midiroad-vs-${competitor.slug}` === slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const competitor = byCompareSlug((await params).slug);
  if (!competitor) return {};
  return pageMetadata({
    title: competitor.compare.metaTitle,
    description: competitor.compare.description,
    path: comparePath(competitor.slug),
  });
}

export default async function ComparePage({ params }: Params) {
  const competitor = byCompareSlug((await params).slug);
  if (!competitor) notFound();
  const path = comparePath(competitor.slug);

  return (
    <BuyerShell
      eyebrow="Compare"
      title={competitor.compare.h1}
      lede={competitor.compare.lede}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Compare", path: COMPARE_HUB },
        { name: `MidiRoad vs ${competitor.name}`, path },
      ]}
      faqs={competitor.compareFaqs}
      disclaimer={DISCLAIMER[competitor.slug]}
      sources={competitor.sources}
      ctaLabel={`compare_${competitor.slug}`}
      related={[
        {
          href: alternativePath(competitor.slug),
          title: `Best ${competitor.name} alternative`,
          text: "The shorter page, aimed at someone about to buy their product.",
        },
        { href: BEST_PATH, title: "Best MIDI drum kits for 2026", text: "The full shortlist, with the job each pack is for." },
        { href: TRAP_BUY_PATH, title: "Trap MIDI drum kits", text: "Essentials Vault and the other trap flavors." },
        { href: DRILL_BUY_PATH, title: "Drill MIDI drum kits", text: "A small drill kit, described as a small drill kit." },
        { href: "/guides/royalty-free-midi-explained", title: "Royalty-free MIDI, explained", text: "What a commercial release allows." },
        { href: "/kits", title: "Shop the kits", text: "One-time prices and the bundle." },
      ]}
    >
      <CompareBody competitor={competitor} />
    </BuyerShell>
  );
}
