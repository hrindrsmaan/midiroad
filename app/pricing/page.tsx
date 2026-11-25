import type { Metadata } from "next";
import { PlanPicker } from "@/components/billing/PlanPicker";
import { OneTimeProducts } from "@/components/OneTimeProducts";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { SIGNUP_CREDITS } from "@/lib/plans";
import { currentUser } from "@/lib/session";
import { activeSubscription } from "@/lib/subscription";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Pricing: MIDI Kits and Monthly MIDI Credits",
  description:
    "Buy a MIDI drum kit once, from $4.99, or get The Complete Vault with every kit and 77 one-shots. Monthly MIDI credits unlock single patterns and beat maker exports.",
  path: "/pricing",
});

export default async function PricingPage() {
  const user = await currentUser();
  const sub = user ? await activeSubscription() : null;

  return (
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          <div>
            <Eyebrow className="mb-3">Pricing</Eyebrow>
            <h1 className="text-[34px] leading-[1] tracking-[-0.025em] md:text-[56px]">
              Buy the files once, or get credits every month
            </h1>
            <p className="mt-5 max-w-xl text-muted">
              Kits and the bundle are one-time purchases. Plans are for unlocking single patterns from the library and
              exporting beats from the beat maker. Every new account starts with {SIGNUP_CREDITS} free credits.
            </p>
          </div>

          <OneTimeProducts heading="Own it once" />

          <div className="border-t border-line pt-12">
            <Eyebrow className="mb-3">Monthly plans</Eyebrow>
            <h2 className="text-[26px] leading-tight tracking-[-0.02em] md:text-[36px]">MIDI credits, every month</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              1 credit = 1 MIDI file. Spend them on hand-made patterns in the library or on beats you make in the beat
              maker.
            </p>
            <div className="mt-8">
              <PlanPicker signedIn={!!user} current={sub && { plan: sub.plan, interval: sub.interval }} />
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
