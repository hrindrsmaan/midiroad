"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6 bg-white">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-bold rounded-full px-8 text-lg"
                onClick={() => {
                  setBuyLoading(true);
                  // Redirect to Stripe Payment Link
                  window.location.href =
                    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
                    "https://buy.stripe.com/test_4gMcN56mH5ABa3p97Za3u00";
                }}
                disabled={buyLoading}
              >
                {buyLoading ? "Redirecting…" : "Buy Now"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl md:text-4xl font-bold">$24.99</span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="success" className="gap-1.5 py-1.5 px-3">
              <CheckIcon className="w-4 h-4" />
              Instant Download
            </Badge>
            <Badge variant="success" className="gap-1.5 py-1.5 px-3">
              <CheckIcon className="w-4 h-4" />
              Royalty-Free
            </Badge>
            <Badge variant="success" className="gap-1.5 py-1.5 px-3">
              <CheckIcon className="w-4 h-4" />
              30-Day Refund
            </Badge>
          </div>

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
