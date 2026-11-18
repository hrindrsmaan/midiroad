import { stripe } from "@/lib/stripe";
import { sellable } from "@/lib/products";
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
      cancel_url: `${origin}${product.path}`,
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
