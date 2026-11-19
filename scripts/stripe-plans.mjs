#!/usr/bin/env node
/**
 * Creates the three subscription plans in Stripe (one product each, with a
 * monthly and a yearly price found by lookup key). Safe to re-run: existing
 * lookup keys are skipped. Uses STRIPE_SECRET_KEY, so it targets test or live
 * mode depending on the key:
 *
 *   node --env-file=.env scripts/stripe-plans.mjs
 *
 * Keep in sync with lib/plans.ts.
 */
import Stripe from "stripe";

const PLANS = [
  { id: "starter", name: "MidiRoad Starter", credits: 200, monthly: 799, yearly: 7900 },
  { id: "producer", name: "MidiRoad Producer", credits: 500, monthly: 1499, yearly: 14900 },
  { id: "studio", name: "MidiRoad Studio", credits: 1200, monthly: 2499, yearly: 24900 },
];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const mode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "LIVE" : "test";
console.log(`Stripe ${mode} mode`);

for (const plan of PLANS) {
  const keys = ["month", "year"].map((i) => `midiroad_${plan.id}_${i}ly`);
  const existing = await stripe.prices.list({ lookup_keys: keys, limit: 10 });
  const found = new Set(existing.data.map((p) => p.lookup_key));
  if (found.size === keys.length) {
    console.log(`✓ ${plan.name} already exists`);
    continue;
  }

  const product =
    existing.data[0]?.product ??
    (
      await stripe.products.create({
        name: plan.name,
        description: `${plan.credits} credits a month. 1 credit = 1 MIDI file.`,
        metadata: { plan: plan.id, credits: String(plan.credits) },
      })
    ).id;

  for (const [interval, amount] of [["month", plan.monthly], ["year", plan.yearly]]) {
    const lookup_key = `midiroad_${plan.id}_${interval}ly`;
    if (found.has(lookup_key)) continue;
    await stripe.prices.create({
      product,
      currency: "usd",
      unit_amount: amount,
      recurring: { interval },
      lookup_key,
      metadata: { plan: plan.id },
    });
    console.log(`+ ${lookup_key}  $${(amount / 100).toFixed(2)}/${interval}`);
  }
}
