import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: undefined, // Let Stripe collect email on checkout page
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "MIDI + Drum Kit Bundle",
            },
            unit_amount: 900,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: baseUrl,
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return Response.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
