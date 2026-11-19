import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account | MidiRoad",
  robots: { index: false, follow: false },
};

/** Signed-in home. Plan, credits and downloads arrive with subscriptions. */
export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?next=/account");
  const { user } = session;

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
          <div className="rounded-xl border border-line bg-canvas p-5 text-sm text-muted">
            Plans and monthly credits are coming soon.
          </div>
          <SignOutButton />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
