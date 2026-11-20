import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { planById, type PlanId } from "@/lib/plans";

/** The signed-in user's active (or trialing) subscription, or null. */
export async function activeSubscription() {
  const subs = await auth.api.listActiveSubscriptions({ headers: await headers() }).catch(() => []);
  const sub = subs.find((s) => s.status === "active" || s.status === "trialing");
  const plan = sub && planById(sub.plan);
  if (!sub || !plan) return null;
  return {
    ...sub,
    plan: plan.id as PlanId,
    planName: plan.name,
    interval: (sub.billingInterval === "year" ? "year" : "month") as "month" | "year",
  };
}
