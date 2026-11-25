import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyerShell } from "@/components/buyer/BuyerShell";
import { AlternativeBody } from "@/components/buyer/CompetitorBody";
import {
  ALTERNATIVES_HUB,
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
  return COMPETITORS.map((competitor) => ({ slug: competitor.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const competitor = COMPETITORS.find((entry) => entry.slug === slug);
  if (!competitor) return {};
  return pageMetadata({
    title: competitor.alternative.metaTitle,
    description: competitor.alternative.description,
    path: alternativePath(competitor.slug),
  });
}

export default async function AlternativePage({ params }: Params) {
  const { slug } = await params;
  const competitor = COMPETITORS.find((entry) => entry.slug === slug);
  if (!competitor) notFound();
  const path = alternativePath(competitor.slug);

  return (
    <BuyerShell
      eyebrow="Alternatives"
      title={competitor.alternative.h1}
      lede={competitor.alternative.lede}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Alternatives", path: ALTERNATIVES_HUB },
        { name: `${competitor.name} alternative`, path },
      ]}
      faqs={competitor.alternativeFaqs}
      disclaimer={DISCLAIMER[competitor.slug]}
      sources={competitor.sources}
      ctaLabel={`alternative_${competitor.slug}`}
      related={[
        {
          href: comparePath(competitor.slug),
          title: `MidiRoad vs ${competitor.name}`,
          text: "The side-by-side page, with the same table and a different decision.",
        },
        { href: BEST_PATH, title: "Best MIDI drum kits for 2026", text: "All five companies on one list." },
        { href: TRAP_BUY_PATH, title: "Trap MIDI drum kits", text: "Which MidiRoad kit is the trap purchase." },
        { href: DRILL_BUY_PATH, title: "Drill MIDI drum kits", text: "Decoy Protocol, and what other drill packs contain." },
        { href: COMPARE_HUB, title: "All comparisons", text: "The index of buying pages." },
        { href: "/kits", title: "Shop the kits", text: "Prices, the bundle, and browser previews." },
      ]}
    >
      <AlternativeBody competitor={competitor} />
    </BuyerShell>
  );
}
