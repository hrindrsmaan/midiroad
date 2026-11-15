import { PRICING, formatUSD } from "@/lib/pricing";

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
        className="text-3xl md:text-4xl font-black text-white tracking-tight"
        aria-label={`Discounted price ${formatUSD(currentPrice)}`}
      >
        {formatUSD(currentPrice)}
      </span>
      <span className="inline-flex items-center bg-[#ff90e8] text-black text-[11px] sm:text-[12px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
        Save {discountPercent}%
      </span>
    </div>
  );
}

export default PriceStack;
