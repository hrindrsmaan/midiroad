import { ProductDetail } from "@/components/ProductDetail";
import { KitGrid } from "@/components/KitGrid";
import { MidiKits } from "@/components/MidiKits";
import { WhatsInside } from "@/components/WhatsInside";
import { FAQSection } from "@/components/FAQSection";
import { PricingTable } from "@/components/PricingTable";
import { SiteFooter, SiteNav, StickyBuyBar } from "@/components/SiteChrome";
import { BUNDLE_ID } from "@/lib/products";
import { PRICING } from "@/lib/pricing";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black overflow-x-hidden pb-24 md:pb-0">
      <SiteNav product={BUNDLE_ID} cta="Get the Bundle" />

      {/* The bundle first: best value, every kit plus the one-shots */}
      <ProductDetail />

      {/* The six kits, each with its own page */}
      <KitGrid />

      {/* Every MIDI pattern, playable */}
      <MidiKits />

      {/* File counts and DAW compatibility */}
      <WhatsInside />

      {/* FAQ — answers objections before the closing CTA */}
      <FAQSection />

      {/* Pricing — the closing CTA */}
      <PricingTable />

      <StickyBuyBar
        product={BUNDLE_ID}
        price={PRICING.currentPrice}
        originalPrice={PRICING.originalPrice}
        badge={`Save ${PRICING.discountPercent}%`}
        cta="Get the Bundle"
      />

      <SiteFooter />
    </main>
  );
}
