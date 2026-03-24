import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let isDiscounted = false;

    try {
      const body = await request.json();
      if (body.discount === true) {
        isDiscounted = true;
      }
    } catch (e) {
      // Ignored
    }

    const amount = isDiscounted ? 1349 : 1499;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product: "MidiRoad Bundle",
        discounted: isDiscounted ? "true" : "false",
      },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("PaymentIntent error:", error);
    return Response.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
