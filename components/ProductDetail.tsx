"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PriceStack } from "@/components/PriceStack";
import { Reassurance } from "@/components/Reassurance";
import { AudioPreviews } from "@/components/AudioPreviews";
import { PRICING, formatUSD } from "@/lib/pricing";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";

type Props = {
  onBuy: (label: string) => void;
  loading?: boolean;
};

export function ProductDetail({ onBuy, loading }: Props) {
  return (
    <section
      id="main-cta"
      className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 bg-[#0e1014] text-white scroll-mt-32"
    >
      <div className="max-w-6xl mx-auto">
        {/*
          Poster and previews share the left column so it roughly matches the
          buy box. On mobile the DOM order puts the buy box before previews.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-10">
          {/* Poster */}
          <div className="relative flex items-center justify-center md:col-start-1 md:row-start-1">
            {/* Soft glow so the dark covers lift off the dark background */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-1/2 mx-auto aspect-square w-4/5 max-w-sm -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.28),rgba(43,217,107,0.10)_60%,transparent)] blur-2xl"
            />
            <Image
              src="/images/bundle-poster.png"
              alt="MidiRoad bundle covers"
              width={782}
              height={897}
              sizes="(min-width: 768px) 384px, 352px"
              priority
              className="relative w-full max-w-[22rem] md:max-w-sm h-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Buy box */}
          <div className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-start md:sticky md:top-28">
            <div className="bg-[#18181b] rounded-md p-6 sm:p-8 space-y-6">
              <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
                  The Ultimate MIDI Multikit
                </p>
                <h1 className="text-2xl md:text-3xl leading-tight">
                  Finish beats faster
                </h1>
                <p className="mt-4 text-base font-light leading-relaxed tracking-wide text-gray-300">
                  {MIDI_PATTERN_COUNT} drag-and-drop MIDI drum patterns and{" "}
                  {ONE_SHOT_COUNT} one-shots for dark trap, RnB and soul. Drag,
                  drop, and sound professional.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-4">
                <PriceStack />
                <Button
                  size="lg"
                  className="group relative w-full bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase tracking-wide rounded-full px-8 py-6 text-base shadow-[5px_5px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  onClick={() => onBuy("Product Section Button")}
                  disabled={loading}
                  aria-label={`Get instant access to the MidiRoad bundle for ${formatUSD(PRICING.currentPrice)}`}
                >
                  {loading ? (
                    "Redirecting…"
                  ) : (
                    <span className="flex items-center gap-2">
                      Get Instant Access
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  )}
                </Button>
                <Reassurance />
              </div>
            </div>
          </div>

          {/* Quick listen */}
          <div className="md:col-start-1 md:row-start-2 rounded-md border border-white/10 p-6 sm:p-8">
            <AudioPreviews />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
