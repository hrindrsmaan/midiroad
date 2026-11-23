import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { checkUnsubscribeToken } from "@/lib/signing";

export const metadata: Metadata = pageMetadata({
  title: "Unsubscribe",
  description: "Stop MidiRoad emails.",
  path: "/unsubscribe",
  index: false,
});

type Props = { searchParams: Promise<{ t?: string; done?: string; invalid?: string }> };

/**
 * The unsubscribe link in every email lands here. It asks for one click
 * rather than unsubscribing on load, so link scanners in mail filters can't
 * unsubscribe people by opening the link.
 */
export default async function UnsubscribePage({ searchParams }: Props) {
  const { t, done, invalid } = await searchParams;
  const valid = !!checkUnsubscribeToken(t ?? null);

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-lg rounded-md border border-line bg-card p-8">
          {done ? (
            <>
              <h1 className="text-3xl">You&apos;re unsubscribed</h1>
              <p className="mt-4 text-muted">MidiRoad won&apos;t email you again. Your free kit link still works until it expires.</p>
            </>
          ) : valid ? (
            <>
              <h1 className="text-3xl">Unsubscribe from MidiRoad emails?</h1>
              <p className="mt-4 text-muted">You&apos;ll stop getting emails about new patterns and offers.</p>
              <form method="post" action="/api/unsubscribe" className="mt-6">
                <input type="hidden" name="t" value={t} />
                <button
                  type="submit"
                  className="h-12 cursor-pointer rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
                >
                  Unsubscribe
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl">{invalid ? "That link didn't work" : "Unsubscribe link not recognized"}</h1>
              <p className="mt-4 text-muted">
                Use the unsubscribe link at the bottom of any MidiRoad email, or write to{" "}
                <a href="mailto:support@inbox.midiroad.com" className="text-ink underline underline-offset-4">
                  support@inbox.midiroad.com
                </a>{" "}
                and we&apos;ll take you off the list.
              </p>
            </>
          )}
          <p className="mt-8 text-sm">
            <Link href="/" className="text-ink underline underline-offset-4">
              Back to MidiRoad
            </Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
