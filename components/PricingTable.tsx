"use client";

import { Button } from "@/components/ui/button";
import { PriceStack } from "@/components/PriceStack";
import { Reassurance } from "@/components/Reassurance";
import {
  DRUM_KIT_NAME,
  MIDI_KIT_COUNT,
  MIDI_PATTERN_COUNT,
  ONE_SHOT_COUNT,
} from "@/lib/bundle";
import { PRICING, formatUSD } from "@/lib/pricing";

type Props = {
  onBuy: (label: string) => void;
  loading?: boolean;
};

/** Short recap; the full breakdown lives in "What's inside". */
const INCLUDED = [
  `${MIDI_PATTERN_COUNT} MIDI drum patterns across ${MIDI_KIT_COUNT} MIDI kits`,
  `${ONE_SHOT_COUNT} one-shot WAVs from the ${DRUM_KIT_NAME}`,
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
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

export function PricingTable({ onBuy, loading }: Props) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-16 md:py-24 px-6 bg-[#0e1014] border-t border-white/10 text-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center">
        <div>
          <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
            One bundle · one price
          </p>
          <h2 id="pricing-heading" className="text-2xl md:text-3xl leading-tight">
            Get the full bundle
          </h2>
          <ul className="mt-6 space-y-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-3 text-base font-light tracking-wide text-gray-300">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#2bd96b]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 rounded-md bg-[#18181b] p-6 sm:p-8">
          <div>
            <PriceStack />
            <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-gray-500">
              One-time payment · lifetime access
            </p>
          </div>
          <Button
            size="lg"
            className="group relative w-full bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase tracking-wide rounded-full px-8 py-6 text-base shadow-[5px_5px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            onClick={() => onBuy("Pricing Section Button")}
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
    </section>
  );
}

export default PricingTable;
