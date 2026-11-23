import type { Metadata } from "next";
import Link from "next/link";
import { LibraryList } from "@/components/library/LibraryList";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getCredits, getUnlocks } from "@/lib/credits";
import { LIBRARY, LIBRARY_FOLDERS } from "@/lib/library";
import { patternByLibraryId } from "@/lib/patterns";
import { currentUser } from "@/lib/session";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "MIDI Library: Single Trap Drum Patterns",
  description:
    "Every hand-made MidiRoad MIDI drum pattern, one file at a time: hi-hats, snares, kicks and 808s for trap and drill. 1 credit each.",
  path: "/library",
});

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
              . Each pattern also has a public preview page.{" "}
              <Link href="/midi" className="font-semibold text-ink underline underline-offset-4">
                Browse by style and tempo
              </Link>
            </p>
          </div>
          <LibraryList
            folders={LIBRARY_FOLDERS.map((group) => ({
              folder: group.folder,
              items: group.items.map((item) => {
                const pub = patternByLibraryId(item.id);
                return { ...item, href: pub?.path, title: pub?.title };
              }),
            }))}
            owned={owned}
            credits={credits}
            signedIn={!!user}
          />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
