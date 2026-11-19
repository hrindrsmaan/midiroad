"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { formatUSD } from "@/lib/pricing";
import { PLANS, type PlanId } from "@/lib/plans";

type Current = { plan: PlanId; interval: "month" | "year" } | null;

/** The three tiers with a monthly/yearly switch. Subscribing goes to Stripe Checkout. */
export function PlanPicker({ signedIn, current }: { signedIn: boolean; current: Current }) {
  const router = useRouter();
  const [yearly, setYearly] = useState(current?.interval === "year");
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [error, setError] = useState("");

  async function choose(plan: PlanId) {
    if (!signedIn) return router.push("/login?next=/pricing");
    setBusy(plan);
    setError("");
    const { error } = await authClient.subscription.upgrade({
      plan,
      annual: yearly,
      successUrl: "/account?subscribed=1",
      cancelUrl: "/pricing",
      returnUrl: "/account",
    });
    if (error) {
      setError(error.message ?? "Couldn't start checkout. Try again.");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-line bg-white p-1 text-sm font-semibold">
          {[false, true].map((y) => (
            <button
              key={String(y)}
              onClick={() => setYearly(y)}
              className={`rounded-full px-5 py-2 transition-colors ${yearly === y ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              {y ? "Yearly · 2 months free" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = current?.plan === p.id && (current.interval === "year") === yearly;
          const price = yearly ? p.yearly : p.monthly;
          const perCredit = (yearly ? p.yearly / 12 : p.monthly) / p.credits;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 ${p.featured ? "border-brand shadow-lg" : "border-line"}`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted">{p.blurb}</p>
              <p className="mt-5">
                <span className="text-4xl font-bold">{formatUSD(price)}</span>
                <span className="text-sm text-muted">/{yearly ? "year" : "month"}</span>
              </p>
              <p className="mt-1 text-xs text-muted">{(perCredit * 100).toFixed(1)}¢ per MIDI file</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                <li>
                  <strong>{p.credits.toLocaleString()} credits</strong> a month
                  {yearly && ` (${(p.credits * 12).toLocaleString()} up front)`}
                </li>
                <li>1 credit = 1 MIDI file from the library or the beat maker</li>
                <li>Re-download anything you&apos;ve unlocked, free</li>
                <li>Unused credits roll over (up to 2 refills)</li>
                <li>Cancel anytime, keep your files</li>
              </ul>
              <button
                onClick={() => choose(p.id)}
                disabled={busy !== null || isCurrent}
                className={`mt-6 h-12 rounded-full text-sm font-semibold transition-colors disabled:opacity-60 ${
                  p.featured ? "bg-brand text-white hover:bg-brand-hover" : "border border-ink hover:bg-canvas"
                }`}
              >
                {isCurrent ? "Your plan" : busy === p.id ? "Opening checkout…" : current ? "Switch plan" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="text-center text-sm text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
