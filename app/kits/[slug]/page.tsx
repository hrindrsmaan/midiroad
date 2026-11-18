import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { KitCover } from "@/components/KitCover";
import { KitGrid } from "@/components/KitGrid";
import { MidiKits } from "@/components/MidiKits";
import { FAQSection } from "@/components/FAQSection";
import { PricingTable } from "@/components/PricingTable";
import { Reassurance } from "@/components/Reassurance";
import { SiteFooter, SiteNav, StickyBuyBar } from "@/components/SiteChrome";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import {
  BUNDLE_ID,
  BUNDLE_NAME,
  BUNDLE_PRICE,
  KIT_PRODUCTS,
  kitBySlug,
  kitStats,
  midiKitFor,
} from "@/lib/products";
import { formatUSD } from "@/lib/pricing";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return KIT_PRODUCTS.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const kit = kitBySlug((await params).slug);
  if (!kit) return {};
  const stats = kitStats(kit);
  const title = `${kit.name} – ${stats.patterns} MIDI Drum Patterns | MidiRoad`;
  return {
    title,
    description: `${kit.tagline} ${stats.patterns} royalty-free MIDI drum patterns, ${stats.minBpm}–${stats.maxBpm} BPM. Drag and drop into any DAW.`,
    openGraph: { title, description: kit.tagline, type: "website", siteName: "MidiRoad" },
  };
}

export default async function KitPage({ params }: Params) {
  const kit = kitBySlug((await params).slug);
  if (!kit) notFound();

  const stats = kitStats(kit);
  const parts = midiKitFor(kit).parts;
  const upgradeCost = BUNDLE_PRICE - kit.price;

  return (
    <main className="min-h-screen bg-[#0e1014] text-white font-sans selection:bg-[#ff90e8] selection:text-black overflow-x-hidden pb-24 md:pb-0">
      <SiteNav product={kit.id} cta={`Buy · ${formatUSD(kit.price)}`} />

      <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/#kits"
            className="inline-block mb-6 text-[12px] uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            ← All kits
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="w-full max-w-md mx-auto md:mx-0 md:max-w-none">
              <KitCover kit={kit} size="lg" priority />
            </div>

            <div className="space-y-6">
              <div className="bg-[#18181b] rounded-md p-6 sm:p-8 space-y-6">
                <div>
                  <p className="mb-3 text-[11px] font-black uppercase tracking-widest" style={{ color: kit.accent }}>
                    {kit.vibe} · MIDI kit
                  </p>
                  <h1 className="text-3xl md:text-4xl leading-tight">{kit.name}</h1>
                  <p className="mt-3 text-lg font-light text-gray-200">{kit.tagline}</p>
                  <p className="mt-4 text-sm font-light leading-relaxed tracking-wide text-gray-400">
                    {kit.description}
                  </p>
                </div>

                <ul className="grid grid-cols-3 sm:grid-cols-5 gap-2" aria-label="What's in this kit">
                  {parts.map((part) => (
                    <li key={part.id} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                      <span className="block text-lg font-black">{part.patterns.length}</span>
                      <span className="block text-[11px] text-gray-400">{part.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500">
                  {stats.patterns} MIDI files · {stats.minBpm}–{stats.maxBpm} BPM · Works in FL Studio,
                  Ableton, Logic and any DAW
                </p>

                <div className="h-px bg-white/10" />

                <div className="space-y-4">
                  <p className="text-4xl font-black tracking-tight">{formatUSD(kit.price)}</p>
                  <BuyButton
                    product={kit.id}
                    label="Kit Page Button"
                    className={BUY_BUTTON_CLASS}
                    aria-label={`Buy ${kit.name} for ${formatUSD(kit.price)}`}
                  >
                    <span className="flex items-center gap-2">
                      Get {kit.name}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </BuyButton>
                  <Reassurance />
                </div>
              </div>

              {/* Bundle upsell: the whole store for a few dollars more */}
              <div className="rounded-md border-2 border-dashed border-[#2bd96b]/50 p-5 sm:p-6">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
                  Better deal
                </p>
                <p className="mt-2 text-base">
                  Get <strong>all 6 kits + {ONE_SHOT_COUNT} one-shots</strong> for{" "}
                  {formatUSD(BUNDLE_PRICE)}, only{" "}
                  <strong className="text-[#2bd96b]">{formatUSD(upgradeCost)} more</strong> than this kit.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <BuyButton
                    product={BUNDLE_ID}
                    label={`Kit Page Upsell · ${kit.id}`}
                    size="default"
                    className="rounded-full border-2 border-[#2bd96b] bg-transparent px-5 text-[13px] font-black uppercase tracking-wider text-[#2bd96b] hover:bg-[#2bd96b] hover:text-black"
                  >
                    Get {BUNDLE_NAME} · {formatUSD(BUNDLE_PRICE)}
                  </BuyButton>
                  <Link href="/" className="text-xs text-gray-400 underline underline-offset-4 hover:text-white">
                    See what&apos;s in it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MidiKits kitId={kit.id} />

      <KitGrid excludeId={kit.id} title="More kits" eyebrow="Keep exploring" />

      <FAQSection />

      <PricingTable />

      <StickyBuyBar product={kit.id} price={kit.price} cta={`Get ${kit.name}`} />

      <SiteFooter />
    </main>
  );
}
