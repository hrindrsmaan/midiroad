import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { BUNDLE_ID, BUNDLE_NAME } from "@/lib/products";
import { PriceStack } from "@/components/PriceStack";
import { Reassurance } from "@/components/Reassurance";
import {
  DRUM_KIT_NAME,
  MIDI_KIT_COUNT,
  MIDI_PATTERN_COUNT,
  ONE_SHOT_COUNT,
} from "@/lib/bundle";
import { PRICING, formatUSD } from "@/lib/pricing";

/** Short recap; the full breakdown lives in "What's inside". */
const INCLUDED = [
  `All ${MIDI_KIT_COUNT} MIDI kits: ${MIDI_PATTERN_COUNT} MIDI drum patterns`,
  `${ONE_SHOT_COUNT} one-shot WAVs from the ${DRUM_KIT_NAME} (bundle only)`,
  `${formatUSD(PRICING.originalPrice)} worth of kits if bought separately`,
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

export function PricingTable() {
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
          <BuyButton
            product={BUNDLE_ID}
            label="Pricing Section Button"
            className={BUY_BUTTON_CLASS}
            aria-label={`Get instant access to ${BUNDLE_NAME} for ${formatUSD(PRICING.currentPrice)}`}
          >
            <span className="flex items-center gap-2">
              Get the Bundle
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </BuyButton>
          <Reassurance />
        </div>
      </div>
    </section>
  );
}

export default PricingTable;
