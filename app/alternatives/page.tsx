import type { Metadata } from "next";
import Link from "next/link";
import { BuyerShell, buyerProse } from "@/components/buyer/BuyerShell";
import {
  ALTERNATIVES_FAQS,
  ALTERNATIVES_HUB,
  ALL_NAMES_DISCLAIMER,
  BEST_PATH,
  COMPARE_HUB,
  COMPETITORS,
  alternativePath,
  buyerMeta,
  comparePath,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const meta = buyerMeta(ALTERNATIVES_HUB);

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: ALTERNATIVES_HUB,
});

const list = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MIDI drum kit alternatives",
  url: absoluteUrl(ALTERNATIVES_HUB),
  numberOfItems: COMPETITORS.length,
  itemListElement: COMPETITORS.map((competitor, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `Best ${competitor.name} alternative for MIDI drums`,
    url: absoluteUrl(alternativePath(competitor.slug)),
  })),
};

export default function AlternativesHubPage() {
  return (
    <BuyerShell
      eyebrow="Alternatives"
      title="MIDI drum kit alternatives"
      lede="Five companies producers compare when they're about to buy MIDI. Unison is the closest drum-pattern match. Splice is a subscription catalog. Cymatics APEX is melody MIDI. Ghosthack Trap Drums is a sample pack with MIDI. Toontrack is played grooves for EZdrummer. None of these pages is an affiliate link."
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Alternatives", path: ALTERNATIVES_HUB },
      ]}
      faqs={ALTERNATIVES_FAQS}
      disclaimer={ALL_NAMES_DISCLAIMER}
      ctaLabel="alternatives_hub"
      extraJsonLd={[list]}
      related={[
        { href: COMPARE_HUB, title: "Comparison hub", text: "Tables and decision pages for the same companies." },
        { href: BEST_PATH, title: "Best MIDI drum kits for 2026", text: "One list, including when to buy someone else." },
        { href: "/kits", title: "MidiRoad kits", text: "The products these pages suggest when a kit is the right shape." },
        { href: "/midi", title: "Pattern hubs", text: "Preview trap, drill and 808 files one at a time." },
      ]}
    >
      <div className={`${buyerProse} mt-12`}>
        <h2>Pick the company you were about to buy from</h2>
        <ul>
          {COMPETITORS.map((competitor) => (
            <li key={competitor.slug}>
              <Link href={alternativePath(competitor.slug)}>Best {competitor.name} alternative for MIDI drums</Link>
              {". "}
              {competitor.blurb}{" "}
              <Link href={comparePath(competitor.slug)}>Open the comparison</Link>.
            </li>
          ))}
        </ul>
        <p>
          If you don&apos;t have a company in mind yet, start with the{" "}
          <Link href={BEST_PATH}>2026 shortlist</Link> instead of an alternative page. Alternative pages assume
          you already have their tab open.
        </p>
      </div>
    </BuyerShell>
  );
}
