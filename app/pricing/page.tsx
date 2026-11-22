import type { Metadata } from "next";
import Link from "next/link";
import { PlanPicker } from "@/components/billing/PlanPicker";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { SIGNUP_CREDITS } from "@/lib/plans";
import { currentUser } from "@/lib/session";
import { activeSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing: Monthly MIDI Credits",
  description: "Monthly MIDI credits: download any MIDI drum pattern from the library or any beat from the free trap beat maker.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const user = await currentUser();
  const sub = user ? await activeSubscription() : null;

  return (
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="text-center">
            <Eyebrow className="mb-3">Plans</Eyebrow>
            <h1 className="text-3xl leading-tight md:text-5xl">MIDI credits, every month</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              1 credit = 1 MIDI file. Spend them on hand-made patterns in the library or on beats you make in the beat
              maker. Every new account starts with {SIGNUP_CREDITS} free credits.
            </p>
          </div>
          <PlanPicker signedIn={!!user} current={sub && { plan: sub.plan, interval: sub.interval }} />
          <p className="text-center text-sm text-muted">
            Prefer to own it all once? The one-time kits and bundle are still on the{" "}
            <Link href="/#kits" className="font-semibold text-ink underline underline-offset-4">
              home page
            </Link>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
