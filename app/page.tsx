import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { VaultBand } from "@/components/VaultBand";
import { KitGrid } from "@/components/KitGrid";
import { TrackTable } from "@/components/catalog/TrackTable";
import { BeatMakerPromo } from "@/components/BeatMakerPromo";
import { ChordMaker } from "@/components/ChordMaker";
import { ChordPackCompare } from "@/components/ChordPackCompare";
import { FAQSection } from "@/components/FAQSection";
import { FreeKitBanner } from "@/components/FreeKitCta";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { GuidesTeaser } from "@/components/GuidesTeaser";
import { SiteFooter, SiteNav, StickyBuyBar } from "@/components/SiteChrome";
import { Testimonials } from "@/components/Testimonials";
import { featuredTracks } from "@/lib/catalog";
import { BUNDLE_ID } from "@/lib/products";
import { PRICING } from "@/lib/pricing";
import { googleConfigured } from "@/lib/auth";
import { FAQS } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";
import { MIDI_PATTERN_COUNT } from "@/lib/midi-kits";
import { GENRES, PATTERNS } from "@/lib/patterns";
import { faqJsonLd, homeJsonLd } from "@/lib/site";

export default function Page() {
  const previews = featuredTracks(PATTERNS, GENRES);
  return (
    <main className="min-h-screen overflow-x-hidden bg-background pb-24 md:pb-0">
      <JsonLd data={[...homeJsonLd(), faqJsonLd(FAQS)]} />
      <SiteNav />
      <HomeHero />

      <ChordMaker google={googleConfigured} heading="h2" />
      <ChordPackCompare />

      <section aria-labelledby="previews-heading" className="px-5 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="previews-heading" className="text-2xl md:text-[32px]">
                Hear a pattern from every kit
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Press play on any pattern. Each MIDI is played with drum samples from the bundle&apos;s one-shot kit.{" "}
                <Link href="/midi" className="font-semibold text-ink underline underline-offset-4">
                  Browse all {MIDI_PATTERN_COUNT} pattern pages
                </Link>
              </p>
            </div>
          </div>
          <TrackTable tracks={previews} downloads google={googleConfigured} label="Featured previews" />
        </div>
      </section>

      <div className="bg-background px-5 pb-4">
        <FreeKitBanner source="home" count={FREE_KIT_COUNT} className="mx-auto max-w-6xl" />
      </div>

      <VaultBand />

      <KitGrid tone="canvas" includeBundle={false} title="Or buy one kit at a time" />

      <BeatMakerPromo />

      <GuidesTeaser tone="canvas" />

      <section aria-labelledby="reviews-heading" className="bg-background px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="reviews-heading" className="mb-6 text-2xl md:text-[32px]">
            What producers say
          </h2>
          <Testimonials />
        </div>
      </section>

      <FAQSection tone="canvas" />

      <StickyBuyBar
        product={BUNDLE_ID}
        price={PRICING.currentPrice}
        originalPrice={PRICING.originalPrice}
      />

      <SiteFooter />
    </main>
  );
}
