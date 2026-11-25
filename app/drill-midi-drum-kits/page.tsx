import type { Metadata } from "next";
import { BuyerShell } from "@/components/buyer/BuyerShell";
import { DrillBuyBody } from "@/components/buyer/UseArticles";
import {
  ALL_NAMES_DISCLAIMER,
  COMPARE_HUB,
  DRILL_BUY_FAQS,
  DRILL_BUY_PATH,
  TRAP_BUY_PATH,
  buyerMeta,
  comparePath,
  dawPath,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";

const meta = buyerMeta(DRILL_BUY_PATH);

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: DRILL_BUY_PATH,
});

export default function DrillKitsPage() {
  return (
    <BuyerShell
      eyebrow="Drill"
      title="Drill MIDI drum kits"
      lede="Decoy Protocol is MidiRoad's drill kit: 18 patterns, snares, hats and 808s, 130 to 170 BPM, each one previewed on the drill hub. Other products with drill in the name are often melody MIDI or sample packs. This page says which is which before you pay."
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Compare", path: COMPARE_HUB },
        { name: "Drill MIDI drum kits", path: DRILL_BUY_PATH },
      ]}
      faqs={DRILL_BUY_FAQS}
      disclaimer={ALL_NAMES_DISCLAIMER}
      ctaLabel="drill_kits"
      related={[
        { href: "/midi/drill", title: "Drill pattern hub", text: "Play all 18 files. The hub is the browser. This page is the buy." },
        { href: TRAP_BUY_PATH, title: "Trap MIDI drum kits", text: "The larger trap catalog, if drill was only half the beat." },
        { href: "/midi/808-bass", title: "808 bass patterns", text: "Extra low end from Focus 808 Lab." },
        { href: comparePath("cymatics"), title: "MidiRoad vs Cymatics", text: "Their drill MIDI is melodies." },
        { href: comparePath("ghosthack"), title: "MidiRoad vs Ghosthack", text: "UK Drill Essentials is a sample pack with 20 MIDI files." },
        { href: dawPath("ableton"), title: "MIDI drums for Ableton", text: "Drum Rack, without repeating the whole guide." },
      ]}
    >
      <DrillBuyBody />
    </BuyerShell>
  );
}
