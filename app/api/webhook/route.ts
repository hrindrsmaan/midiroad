import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerList = await headers();
    const sig = headerList.get("stripe-signature");

    if (!sig) {
      console.error("Missing stripe-signature header");
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error(
        "STRIPE_WEBHOOK_SECRET is not set in environment variables",
      );
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Received webhook event:", event.type);

    // Handle checkout.session.completed (works with Payment Links)
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;
      const email = session.customer_details?.email || session.customer_email;

      console.log("Checkout session completed:", {
        sessionId: session.id,
        email: email,
        customerDetails: session.customer_details,
      });

      if (email) {
        console.log("Sending email to:", email);
        try {
          await sendEmail(email);
          console.log("Email sent successfully to:", email);
        } catch (emailError: any) {
          console.error("Failed to send email:", emailError);
          // Don't fail the webhook if email fails
        }
      } else {
        console.warn("No email found in checkout session");
      }
    }

    // Handle payment_intent.succeeded as backup
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent: any = event.data.object;
      console.log("Payment intent succeeded:", paymentIntent.id);
    }

    return new Response("ok");
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
}
