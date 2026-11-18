import { BUNDLE_PRICE, KITS_TOTAL } from "./products";

/**
 * Bundle pricing for the page. The "original" price is what the six kits
 * cost bought one by one (see lib/products.ts), so the saving is real.
 */
export const PRICING = {
  /** The six kits bought separately (the anchor used in strikethroughs). */
  originalPrice: KITS_TOTAL,
  /** Saving versus buying every kit separately. */
  discountPercent: Math.round(((KITS_TOTAL - BUNDLE_PRICE) / KITS_TOTAL) * 100),
  /** Final amount the customer sees and pays today. */
  currentPrice: BUNDLE_PRICE,
} as const;

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
