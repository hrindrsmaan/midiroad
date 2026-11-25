import type { Metadata } from "next";
import Link from "next/link";
import { BuyerShell, buyerProse } from "@/components/buyer/BuyerShell";
import {
  ALTERNATIVES_HUB,
  ALL_NAMES_DISCLAIMER,
  BEST_PATH,
  COMPARE_HUB,
  COMPETITORS,
  DAW_PAGES,
  DRILL_BUY_PATH,
  HUB_FAQS,
  TRAP_BUY_PATH,
  alternativePath,
  buyerMeta,
  comparePath,
  dawPath,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const meta = buyerMeta(COMPARE_HUB);

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: COMPARE_HUB,
});

const list = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MIDI drum kit comparisons",
  url: absoluteUrl(COMPARE_HUB),
  numberOfItems: COMPETITORS.length,
  itemListElement: COMPETITORS.map((competitor, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `MidiRoad vs ${competitor.name}`,
    url: absoluteUrl(comparePath(competitor.slug)),
  })),
};

export default function CompareHubPage() {
  return (
    <BuyerShell
      eyebrow="Compare"
      title="Compare MIDI drum kits"
      lede="Side-by-side pages for the MIDI packs trap and drill producers actually weigh: Unison's drum collections, Splice, Cymatics melody MIDI, Ghosthack's trap packs, and Toontrack's played grooves. Each one says what their public page says, then what a MidiRoad kit is for. Prices were checked in November 2026."
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Compare", path: COMPARE_HUB },
      ]}
      faqs={HUB_FAQS}
      disclaimer={ALL_NAMES_DISCLAIMER}
      ctaLabel="compare_hub"
      extraJsonLd={[list]}
      related={[
        { href: BEST_PATH, title: "Best MIDI drum kits for 2026", text: "One shortlist, with the job each pack does." },
        { href: ALTERNATIVES_HUB, title: "Alternatives", text: "The same companies, written as 'should I switch'." },
        { href: TRAP_BUY_PATH, title: "Trap MIDI drum kits", text: "The buying page for trap, separate from the pattern hub." },
        { href: DRILL_BUY_PATH, title: "Drill MIDI drum kits", text: "Decoy Protocol, and the other products labeled drill." },
        { href: "/midi", title: "Browse patterns", text: "Every MidiRoad file, with a player." },
        { href: "/guides", title: "Guides", text: "Import steps for FL Studio and Ableton, and the license explainer." },
      ]}
    >
      <div className={`${buyerProse} mt-12`}>
        <h2>MidiRoad against one company</h2>
        <ul>
          {COMPETITORS.map((competitor) => (
            <li key={competitor.slug}>
              <Link href={comparePath(competitor.slug)}>MidiRoad vs {competitor.name}</Link>
              {". "}
              {competitor.blurb}{" "}
              <Link href={alternativePath(competitor.slug)}>Best {competitor.name} alternative</Link>.
            </li>
          ))}
        </ul>
        <h2>Best-of and buying guides</h2>
        <ul>
          <li>
            <Link href={BEST_PATH}>Best MIDI drum kits for trap and drill in 2026</Link>. The shortlist, including
            the cases where MidiRoad is the wrong buy.
          </li>
          <li>
            <Link href={TRAP_BUY_PATH}>Trap MIDI drum kits</Link>. Which of our kits is trap, and how that differs
            from the <Link href="/midi/trap">trap pattern hub</Link>.
          </li>
          <li>
            <Link href={DRILL_BUY_PATH}>Drill MIDI drum kits</Link>. A small drill kit, described honestly, next to
            melody packs and sample packs that use the word drill.
          </li>
        </ul>
        <h2>By DAW</h2>
        <p>
          The files are the same .mid in every DAW. These pages say what to buy, and point at the import guide
          when one exists.
        </p>
        <ul>
          {DAW_PAGES.map((daw) => (
            <li key={daw.slug}>
              <Link href={dawPath(daw.slug)}>{daw.h1}</Link>
              {daw.guide ? (
                <>
                  . Steps: <Link href={daw.guide}>the {daw.name} guide</Link>.
                </>
              ) : (
                ". A short import note is on the page, since there isn't a separate Logic guide."
              )}
            </li>
          ))}
        </ul>
      </div>
    </BuyerShell>
  );
}
