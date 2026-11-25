import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { BUY_BUTTON_CLASS, BuyButton } from "@/components/BuyButton";
import { JsonLd } from "@/components/JsonLd";
import { TrackTable } from "@/components/catalog/TrackTable";
import { toCatalogTrack } from "@/lib/catalog";
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
import { pageMetadata } from "@/lib/seo";
import { STARTER_ID, STARTER_PRICE } from "@/lib/products";
import { formatUSD } from "@/lib/pricing";
import { ORG_ID, SITE_NAME, SITE_URL, absoluteUrl, faqJsonLd } from "@/lib/site";

const title = `MIDI Drum Starter Kit: ${FREE_KIT_COUNT} Trap & Drill Patterns for $1`;
const description = `Get ${FREE_KIT_COUNT} royalty-free MIDI drum patterns for $1: hi-hats, snares, kicks and 808s for trap, drill and dark trap, ${FREE_KIT_MIN_BPM}–${FREE_KIT_MAX_BPM} BPM. Works in FL Studio, Ableton, Logic and any DAW.`;
const image = `${FREE_KIT_PATH}/opengraph-image`;

export const metadata: Metadata = pageMetadata({ title, description, path: FREE_KIT_PATH, image });

const FAQS: FaqItem[] = [
  {
    q: "Why does the starter kit cost $1?",
    a: `It's a taste of all six MidiRoad kits for less than a coffee: ${FREE_KIT_COUNT} patterns, one payment, and the download starts right after checkout. No account needed.`,
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
    q: "What's in the starter kit?",
    a: `${FREE_KIT_COUNT} patterns, two from each MidiRoad style: trap, street trap, melodic trap, dark trap, drill and 808 bass. They cover hi-hats, snares, kicks and 808 lines from ${FREE_KIT_MIN_BPM} to ${FREE_KIT_MAX_BPM} BPM.`,
  },
  {
    q: "How do I get the files?",
    a: "Right after checkout you land on a download page, and we email you a download link you can reuse anytime.",
  },
  {
    q: "Can I upgrade to every kit later?",
    a: "Yes. After you buy, the download page offers The Complete Vault for the difference, so your $1 counts toward it.",
  },
];

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
              price: STARTER_PRICE.toFixed(2),
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
              { "@type": "ListItem", position: 2, name: "MIDI starter kit", item: url },
            ],
          },
        ]}
      />
      <SiteNav />
      <section id="get-kit" className="scroll-mt-20 px-5 pb-14 pt-14 md:pb-20 md:pt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div>
            <Eyebrow className="mb-4">{formatUSD(STARTER_PRICE)} · royalty-free · any DAW</Eyebrow>
            <h1 className="text-balance text-[38px] leading-[0.98] tracking-[-0.02em] md:text-[60px]">
              {FREE_KIT_COUNT} MIDI drum patterns for $1
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Hi-hat rolls, snares, kicks and 808 lines from all six MidiRoad kits: trap, street trap, melodic trap,
              dark trap, drill and 808 bass, {FREE_KIT_MIN_BPM}–{FREE_KIT_MAX_BPM} BPM. Drag them into FL Studio,
              Ableton, Logic or any DAW.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li>✓ {FREE_KIT_COUNT} .mid files in one zip</li>
              <li>✓ Royalty-free for released music</li>
              <li>✓ Instant download, and a link by email</li>
            </ul>
          </div>
          <div className="rounded-md border border-line bg-card p-6 shadow-[0_24px_60px_-30px_rgba(31,31,31,0.28)] md:p-8">
            <h2 className="text-2xl">Get the starter kit</h2>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-wide text-[40px] leading-none text-brand">{formatUSD(STARTER_PRICE)}</span>
              <span className="text-sm text-muted">one payment · yours forever</span>
            </p>
            <div className="mt-5">
              <BuyButton product={STARTER_ID} label="Starter kit page" className={BUY_BUTTON_CLASS}>
                Get {FREE_KIT_COUNT} patterns for {formatUSD(STARTER_PRICE)}
              </BuyButton>
            </div>
            <p className="mt-3 text-xs text-muted">Secure checkout with Stripe. No account needed.</p>
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
          <TrackTable tracks={FREE_KIT_PATTERNS.map((pattern) => toCatalogTrack(pattern))} label="Starter kit patterns" />
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-3xl">
          <FaqList faqs={FAQS} title="Starter kit FAQ" />
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
