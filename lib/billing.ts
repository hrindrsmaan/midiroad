import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { grantCredits } from "@/lib/credits";
import logger from "@/lib/logger";
import { ROLLOVER_CAP, periodCredits, planFromLookupKey } from "@/lib/plans";
import { stripe } from "@/lib/stripe";

type LinePlan = NonNullable<ReturnType<typeof planFromLookupKey>> & { amount: number };

/** The plan behind each subscription line of an invoice, with the line's amount. */
async function linePlans(invoice: Stripe.Invoice): Promise<LinePlan[]> {
  const out: LinePlan[] = [];
  for (const line of invoice.lines.data) {
    // Newer API versions nest the price under pricing; older ones put it on the line.
    const legacy = (line as unknown as { price?: Stripe.Price | null }).price;
    const ref = line.pricing?.price_details?.price ?? legacy;
    if (!ref) continue;
    const price = typeof ref === "string" ? await stripe.prices.retrieve(ref) : ref;
    const found = planFromLookupKey(price.lookup_key);
    if (found) out.push({ ...found, amount: line.amount });
  }
  return out;
}

async function userForCustomer(customer: Stripe.Invoice["customer"]) {
  const id = typeof customer === "string" ? customer : customer?.id;
  if (!id) return null;
  const [row] = await db.select({ id: user.id }).from(user).where(eq(user.stripeCustomerId, id));
  if (row) return row.id;
  // Fallback: the plugin stores the user id on the Stripe customer.
  const c = await stripe.customers.retrieve(id);
  return (!c.deleted && c.metadata?.userId) || null;
}

/**
 * Credits for a paid subscription invoice:
 * - new subscription or renewal: the plan's credits for the period
 * - mid-cycle upgrade: only the difference between the new and old plan,
 *   so switching plans back and forth can't farm credits
 * The balance is capped at ROLLOVER_CAP refills.
 */
export async function creditPaidInvoice(invoice: Stripe.Invoice) {
  const reason = invoice.billing_reason;
  if (reason !== "subscription_create" && reason !== "subscription_cycle" && reason !== "subscription_update") return;

  const userId = await userForCustomer(invoice.customer);
  if (!userId) {
    logger.warn({ invoiceId: invoice.id }, "Paid invoice for unknown customer");
    return;
  }

  const plans = await linePlans(invoice);
  const current = plans.find((p) => p.amount > 0) ?? plans[0];
  if (!current) return;
  const full = periodCredits(current.plan, current.interval);

  let amount = full;
  if (reason === "subscription_update") {
    if ((invoice.amount_paid ?? 0) <= 0) return; // downgrade or $0 change
    const previous = plans.find((p) => p.amount < 0);
    amount = previous ? full - periodCredits(previous.plan, previous.interval) : 0;
    if (amount <= 0) return;
  }

  const balance = await grantCredits({
    userId,
    amount,
    reason: `${reason}:${current.plan.id}:${current.interval}`,
    ref: `invoice:${invoice.id}`,
    cap: full * ROLLOVER_CAP,
  });
  logger.info({ userId, invoiceId: invoice.id, amount, balance }, "Granted subscription credits");
}
