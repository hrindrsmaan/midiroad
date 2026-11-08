"use client";

import { useCallback, useState } from "react";
import * as gtag from "@/lib/gtag";
import { ProductDetail } from "@/components/ProductDetail";
import { DiscountBadge } from "@/components/DiscountBadge";
import { FAQSection } from "@/components/FAQSection";
import { PricingTable } from "@/components/PricingTable";
import { PRICING, formatUSD } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleBuy = useCallback(async (isDiscount: boolean = false) => {
    setLoading(true);

    // Track the click event
    gtag.event({
      action: "click_download",
      category: "engagement",
      label: isDiscount
        ? "Main Page Bundle Button (DISCOUNTED)"
        : "Main Page Bundle Button",
    });

    // Redirect to Stripe Payment Link
    window.location.href =
      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
      "https://buy.stripe.com/test_4gMcN56mH5ABa3p97Za3u00";
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black overflow-x-hidden pb-24 md:pb-0">
      <nav className="flex items-center justify-between px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black fixed top-0 z-50">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="MidiRoad Home"
        >
          <img src="/logo-white.png" alt="MidiRoad" className="h-10 w-auto" />
        </a>
        <Button
          onClick={() => handleBuy(true)}
          disabled={loading}
          className="bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase text-[13px] tracking-wider rounded-full px-5 shadow-[2px_2px_0_0_#fff]"
        >
          {loading ? "Loading..." : "Get Access"}
        </Button>
      </nav>

      {/* Product Detail (replaces hero) */}
      <ProductDetail onBuy={handleBuy} loading={loading} />

      {/* Pricing Table — single, dual, and pro tiers */}
      <PricingTable />

      {/* FAQ — addresses objections after the pricing decision */}
      <FAQSection />

      {/* Floating discount pill (desktop) */}
      <DiscountBadge variant="floating" />

      {/* Sticky Mobile Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-black md:hidden z-50 shadow-[0_-4px_0_0_#000]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 line-through">
            {formatUSD(PRICING.originalPrice)}
          </span>
          <span className="bg-black text-[#ff90e8] text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
            Save {PRICING.discountPercent}%
          </span>
          <span className="text-sm font-black text-black">
            {formatUSD(PRICING.currentPrice)}
          </span>
        </div>
        <Button
          size="lg"
          className="w-full bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase tracking-wide shadow-[3px_3px_0_0_#000]"
          onClick={() => handleBuy(true)}
        >
          Get Instant Access
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <img
                src="/logo-white.png"
                alt="MidiRoad"
                className="h-10 w-auto mb-4 mx-auto md:mx-0"
              />
              <p className="text-gray-400 text-sm max-w-xs">
                Premium drag-and-drop MIDI loops, chord progressions, and
                pro-grade drum kits.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                <a
                  href="mailto:support@midiroad.com"
                  className="hover:text-white transition-colors"
                >
                  support@midiroad.com
                </a>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © {new Date().getFullYear()} MidiRoad. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
