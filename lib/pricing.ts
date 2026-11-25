import { BUNDLE_ID, BUNDLE_PRICE, KITS_TOTAL } from "./products";

/**
 * Black Friday sale on the bundle. The bundle shows a "was" price and a
 * coupon code takes a further fixed amount off the bundle at checkout.
 * Set `active` to false to end the sale: prices and banners go back to normal
 * and the code stops working.
 */
export const BLACK_FRIDAY = {
  active: true,
  /** The bundle's regular price, shown struck through during the sale. */
  wasPrice: 29,
  /** Coupon for an extra discount on the bundle (case-insensitive). */
  couponCode: "VAULT999",
  /** Dollars off the bundle with the coupon. */
  couponAmount: 5,
} as const;

/**
 * Private invite codes sent by email. Same $5 off the bundle as the sale code,
 * but they keep working after the sale ends. Each also exists as a Stripe
 * promotion code, so it works when typed on the Stripe checkout page too.
 */
export const VIP_CODES: readonly string[] = ["VIP999"];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * The struck-through anchor: the regular price during the sale, otherwise
 * what the six kits cost bought one by one.
 */
const ANCHOR = BLACK_FRIDAY.active ? BLACK_FRIDAY.wasPrice : KITS_TOTAL;

/**
 * The price a buyer actually pays for the bundle right now. The sale code is
 * applied by default in the cart, so this is the number to show as the price,
 * not the pre-coupon one. With the sale off it is just the bundle price.
 */
export const BUNDLE_PRICE_NOW = BLACK_FRIDAY.active
  ? round2(BUNDLE_PRICE - BLACK_FRIDAY.couponAmount)
  : BUNDLE_PRICE;

/** Bundle pricing for the page. */
export const PRICING = {
  originalPrice: ANCHOR,
  /** Saving versus the anchor. */
  discountPercent: Math.round(((ANCHOR - BUNDLE_PRICE) / ANCHOR) * 100),
  /** Final amount the customer sees and pays today, before any coupon. */
  currentPrice: BUNDLE_PRICE,
  /** Price with the Black Friday coupon applied. */
  couponPrice: BUNDLE_PRICE_NOW,
} as const;

/** The normalized coupon code if it's valid right now, else undefined. */
export function validCoupon(code: string | null | undefined): string | undefined {
  const c = (code ?? "").trim().toUpperCase();
  if (VIP_CODES.includes(c)) return c;
  return BLACK_FRIDAY.active && c === BLACK_FRIDAY.couponCode ? c : undefined;
}

/**
 * Price of one product with a coupon. The coupon only discounts the bundle
 * (not single kits or upgrades). Shared by the cart and /api/checkout so the
 * server charges exactly what the cart shows.
 */
export function priceWithCoupon(productId: string, price: number, coupon: string | undefined) {
  if (!validCoupon(coupon) || productId !== BUNDLE_ID) return price;
  return round2(Math.max(0, price - BLACK_FRIDAY.couponAmount));
}

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
