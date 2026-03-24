import { stripe } from "@/lib/stripe";
import logger from "@/lib/logger";

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
      logger.warn({ error: e }, "Failed to parse checkout request body");
    }

    const amount = isDiscounted ? 1349 : 1499;

    logger.info({
      isDiscounted,
      amount,
      currency: "usd",
    }, "Initiating PaymentIntent creation");

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

    logger.info({
      intentId: paymentIntent.id,
      amount: paymentIntent.amount,
    }, "Successfully created PaymentIntent");

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, "PaymentIntent creation failed");
    return Response.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
