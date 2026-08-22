"use client";

import { useCallback, useState } from "react";
import { SalesPopup } from "@/components/SalesPopup";
import * as gtag from "@/lib/gtag";
import { ProductDetail } from "@/components/ProductDetail";

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
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black overflow-x-hidden">
      <nav className="flex items-center justify-between px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black fixed top-0 z-50">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="MidiRoad Home"
        >
          <img src="/logo-white.png" alt="MidiRoad" className="h-10 w-auto" />
        </a>
        <button
          onClick={() => handleBuy(false)}
          disabled={loading}
          className="text-white font-bold uppercase text-[13px] tracking-wider hover:underline underline-offset-4 decoration-2"
        >
          {loading ? "Loading..." : "Get the Bundle"}
        </button>
      </nav>

      {/* Product Detail (replaces hero) */}
      <ProductDetail onBuy={handleBuy} loading={loading} />

      {/* Footer */}
      <footer className="bg-white py-14 text-center text-black flex flex-col items-center">
        <a
          href="/"
          className="flex items-center justify-center gap-3 mb-8 hover:-translate-y-1 transition-transform"
        >
          <img src="/logo.png" alt="MidiRoad" className="h-16 w-auto" />
        </a>
        <p className="mb-6 font-medium text-black max-w-sm mx-auto text-[15px] px-6 leading-relaxed">
          Premium drag-and-drop MIDI loops, chord progressions, and pro-grade
          drum kits to speed up your workflow.
        </p>
        <p className="text-[14px] font-bold uppercase tracking-widest text-black/60">
          © {new Date().getFullYear()} MidiRoad
        </p>
      </footer>
    </main>
  );
}
