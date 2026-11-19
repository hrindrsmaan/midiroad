import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { stripe as stripePlugin } from "@better-auth/stripe";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendMagicLinkEmail } from "@/lib/email";
import { creditPaidInvoice } from "@/lib/billing";
import { grantCredits } from "@/lib/credits";
import { PLANS, SIGNUP_CREDITS, lookupKey } from "@/lib/plans";
import { stripe } from "@/lib/stripe";

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/**
 * Server auth: Google sign-in plus passwordless email (magic link).
 * Users and sessions live in Neon through Drizzle (lib/db/schema.ts).
 * Subscriptions run through Better Auth's Stripe plugin; paid invoices add
 * credits (lib/billing.ts).
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.BASE_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  user: {
    // Exposed on the session so the nav can show the balance. input: false
    // means clients can never set it; it only changes through lib/credits.ts.
    additionalFields: { credits: { type: "number", input: false, required: false } },
  },
  account: {
    // One person, one account: Google and magic link with the same verified
    // email land on the same user.
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (u) => {
          await grantCredits({ userId: u.id, amount: SIGNUP_CREDITS, reason: "signup", ref: `signup:${u.id}` });
        },
      },
    },
  },
  plugins: [
    stripePlugin({
      stripeClient: stripe,
      // Its own endpoint (/api/auth/stripe/webhook), so its own secret in production.
      stripeWebhookSecret: (process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET)!,
      subscription: {
        enabled: true,
        plans: PLANS.map((p) => ({
          name: p.id,
          lookupKey: lookupKey(p.id, "month"),
          annualDiscountLookupKey: lookupKey(p.id, "year"),
          limits: { credits: p.credits },
        })),
        getCheckoutSessionParams: async () => ({ params: { allow_promotion_codes: true } }),
      },
      onEvent: async (event: Stripe.Event) => {
        if (event.type === "invoice.paid") await creditPaidInvoice(event.data.object);
      },
    }),
    magicLink({
      sendMagicLink: ({ email, url }) => sendMagicLinkEmail(email, url),
    }),
    nextCookies(), // must stay last: lets server actions set the session cookie
  ],
});

export { googleConfigured };
export type Session = typeof auth.$Infer.Session;
