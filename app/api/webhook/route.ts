import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerList = await headers();
    const sig = headerList.get("stripe-signature");

    if (!sig) {
      logger.error("Missing stripe-signature header");
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error("STRIPE_WEBHOOK_SECRET is not set in environment variables");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    logger.info(
      { eventType: event.type, eventId: event.id },
      "Received Stripe webhook event",
    );

    // Handle checkout.session.completed for Payment Links
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;
      const email = session.customer_details?.email || session.customer_email;

      logger.info(
        {
          sessionId: session.id,
          email: email,
          amount: session.amount_total,
        },
        "Checkout session completed",
      );

      if (email) {
        logger.info({ email }, "Sending fulfillment email");
        try {
          await sendEmail(email, session.id);
          logger.info({ email }, "Email sent successfully");
        } catch (emailError: any) {
          logger.error(
            { email, error: emailError.message },
            "Failed to send fulfillment email",
          );
        }
      } else {
        logger.warn(
          { sessionId: session.id },
          "No email found in checkout session",
        );
      }
    }

    return new Response("ok");
  } catch (error: any) {
    logger.error(
      { error: error.message, stack: error.stack },
      "Webhook processing failed",
    );
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
}
