import { ProductDetail } from "@/components/ProductDetail";
import { KitGrid } from "@/components/KitGrid";
import { MidiKits } from "@/components/MidiKits";
import { BeatMakerPromo } from "@/components/BeatMakerPromo";
import { ChordMaker } from "@/components/ChordMaker";
import { ChordPackCompare } from "@/components/ChordPackCompare";
import { FAQSection } from "@/components/FAQSection";
import { GuidesTeaser } from "@/components/GuidesTeaser";
import { SiteFooter, SiteNav, StickyBuyBar } from "@/components/SiteChrome";
import { BUNDLE_ID } from "@/lib/products";
import { PRICING } from "@/lib/pricing";
import { googleConfigured } from "@/lib/auth";
import { FAQS } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, homeJsonLd } from "@/lib/site";

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background pb-24 md:pb-0">
      <JsonLd data={[...homeJsonLd(), faqJsonLd(FAQS)]} />
      <SiteNav />

      {/* The chord maker leads, playable right here (also at /chord-maker) */}
      <ChordMaker google={googleConfigured} heading="h2" />

      {/* Why the chord maker beats a folder of chord files */}
      <ChordPackCompare />

      {/* Then the bundle: best value, every kit plus the one-shots */}
      <ProductDetail />

      {/* Every kit, each with its own page */}
      <KitGrid tone="canvas" includeBundle={false} title="Or buy one kit at a time" />

      {/* The free beat maker lives on its own page */}
      <BeatMakerPromo />

      {/* Every MIDI pattern, playable */}
      <MidiKits tone="canvas" google={googleConfigured} />

      {/* Guides: how to use the patterns, one click from the homepage */}
      <GuidesTeaser tone="white" />

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
