"use client";

import { OFFERS, getOfferPaymentLink, type Offer } from "@/lib/offers";
import { formatUSD } from "@/lib/pricing";
import * as gtag from "@/lib/gtag";

function FeatureItem({ text }: { text: string }) {
  // Render an inline-bolder **word** runs (used to emphasize "**Everything**" etc.)
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed">
      <span
        aria-hidden
        className="mt-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-[#ff90e8] text-[10px] font-black shrink-0"
      >
        ✓
      </span>
      <span className="text-black">
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-extrabold">
              {p}
            </strong>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </span>
    </li>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const isPopular = offer.id === "standard";
  const accentText = offer.id === "pro" ? "text-black" : "text-black";
  const onClick = () => {
    // GA tracking — distinct label per tier for funnel analytics.
    gtag.event({
      action: "click_download",
      category: "engagement",
      label: `Pricing CTA — ${offer.name}${isPopular ? " (DISCOUNTED)" : ""}`,
    });
    const url = getOfferPaymentLink(offer.id);
    if (url) window.location.href = url;
  };

  // Tier-specific button styling.
  const buttonClass = isPopular
    ? "bg-black text-white hover:bg-gray-800 shadow-[3px_3px_0_0_#fff]"
    : offer.id === "pro"
      ? "bg-white text-black border-2 border-black hover:bg-black hover:text-white"
      : "bg-white text-black border-2 border-black hover:bg-black hover:text-white";

  return (
    <div
      className={`relative rounded-2xl border-2 border-black p-6 flex flex-col h-full ${offer.accent} shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]`}
    >
      {/* Sticker badge for the popular tier */}
      {offer.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-block bg-black text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_#ff90e8]">
            {offer.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4 pt-2">
        <p className={`text-[11px] sm:text-[12px] font-black uppercase tracking-widest ${accentText}`}>
          {offer.tagline}
        </p>
        <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
          {offer.name}
        </h3>
      </div>

      {/* Price */}
      <div className="text-center mb-5">
        <p className="text-5xl sm:text-6xl font-black tracking-tighter leading-none">
          {formatUSD(offer.price)}
        </p>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black/70 mt-2">
          One-time · Lifetime access
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onClick}
        className={`w-full font-extrabold uppercase tracking-wider text-sm sm:text-base py-3 rounded-full transition-all ${buttonClass}`}
        aria-label={`Choose ${offer.name} for ${formatUSD(offer.price)}`}
      >
        Get {offer.name}
      </button>

      {/* Rationale line */}
      <p className="text-[12px] italic text-black/80 text-center mt-4 mb-5 leading-snug">
        {offer.rationale}
      </p>

      {/* Feature list */}
      <ul className="space-y-2.5 flex-1">
        {offer.features.map((f, i) => (
          <FeatureItem key={i} text={f} />
        ))}
      </ul>
    </div>
  );
}

export function PricingTable() {
  const sorted = [...OFFERS].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-16 md:py-20 px-6 bg-white border-t-2 border-b-2 border-black"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-black bg-[#9eff9e] border-2 border-black rounded-full px-3 py-1 shadow-[3px_3px_0_0_#000] -rotate-2">
            Pick Your Tier
          </span>
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl font-black mt-4 mb-3 tracking-tight"
          >
            One system. Three ways in.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Every tier is royalty-free, works in every major DAW, and ships
            instantly. Pick what fits your workflow — upgrade anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 lg:gap-6 items-stretch">
          {sorted.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* Reassurance row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] sm:text-[13px] font-semibold text-black">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden>🔒</span> Secure checkout (Stripe)
          </span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden>⚡</span> Instant download
          </span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden>🛡</span> 30-day refund
          </span>
        </div>
      </div>
    </section>
  );
}

export default PricingTable;
