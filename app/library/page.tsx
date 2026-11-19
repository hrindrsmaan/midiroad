import type { Metadata } from "next";
import { LibraryList } from "@/components/library/LibraryList";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getCredits, getUnlocks } from "@/lib/credits";
import { LIBRARY, LIBRARY_FOLDERS } from "@/lib/library";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MIDI Library | MidiRoad",
  description: "Every hand-made MidiRoad MIDI pattern, one file at a time. 1 credit each.",
};

export default async function LibraryPage() {
  const user = await currentUser();
  const [credits, unlocks] = user ? await Promise.all([getCredits(user.id), getUnlocks(user.id)]) : [0, new Set<string>()];
  const owned = [...unlocks].filter((k) => k.startsWith("lib:")).map((k) => k.slice(4));

  return (
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <Eyebrow className="mb-3">Library</Eyebrow>
            <h1 className="text-3xl leading-tight md:text-4xl">{LIBRARY.length} MIDI patterns, one at a time</h1>
            <p className="mt-3 text-muted">
              Pick just the files you need: 1 credit each, and anything you&apos;ve unlocked downloads again for free.{" "}
              <a href="/pricing" className="font-semibold text-ink underline underline-offset-4">
                See plans
              </a>
            </p>
          </div>
          <LibraryList folders={LIBRARY_FOLDERS} owned={owned} credits={credits} signedIn={!!user} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
