"use client";

import { useCallback, useState } from "react";
import { SalesPopup } from "@/components/SalesPopup";
import * as gtag from "@/lib/gtag";
import { ProductDetail } from "@/components/ProductDetail";
import { UrgencyBar } from "@/components/UrgencyBar";
import { DiscountBadge } from "@/components/DiscountBadge";
import { FAQSection } from "@/components/FAQSection";
import { PricingTable } from "@/components/PricingTable";
import { PRICING, formatUSD } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

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
          variant="ghost"
          onClick={() => handleBuy(true)}
          disabled={loading}
          className="text-white font-bold uppercase text-[13px] tracking-wider hover:bg-white/10 hover:text-white"
        >
          {loading ? "Loading..." : "Get Access"}
        </Button>
      </nav>

      {/* Urgency / Scarcity Bar — countdown + low-stock + price-increase warning */}
      <div className="pt-[72px] md:pt-[76px]">
        <UrgencyBar />
      </div>

      {/* Product Detail (replaces hero) */}
      <ProductDetail onBuy={handleBuy} loading={loading} />

      {/* Social Proof */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-400 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600 mb-2">
            Trusted by 2,500+ producers worldwide
          </p>
          <p className="text-sm text-gray-500">
            Used in beats for Drake, Travis Scott, Weeknd, and more
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            What producers are saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Marcus T.",
                role: "Platinum Producer",
                handle: "@marcusbeats",
                text: "This kit saved me hours. The MIDI patterns are fire and the drums sound professional right out of the box.",
              },
              {
                name: "Sarah K.",
                role: "Beatmaker",
                handle: "@sarahkeys",
                text: "Finally a kit with accurate key labels. Game changer for my workflow. Already bought two more packs.",
              },
              {
                name: "DJ Prototype",
                role: "Studio Engineer",
                handle: "@djprototype",
                text: "Clean samples, great variety. My clients love the sounds. This is now my go-to drum kit.",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="p-5">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table — single, dual, and pro tiers */}
      <PricingTable />

      {/* FAQ — addresses objections after the pricing decision */}
      <FAQSection />

      {/* Floating discount pill (desktop) */}
      <DiscountBadge variant="floating" />

      {/* Live "someone just bought" social-proof popup */}
      <SalesPopup />

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
            From {formatUSD(PRICING.currentPrice)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white"
            onClick={() => {
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Choose Plan
          </Button>
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white font-bold"
            onClick={() => {
              handleBuy(true);
            }}
          >
            Get Bundle
          </Button>
        </div>
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
