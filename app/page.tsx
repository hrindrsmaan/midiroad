import { ProductDetail } from "@/components/ProductDetail";
import { KitGrid } from "@/components/KitGrid";
import { MidiKits } from "@/components/MidiKits";
import { MidiGenerator } from "@/components/MidiGenerator";
import { FAQSection } from "@/components/FAQSection";
import { SiteFooter, SiteNav, StickyBuyBar } from "@/components/SiteChrome";
import { BUNDLE_ID } from "@/lib/products";
import { PRICING } from "@/lib/pricing";
import { googleConfigured } from "@/lib/auth";
import { FAQS } from "@/lib/faq";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, homeJsonLd } from "@/lib/site";

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-24 md:pb-0">
      <JsonLd data={[...homeJsonLd(), faqJsonLd(FAQS)]} />
      <SiteNav />

      {/* Free beat maker first: make a beat, hear it, download the MIDI */}
      <MidiGenerator google={googleConfigured} />

      {/* Then the bundle: best value, every kit plus the one-shots */}
      <ProductDetail />

      {/* Every kit, each with its own page */}
      <KitGrid tone="canvas" />

      {/* Every MIDI pattern, playable */}
      <MidiKits tone="white" google={googleConfigured} />

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
