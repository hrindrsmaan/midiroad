import type { Metadata } from "next";
import { BuyerShell } from "@/components/buyer/BuyerShell";
import { BestBody } from "@/components/buyer/UseArticles";
import {
  ALL_NAMES_DISCLAIMER,
  BEST_FAQS,
  BEST_PATH,
  COMPARE_HUB,
  COMPETITORS,
  DRILL_BUY_PATH,
  TRAP_BUY_PATH,
  buyerMeta,
  comparePath,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const meta = buyerMeta(BEST_PATH);

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: BEST_PATH,
});

const list = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best MIDI drum kits for trap and drill in 2026",
  url: absoluteUrl(BEST_PATH),
  numberOfItems: COMPETITORS.length + 1,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "MidiRoad kits", url: absoluteUrl("/kits") },
    ...COMPETITORS.map((competitor, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: `${competitor.name} ${competitor.product}`,
      url: absoluteUrl(comparePath(competitor.slug)),
    })),
  ],
};

export default function BestMidiDrumKitsPage() {
  return (
    <BuyerShell
      eyebrow="Best of 2026"
      title="Best MIDI drum kits for trap and drill in 2026"
      lede="A shortlist, not a ranking you can buy your way onto. MidiRoad is on it because we sell the kits. Unison, Ghosthack, Toontrack, Splice and Cymatics are on it because their public pages are what producers open next. The right one depends on whether you need patterns, loops, a live drummer, a subscription, or melodies."
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Compare", path: COMPARE_HUB },
        { name: "Best MIDI drum kits", path: BEST_PATH },
      ]}
      faqs={BEST_FAQS}
      disclaimer={ALL_NAMES_DISCLAIMER}
      ctaLabel="best_kits"
      extraJsonLd={[list]}
      related={[
        { href: TRAP_BUY_PATH, title: "Trap MIDI drum kits", text: "The trap kits, without the other genres in the way." },
        { href: DRILL_BUY_PATH, title: "Drill MIDI drum kits", text: "Eighteen patterns, and the products that aren't drum MIDI." },
        { href: COMPARE_HUB, title: "All comparisons", text: "One table per company." },
        { href: "/midi/trap", title: "Trap pattern hub", text: "Play the trap files before you take the shortlist's word." },
        { href: "/kits", title: "Shop MidiRoad", text: "Kit prices and The Complete Vault." },
      ]}
    >
      <BestBody />
    </BuyerShell>
  );
}
