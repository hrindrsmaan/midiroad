import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInForm";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { auth, googleConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/** Only same-site paths, so ?next= can't bounce users to another domain. */
function safeNext(next?: string) {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(next);

  return (
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
          <div>
            <Eyebrow className="mb-3">Account</Eyebrow>
            <h1 className="text-2xl leading-tight md:text-3xl">Sign in to MidiRoad</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              No password needed. New here? Signing in creates your account.
            </p>
          </div>
          <SignInForm google={googleConfigured} callbackURL={next} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
