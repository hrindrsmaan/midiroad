import { PRICING, formatUSD } from "@/lib/pricing";

type Props = {
  /**
   * Where the badge sits visually:
   * - "inline"   → stacked above price (used inside ProductDetail)
   * - "floating" → fixed floating pill in the corner (mobile promo)
   */
  variant?: "inline" | "floating";
};

export function DiscountBadge({ variant = "inline" }: Props) {
  const pct = PRICING.discountPercent;

  if (variant === "floating") {
    return (
      <div className="fixed top-20 right-4 z-[60] hidden md:block" aria-hidden>
        <div className="bg-[#ff90e8] border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0_0_#000] -rotate-6 hover:rotate-0 transition-transform">
          <span className="text-[12px] font-black uppercase tracking-wider text-black">
            🔥 {pct}% Off Today
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 bg-[#ff90e8] border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0_0_#000]"
      role="status"
      aria-label={`Limited time discount: ${pct} percent off`}
    >
      <span aria-hidden className="text-base leading-none">🔥</span>
      <span className="text-[12px] sm:text-[13px] font-black uppercase tracking-wider text-black">
        {pct}% Off — Limited Time
      </span>
    </div>
  );
}

type PriceStackProps = {
  originalPrice?: number;
  currentPrice?: number;
  discountPercent?: number;
};

export function PriceStack({
  originalPrice = PRICING.originalPrice,
  currentPrice = PRICING.currentPrice,
  discountPercent = PRICING.discountPercent,
}: PriceStackProps) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span
        className="text-xl md:text-2xl font-medium text-gray-400 line-through"
        aria-label={`Original price ${formatUSD(originalPrice)}`}
      >
        {formatUSD(originalPrice)}
      </span>
      <span
        className="text-3xl md:text-4xl font-black text-black tracking-tight"
        aria-label={`Discounted price ${formatUSD(currentPrice)}`}
      >
        {formatUSD(currentPrice)}
      </span>
      <span className="inline-flex items-center bg-black text-[#ff90e8] text-[11px] sm:text-[12px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
        Save {discountPercent}%
      </span>
    </div>
  );
}

export default DiscountBadge;
