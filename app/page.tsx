import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { KitShelf } from "@/components/KitShelf";
import { TrackTable } from "@/components/catalog/TrackTable";
import { FAQList } from "@/components/FAQSection";
import { FreeToolsCards } from "@/components/FreeToolsCards";
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
      <SiteNav tone="night" />
      <HomeHero />

      <section aria-labelledby="previews-heading" className="px-5 pb-14 pt-12 md:pt-16">
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
          <TrackTable tracks={previews} downloads covers google={googleConfigured} label="Featured previews" />
        </div>
      </section>

      <KitShelf />

      <FreeToolsCards />

      <section id="faq" aria-label="Reviews and questions" className="scroll-mt-16 bg-canvas px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div className="min-w-0">
            <h2 id="reviews-heading" className="mb-6 text-2xl md:text-[32px]">
              What producers say
            </h2>
            <Testimonials layout="stack" />
          </div>
          <div className="min-w-0">
            <h2 id="faq-heading" className="mb-2 text-2xl md:text-[32px]">
              Questions, answered
            </h2>
            <p className="mb-6 text-sm text-muted">
              Anything else? Email{" "}
              <a href="mailto:support@inbox.midiroad.com" className="text-ink underline underline-offset-4 hover:text-brand">
                support@inbox.midiroad.com
              </a>
              .
            </p>
            <FAQList />
          </div>
        </div>
      </section>

      <StickyBuyBar
        product={BUNDLE_ID}
        price={PRICING.currentPrice}
        originalPrice={PRICING.originalPrice}
      />

      <SiteFooter />
    </main>
  );
}
