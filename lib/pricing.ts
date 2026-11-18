/**
 * Single source of truth for the bundle's pricing & discount.
 *
 * To run a real promotion through Stripe, create a Coupon in
 * https://dashboard.stripe.com/coupons with the same percent_off and add
 * its ID to .env as STRIPE_COUPON_ID, then pass it via `?prefilled_promo_code=`
 * on the Stripe Payment Link URL.
 */
export const PRICING = {
  /** What the bundle normally costs (the anchor used in strikethroughs). */
  originalPrice: 39.99,
  /** Active promotional percentage off (auto-derived from the two prices). */
  discountPercent: Math.round(((39.99 - 14.99) / 39.99) * 100),
  /** Final amount the customer sees and pays today. */
  currentPrice: 14.99,
} as const;

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
