import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FreeKitBanner } from "@/components/FreeKitCta";
import { MidiGenerator } from "@/components/MidiGenerator";
import { PatternBrowser } from "@/components/PatternBrowser";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { googleConfigured } from "@/lib/auth";
import { getBeat } from "@/lib/beats";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { PATTERNS, genreBySlug, genrePath } from "@/lib/patterns";
import { pageMetadata } from "@/lib/seo";
import { VIBE_GENRE, beatPath, beatTitle } from "@/lib/shared-beat";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ remixed?: string }> };

/**
 * A beat shared from the beat maker. It opens in the beat maker, ready to play
 * and remix. noindex,follow: thousands of near-identical beat pages would be
 * thin content, but their links to patterns and the kit should still count.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const stored = await getBeat(id);
  if (!stored) return { title: "Beat not found", robots: { index: false, follow: true } };
  const title = `${beatTitle(stored.beat)} | Shared beat`;
  const description = "A trap beat made in the free MidiRoad beat maker. Play it in your browser, remix it, and export the MIDI to your DAW.";
  return pageMetadata({
    title,
    description,
    path: beatPath(id),
    index: false,
    follow: true,
    image: `${beatPath(id)}/opengraph-image`,
  });
}

/** Patterns near the beat's tempo, the matching style first. */
function relatedTo(bpm: number, genreSlug: string, limit = 6) {
  return [...PATTERNS]
    .sort((a, b) => {
      const score = (p: (typeof PATTERNS)[number]) => Math.abs(p.bpm - bpm) + (p.genreSlug === genreSlug ? 0 : 10);
      return score(a) - score(b);
    })
    .slice(0, limit);
}

export default async function SharedBeatPage({ params, searchParams }: Params) {
  const { id } = await params;
  const { remixed } = await searchParams;
  const stored = await getBeat(id);
  if (!stored) notFound();
  const { beat, parentId, remixes } = stored;
  const genre = genreBySlug(VIBE_GENRE[beat.vibe]);
  const related = relatedTo(beat.bpm, VIBE_GENRE[beat.vibe]);

  const intro = (
    <>
      <p>
        {remixed
          ? "Your remix is saved. Change anything you like, then press Share beat to send it."
          : "Press play to hear it. Change the tempo, key, sounds or mutes, then remix it and share your version."}
      </p>
      {(parentId || remixes > 0) && (
        <p className="mt-2 text-sm text-muted">
          {parentId && (
            <>
              Remix of{" "}
              <Link href={beatPath(parentId)} className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                beat {parentId}
              </Link>
            </>
          )}
          {parentId && remixes > 0 && " · "}
          {remixes > 0 && `${remixes} ${remixes === 1 ? "remix" : "remixes"}`}
        </p>
      )}
    </>
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <SiteNav />
      <MidiGenerator
        key={id}
        google={googleConfigured}
        initial={beat}
        sharedId={id}
        heading={beatTitle(beat)}
        intro={intro}
      />
      <div className="bg-graphite px-5 pb-14">
        <FreeKitBanner source="shared-beat" count={FREE_KIT_COUNT} className="mx-auto max-w-6xl" />
      </div>
      <section aria-labelledby="related-heading" className="bg-canvas px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="related-heading" className="text-[28px] leading-[1.05] md:text-[40px]">
            Patterns around {beat.bpm} BPM
          </h2>
          <p className="mb-10 mt-4 max-w-xl text-muted">
            Hand-made MIDI drum patterns near this beat&apos;s tempo
            {genre && (
              <>
                , starting with{" "}
                <Link href={genrePath(genre)} className="font-semibold text-ink underline underline-offset-4">
                  {genre.name.toLowerCase()}
                </Link>
              </>
            )}
            .
          </p>
          <PatternBrowser groups={[{ id: "related", label: "Related patterns", patterns: related }]} />
          <p className="mt-10 text-sm text-muted">
            Start from scratch in the{" "}
            <Link href="/beat-maker" className="font-semibold text-ink underline underline-offset-4">
              free beat maker
            </Link>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
