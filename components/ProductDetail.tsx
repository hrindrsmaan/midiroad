"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DiscountBadge, PriceStack } from "@/components/DiscountBadge";
import { TrustBadges, GuaranteeSeal } from "@/components/TrustBadges";

type Props = {
  onBuy: (isDiscount?: boolean) => void;
  loading?: boolean;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function ProductDetail({ onBuy, loading }: Props) {
  const [buyLoading, setBuyLoading] = useState<boolean>(false);

  return (
    <section id="main-cta" className="pt-24 md:pt-32 pb-12 md:pb-20 px-6 bg-white scroll-mt-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Large product image */}
        <div className="flex items-start justify-center">
          <Card className="bg-[#f9f9f9] p-8 w-full max-w-md">
            <img
              src="/images/bundle-poster.png"
              alt="Product"
              className="w-full object-contain"
            />
          </Card>
        </div>

        {/* Right: Product details */}
        <div className="pt-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              Finish beats faster
            </h1>
            <p className="text-lg text-gray-600">
              800+ drag-and-drop MIDIs, drums and presets for dark trap, RnB and
              soul
            </p>
          </div>

          {/* Discount badge */}
          <div>
            <DiscountBadge variant="inline" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group relative w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-extrabold uppercase tracking-wide rounded-full px-8 py-6 text-base sm:text-lg shadow-[4px_4px_0_0_#ff90e8] hover:shadow-[2px_2px_0_0_#ff90e8] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                onClick={() => {
                  setBuyLoading(true);
                  // Notify parent so analytics can log the DISCOUNTED click.
                  onBuy(true);
                }}
                disabled={buyLoading}
                aria-label="Get instant access to the MidiRoad bundle for $24.99"
              >
                {buyLoading ? (
                  "Redirecting…"
                ) : (
                  <span className="flex items-center gap-2">
                    Get Instant Access
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PriceStack />
          </div>

          {/* Visual Guarantee Seals */}
          <TrustBadges />

          {/* Prominent Money-Back Guarantee seal block */}
          <GuaranteeSeal />

          {/* License Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">
                <strong>License:</strong> Use in commercial beats, sell on
                Spotify, Apple Music, etc. No attribution required.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg mb-2">
                Instant inspiration. Pro-ready sounds.
              </h2>
              <p className="text-sm text-gray-600">
                The Ultimate MIDI Multikit — 838 studio-quality WAVs, MIDIs and
                presets designed to get tracks finished fast. Drag, drop, and
                sound professional.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-sm">Key Features:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>160+</strong> melodic ideas across dark trap, RnB,
                    and soul
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>Accurate key labels</strong> for instant arrangement
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>All WAVs normalized @ 44kHz / 24-bit</strong> — DAW
                    ready
                  </span>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <p className="font-bold">
                Includes 838 total files — WAVs, MIDIs, presets. Compatible with
                all major DAWs.
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                  <span>(73) HiHat MIDIs</span>
                  <span>(80) 808 MIDIs</span>
                  <span>(35) Kick MIDIs</span>
                  <span>(50) Open Hat MIDIs</span>
                  <span>(45) Snare MIDIs</span>
                  <span>(14) 808s</span>
                  <span>(27) Claps</span>
                  <span>(14) Crashes</span>
                  <span>(22) FX</span>
                  <span>(14) HiHats</span>
                  <span>(14) Kicks</span>
                  <span>(16) Open Hats</span>
                  <span>(33) Percussions</span>
                  <span>(64) Snares</span>
                  <span>(15) Rim Snares</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm font-medium">
                  Compatible With All DAWs (FL Studio, Ableton, Logic, Reason,
                  Studio One, Maschine, etc.)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
