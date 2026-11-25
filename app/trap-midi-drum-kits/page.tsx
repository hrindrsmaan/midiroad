import type { Metadata } from "next";
import { BuyerShell } from "@/components/buyer/BuyerShell";
import { TrapBuyBody } from "@/components/buyer/UseArticles";
import {
  ALL_NAMES_DISCLAIMER,
  COMPARE_HUB,
  DRILL_BUY_PATH,
  TRAP_BUY_FAQS,
  TRAP_BUY_PATH,
  buyerMeta,
  comparePath,
  dawPath,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";

const meta = buyerMeta(TRAP_BUY_PATH);

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: TRAP_BUY_PATH,
});

export default function TrapKitsPage() {
  return (
    <BuyerShell
      eyebrow="Trap"
      title="Trap MIDI drum kits"
      lede="Trap kits you can preview pattern by pattern, then buy once. Essentials Vault is the main trap set. Street, melodic and dark trap are their own kits. This page is the purchase. The trap hub is where the files play."
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Compare", path: COMPARE_HUB },
        { name: "Trap MIDI drum kits", path: TRAP_BUY_PATH },
      ]}
      faqs={TRAP_BUY_FAQS}
      disclaimer={ALL_NAMES_DISCLAIMER}
      ctaLabel="trap_kits"
      related={[
        { href: "/midi/trap", title: "Trap pattern hub", text: "98 files, each with a player. This page doesn't replace it." },
        { href: "/midi/street-trap", title: "Street trap patterns", text: "Black Market Heist, file by file." },
        { href: "/midi/melodic-trap", title: "Melodic trap patterns", text: "Midnight Odyssey." },
        { href: "/midi/dark-trap", title: "Dark trap patterns", text: "Psycho Ward." },
        { href: DRILL_BUY_PATH, title: "Drill MIDI drum kits", text: "A different kit, if the beat slid that way." },
        { href: comparePath("unison"), title: "MidiRoad vs Unison", text: "Their trap folder lists more patterns than we sell." },
        { href: dawPath("fl-studio"), title: "MIDI drums for FL Studio", text: "What to buy if the Channel Rack is home." },
      ]}
    >
      <TrapBuyBody />
    </BuyerShell>
  );
}
