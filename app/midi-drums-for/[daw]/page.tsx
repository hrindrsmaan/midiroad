import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyerShell } from "@/components/buyer/BuyerShell";
import { DawBody } from "@/components/buyer/UseArticles";
import {
  ALL_NAMES_DISCLAIMER,
  BEST_PATH,
  COMPARE_HUB,
  DAW_PAGES,
  DRILL_BUY_PATH,
  TRAP_BUY_PATH,
  dawBySlug,
  dawPath,
} from "@/lib/buyer-intent";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ daw: string }> };

export function generateStaticParams() {
  return DAW_PAGES.map((daw) => ({ daw: daw.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const daw = dawBySlug((await params).daw);
  if (!daw) return {};
  return pageMetadata({ title: daw.metaTitle, description: daw.description, path: dawPath(daw.slug) });
}

export default async function DawKitsPage({ params }: Params) {
  const daw = dawBySlug((await params).daw);
  if (!daw) notFound();
  const path = dawPath(daw.slug);

  return (
    <BuyerShell
      eyebrow={daw.name}
      title={daw.h1}
      lede={daw.lede}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Compare", path: COMPARE_HUB },
        { name: daw.h1, path },
      ]}
      faqs={daw.faqs}
      disclaimer={ALL_NAMES_DISCLAIMER}
      ctaLabel={`daw_${daw.slug}`}
      related={[
        ...(daw.guide
          ? [{ href: daw.guide, title: `${daw.name} import guide`, text: "The step-by-step this page doesn't repeat." }]
          : [
              {
                href: "/guides/what-are-midi-drum-patterns",
                title: "What MIDI drum patterns are",
                text: "Files versus loops, if Logic is your first DAW.",
              },
            ]),
        { href: TRAP_BUY_PATH, title: "Trap MIDI drum kits", text: "Which kit to drop in first." },
        { href: DRILL_BUY_PATH, title: "Drill MIDI drum kits", text: "The drill kit, and what it doesn't include." },
        { href: BEST_PATH, title: "Best MIDI drum kits for 2026", text: "Other companies, when a kit isn't the whole answer." },
        { href: "/kits", title: "Shop the kits", text: "One-time prices. No DAW edition to pick." },
        { href: "/free-midi-kit", title: "Free starter kit", text: "Twelve patterns to test the import." },
      ]}
    >
      <DawBody daw={daw} />
    </BuyerShell>
  );
}
