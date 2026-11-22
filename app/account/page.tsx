import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ManageBillingButton } from "@/components/billing/ManageBillingButton";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getCredits, getUnlocks } from "@/lib/credits";
import { currentUser } from "@/lib/session";
import { activeSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

const date = (d?: Date | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

/** Signed-in home: credits, plan and billing. */
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");
  const [credits, unlocks, sub, { subscribed }] = await Promise.all([
    getCredits(user.id),
    getUnlocks(user.id),
    activeSubscription(),
    searchParams,
  ]);

  return (
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
          <div>
            <Eyebrow className="mb-3">Account</Eyebrow>
            <h1 className="text-2xl leading-tight md:text-3xl">
              {user.name ? `Hey, ${user.name.split(" ")[0]}` : "Your account"}
            </h1>
            <p className="mt-2 text-sm text-muted">{user.email}</p>
          </div>

          {subscribed && (
            <p className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm">
              <strong>You&apos;re subscribed.</strong> Credits land as soon as Stripe confirms the payment, usually
              within seconds. Refresh if they aren&apos;t here yet.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-canvas p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Credits</p>
              <p className="mt-1 text-3xl font-bold">{credits}</p>
            </div>
            <div className="rounded-xl border border-line bg-canvas p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Files unlocked</p>
              <p className="mt-1 text-3xl font-bold">{unlocks.size}</p>
            </div>
          </div>

          <div className="rounded-xl border border-line p-5 text-sm">
            {sub ? (
              <div className="space-y-3">
                <p>
                  <strong>{sub.planName}</strong> plan, billed {sub.interval === "year" ? "yearly" : "monthly"}.
                </p>
                <p className="text-muted">
                  {sub.cancelAtPeriodEnd
                    ? `Cancels on ${date(sub.periodEnd)}. Your credits stay until you use them.`
                    : `Renews on ${date(sub.periodEnd)}.`}
                </p>
                <div className="flex flex-wrap gap-3">
                  <ManageBillingButton />
                  <Link
                    href="/pricing"
                    className="flex h-11 items-center rounded-full px-4 text-sm font-semibold text-muted hover:text-ink"
                  >
                    Change plan
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  <strong>No plan yet.</strong> Get up to 1,200 MIDI files a month.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  See plans
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/library" className="text-brand hover:underline">
              Browse the library →
            </Link>
            <Link href="/#generator" className="text-brand hover:underline">
              Open the beat maker →
            </Link>
          </div>
          <SignOutButton />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
