import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { FreeKitForm } from "@/components/FreeKitForm";
import { JsonLd } from "@/components/JsonLd";
import { PatternBrowser } from "@/components/PatternBrowser";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import type { FaqItem } from "@/lib/faq";
import {
  FREE_KIT_COUNT,
  FREE_KIT_MAX_BPM,
  FREE_KIT_MIN_BPM,
  FREE_KIT_NAME,
  FREE_KIT_PATH,
  FREE_KIT_PATTERNS,
} from "@/lib/free-kit";
import { GENRES } from "@/lib/patterns";
import { pageMetadata } from "@/lib/seo";
import { FREE_KIT_LINK_DAYS } from "@/lib/signing";
import { ORG_ID, SITE_NAME, SITE_URL, absoluteUrl, faqJsonLd } from "@/lib/site";

const title = `Free MIDI Drum Kit: ${FREE_KIT_COUNT} Trap & Drill Patterns`;
const description = `Download ${FREE_KIT_COUNT} free royalty-free MIDI drum patterns: hi-hats, snares, kicks and 808s for trap, drill and dark trap, ${FREE_KIT_MIN_BPM}–${FREE_KIT_MAX_BPM} BPM. Works in FL Studio, Ableton, Logic and any DAW.`;
const image = `${FREE_KIT_PATH}/opengraph-image`;

export const metadata: Metadata = pageMetadata({ title, description, path: FREE_KIT_PATH, image });

const FAQS: FaqItem[] = [
  {
    q: "Is the MIDI kit really free?",
    a: `Yes. Enter your email and you get a download link for all ${FREE_KIT_COUNT} patterns straight away, on the page and by email. No account, no password and no card.`,
  },
  {
    q: "Can I use these patterns in released music?",
    a: "Yes. The patterns are royalty-free: use them in beats you sell, lease or release, with no credit needed. The one thing you can't do is resell or share the MIDI files themselves as a pack.",
  },
  {
    q: "Which DAWs do the MIDI files work in?",
    a: "Any DAW that opens MIDI: FL Studio, Ableton Live, Logic Pro, Studio One, Reason, Cubase, Pro Tools and GarageBand. Drag a file onto a drum, hi-hat or 808 channel and set the project to the BPM in the file name.",
  },
  {
    q: "What's in the free kit?",
    a: `${FREE_KIT_COUNT} patterns, two from each MidiRoad style: trap, street trap, melodic trap, dark trap, drill and 808 bass. They cover hi-hats, snares, kicks and 808 lines from ${FREE_KIT_MIN_BPM} to ${FREE_KIT_MAX_BPM} BPM.`,
  },
  {
    q: "How long does the download link work?",
    a: `${FREE_KIT_LINK_DAYS} days. If it has expired, enter your email on this page again and you'll get a fresh link.`,
  },
  {
    q: "Will you email me?",
    a: "Occasionally, with new patterns and offers. Every email has an unsubscribe link, and one click takes you off the list.",
  },
];

/** The 12 patterns grouped by style, for the browser preview list. */
const groups = GENRES.map((genre) => ({
  id: genre.slug,
  label: genre.name,
  patterns: FREE_KIT_PATTERNS.filter((p) => p.genreSlug === genre.slug),
})).filter((g) => g.patterns.length > 0);

export default function FreeMidiKitPage() {
  const url = absoluteUrl(FREE_KIT_PATH);
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: FREE_KIT_NAME,
            description,
            image: absoluteUrl(image),
            brand: { "@type": "Brand", name: SITE_NAME },
            category: "MIDI drum kits",
            url,
            offers: {
              "@type": "Offer",
              price: "0.00",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url,
              seller: { "@id": ORG_ID },
            },
            hasPart: FREE_KIT_PATTERNS.map((p) => ({
              "@type": "MusicRecording",
              name: p.title,
              url: absoluteUrl(p.path),
              genre: p.genreName,
            })),
          },
          faqJsonLd(FAQS),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Free MIDI kit", item: url },
            ],
          },
        ]}
      />
      <SiteNav />
      <section id="get-kit" className="scroll-mt-20 px-5 pb-14 pt-14 md:pb-20 md:pt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div>
            <Eyebrow className="mb-4">Free · royalty-free · any DAW</Eyebrow>
            <h1 className="text-balance text-[38px] leading-[0.98] tracking-[-0.02em] md:text-[60px]">
              {FREE_KIT_COUNT} free MIDI drum patterns
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Hi-hat rolls, snares, kicks and 808 lines from all six MidiRoad kits: trap, street trap, melodic trap,
              dark trap, drill and 808 bass, {FREE_KIT_MIN_BPM}–{FREE_KIT_MAX_BPM} BPM. Drag them into FL Studio,
              Ableton, Logic or any DAW.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li>✓ {FREE_KIT_COUNT} .mid files in one zip</li>
              <li>✓ Royalty-free for released music</li>
              <li>✓ Download link on screen and by email</li>
            </ul>
          </div>
          <div className="rounded-md border border-line bg-card p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] md:p-8">
            <h2 className="text-2xl">Get the free kit</h2>
            <p className="mb-5 mt-2 text-sm text-muted">Enter your email and download it now.</p>
            <FreeKitForm count={FREE_KIT_COUNT} />
          </div>
        </div>
      </section>

      <section aria-labelledby="inside-heading" className="bg-canvas px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow className="mb-3">What&apos;s inside</Eyebrow>
          <h2 id="inside-heading" className="max-w-3xl text-[28px] leading-[1.05] md:text-[40px]">
            Preview every pattern in the kit
          </h2>
          <p className="mb-10 mt-4 max-w-xl text-muted">
            Played here with MidiRoad drum samples. Each one links to its own page with tempo, length and the kit it
            comes from.
          </p>
          <PatternBrowser groups={groups} />
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-3xl">
          <FaqList faqs={FAQS} title="Free MIDI kit FAQ" />
          <p className="mt-10 text-sm text-muted">
            Want the full kits?{" "}
            <Link href="/#kits" className="font-semibold text-ink underline underline-offset-4">
              See every MidiRoad kit
            </Link>
            , or make your own beat in the{" "}
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
