"use client";

import { useState } from "react";

type Props = {
  onBuy: (isDiscount?: boolean) => void;
  loading?: boolean;
};

export function ProductDetail({ onBuy, loading }: Props) {
  const [buyLoading, setBuyLoading] = useState<boolean>(false);

  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Large product image */}
        <div className="flex items-start justify-center">
          <div className="relative bg-[#f9f9f9] p-8 rounded-2xl w-full max-w-md">
            <img
              src="/images/bundle-poster.png"
              alt="Product"
              className="w-full object-contain"
            />
          </div>
        </div>

        {/* Right: Product details */}
        <div className="pt-2">
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
            MidiRoad Kits - Ultimate Midi Multikit Bundle (830+ MIDIs, Drums,
            Samples, Presets)
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm font-black">
                Sale
              </span>
              <div className="text-sm text-black/70">
                Limited time — instant access
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <button
                onClick={() => {
                  setBuyLoading(true);
                  // Redirect to Stripe Payment Link
                  window.location.href =
                    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
                    "https://buy.stripe.com/test_4gMcN56mH5ABa3p97Za3u00";
                }}
                className="w-full sm:w-auto bg-purple-600 text-white rounded-full py-3 px-6 font-bold shadow-lg"
                disabled={buyLoading}
              >
                {buyLoading ? "Redirecting…" : "Buy now — $24.99"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl md:text-3xl font-black text-[#ff90e8]">
              $24.99
            </div>
          </div>

          <div className="text-sm text-black/80 mb-6">
            <p className="font-bold text-lg mb-3">
              Instant inspiration. Pro-ready sounds.
            </p>
            <p className="mb-3">
              The Ultimate MIDI Multikit — 838 studio-quality WAVs, MIDIs and
              presets designed to get tracks finished fast. Drag, drop, and
              sound professional.
            </p>

            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>160+</strong> melodic ideas across dark trap, RnB, and
                soul
              </li>
              <li>
                <strong>Accurate key labels</strong> for instant arrangement
              </li>
              <li>
                <strong>All WAVs normalized @ 44kHz / 24-bit</strong> — DAW
                ready
              </li>
            </ul>

            <p className="font-black">
              Includes 838 total files — WAVs, MIDIs, presets. Compatible with
              all major DAWs.
            </p>

            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
              <li>
                <strong>(73)</strong> HiHat MIDIs
              </li>
              <li>
                <strong>(80)</strong> 808 MIDIs
              </li>
              <li>
                <strong>(35)</strong> Kick MIDIs
              </li>
              <li>
                <strong>(50)</strong> Open Hat MIDIs
              </li>
              <li>
                <strong>(45)</strong> Snare MIDIs
              </li>
              <li>
                <strong>(14)</strong> 808s
              </li>
              <li>
                <strong>(27)</strong> Claps
              </li>
              <li>
                <strong>(14)</strong> Crashes
              </li>
              <li>
                <strong>(22)</strong> FX
              </li>
              <li>
                <strong>(14)</strong> HiHats
              </li>
              <li>
                <strong>(14)</strong> Kicks
              </li>
              <li>
                <strong>(16)</strong> Open Hats
              </li>
              <li>
                <strong>(33)</strong> Percussions
              </li>
              <li>
                <strong>(64)</strong> Snares
              </li>
              <li>
                <strong>(15)</strong> Rim Snares
              </li>
              <li className="sm:col-span-2">
                <strong>Compatible With All DAWs</strong> (FL Studio, Ableton,
                Logic, Reason, Studio One, Maschine, etc.)
              </li>
            </ul>
          </div>

          {/* Add to cart removed per request */}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
