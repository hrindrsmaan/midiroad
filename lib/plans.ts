/**
 * Subscription tiers. Stripe prices are found by lookup key, so the same
 * config works in test and live mode (create them with scripts/stripe-plans.mjs).
 *
 * 1 credit = 1 MIDI file: a library file or a beat maker export.
 * Re-downloading something you've already unlocked is free.
 */
export type PlanId = "starter" | "producer" | "studio";

export type Plan = {
  id: PlanId;
  name: string;
  /** Credits per month. Annual plans get 12 months' worth up front. */
  credits: number;
  monthly: number;
  yearly: number;
  blurb: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  { id: "starter", name: "Starter", credits: 200, monthly: 7.99, yearly: 79, blurb: "For finishing a few beats a week." },
  { id: "producer", name: "Producer", credits: 500, monthly: 14.99, yearly: 149, blurb: "For producers making beats every day.", featured: true },
  { id: "studio", name: "Studio", credits: 1200, monthly: 24.99, yearly: 249, blurb: "For heavy users and small teams." },
];

/** Credits every new account starts with. */
export const SIGNUP_CREDITS = 10;

/** Unused credits roll over, up to this many times one refill. */
export const ROLLOVER_CAP = 2;

export const lookupKey = (id: PlanId, interval: "month" | "year") => `midiroad_${id}_${interval}ly`;

export const planById = (id: string) => PLANS.find((p) => p.id === id);

/** Plan and interval behind a Stripe price lookup key, e.g. midiroad_producer_monthly. */
export function planFromLookupKey(key?: string | null) {
  const m = key?.match(/^midiroad_(\w+)_(month|year)ly$/);
  const plan = m && planById(m[1]);
  return plan ? { plan, interval: m[2] as "month" | "year" } : null;
}

/** Credits one paid period grants. */
export const periodCredits = (plan: Plan, interval: "month" | "year") =>
  interval === "year" ? plan.credits * 12 : plan.credits;
