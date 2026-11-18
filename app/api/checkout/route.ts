import { stripe } from "@/lib/stripe";
import { sellable, upgradeBase } from "@/lib/products";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * Starts a Stripe Checkout for one product. Buy buttons are plain forms that
 * POST `product` here, so checkout works even before the page's JS loads.
 */
export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const form = await req.formData();
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
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      metadata: { product: product.id },
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // A cancelled upgrade returns to the order page that offered it.
      cancel_url: base
        ? `${origin}/success?session_id=${encodeURIComponent(String(form.get("from")))}`
        : `${origin}${product.path}`,
    });
    if (!session.url) throw new Error("Checkout session has no URL");
    return Response.redirect(session.url, 303);
  } catch (error) {
    logger.error(
      { product: product.id, error: error instanceof Error ? error.message : String(error) },
      "Failed to create checkout session",
    );
    return new Response(
      "Checkout is temporarily unavailable. Please email support@midiroad.com.",
      { status: 500 },
    );
  }
}
