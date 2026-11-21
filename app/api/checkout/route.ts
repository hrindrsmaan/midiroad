import { stripe } from "@/lib/stripe";
import { sellable, upgradeBase, type Sellable } from "@/lib/products";
import { normalizeCart } from "@/lib/cart";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * Starts a Stripe Checkout. Two kinds of form POST here:
 *
 * - `items`: the cart, a comma-separated list of product ids.
 * - `product`: one product, for the upgrade offer and the test kit.
 *
 * Both are plain forms, so checkout works even before the page's JS loads.
 */
export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const form = await req.formData();

  let products: Sellable[];
  let cancelUrl: string;

  const items = form.get("items");
  if (items !== null) {
    const ids = normalizeCart(String(items).split(","));
    products = ids.map((id) => sellable(id)).filter((p): p is Sellable => !!p);
    if (products.length === 0) {
      return new Response("Your cart is empty", { status: 400 });
    }
    cancelUrl = `${origin}/`;
  } else {
    const product = sellable(String(form.get("product") ?? ""));
    if (!product) {
      return new Response("Unknown product", { status: 400 });
    }

    // An upgrade is only sold against a completed order for the kit it
    // upgrades from, so the discounted bundle can't be bought on its own.
    const base = upgradeBase(product.id);
    if (base) {
      const from = String(form.get("from") ?? "");
      let ok = false;
      if (from.startsWith("cs_")) {
        try {
          const original = await stripe.checkout.sessions.retrieve(from);
          ok = original.status === "complete" && original.metadata?.product === base.id;
        } catch {
          ok = false;
        }
      }
      if (!ok) {
        return new Response("This upgrade needs the original order.", { status: 400 });
      }
      // A cancelled upgrade returns to the order page that offered it.
      cancelUrl = `${origin}/success?session_id=${encodeURIComponent(from)}`;
    } else {
      cancelUrl = `${origin}${product.path}`;
    }
    products = [product];
  }

  const ids = products.map((p) => p.id);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: products.map((product) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name, description: product.description },
        },
      })),
      // `product` stays set for one-item orders: the upgrade check and old
      // links read it. `products` lists every item for downloads.
      metadata: { products: ids.join(","), ...(ids.length === 1 ? { product: ids[0] } : {}) },
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });
    if (!session.url) throw new Error("Checkout session has no URL");
    return Response.redirect(session.url, 303);
  } catch (error) {
    logger.error(
      { products: ids, error: error instanceof Error ? error.message : String(error) },
      "Failed to create checkout session",
    );
    return new Response(
      "Checkout is temporarily unavailable. Please email support@inbox.midiroad.com.",
      { status: 500 },
    );
  }
}
