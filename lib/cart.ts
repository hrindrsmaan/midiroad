import { BUNDLE_ID, BUNDLE_NAME, BUNDLE_PRICE, KIT_PRODUCTS, kitById } from "./products";

/**
 * Cart rules shared by the browser cart and /api/checkout, so the server
 * applies exactly what the cart shows.
 *
 * Only the bundle and the six kits can go in the cart (not the test kit or
 * upgrades). Each is a digital download, so quantity is always one. The
 * bundle already holds every kit, so a cart with the bundle is just the
 * bundle.
 */

export const CART_PRODUCT_IDS = [BUNDLE_ID, ...KIT_PRODUCTS.map((k) => k.id)];

export function normalizeCart(ids: string[]): string[] {
  const valid = [...new Set(ids)].filter((id) => CART_PRODUCT_IDS.includes(id));
  return valid.includes(BUNDLE_ID) ? [BUNDLE_ID] : valid;
}

export type CartItem = { id: string; name: string; price: number; href: string };

export function cartItem(id: string): CartItem | undefined {
  if (id === BUNDLE_ID) return { id, name: BUNDLE_NAME, price: BUNDLE_PRICE, href: "/#main-cta" };
  const kit = kitById(id);
  return kit && { id, name: kit.name, price: kit.price, href: `/kits/${kit.slug}` };
}

export function cartTotal(ids: string[]) {
  return Math.round(ids.reduce((n, id) => n + (cartItem(id)?.price ?? 0), 0) * 100) / 100;
}

/**
 * Product ids an order bought, from its Checkout Session metadata. Cart
 * orders list them in `products`; single-product orders use `product`; old
 * Payment Link orders have neither and bought the bundle.
 */
export function orderProductIds(metadata: Record<string, string> | null | undefined): string[] {
  if (metadata?.products) return metadata.products.split(",").filter(Boolean);
  return [metadata?.product ?? BUNDLE_ID];
}
