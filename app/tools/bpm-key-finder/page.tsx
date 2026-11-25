import type { Metadata } from "next";
import { BpmKeyFinder } from "@/components/BpmKeyFinder";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { BPM_KEY_DESCRIPTION, BPM_KEY_FAQS, BPM_KEY_PATH, BPM_KEY_TITLE } from "@/lib/bpm-key/content";
import { pageMetadata } from "@/lib/seo";
import { bpmKeyFinderJsonLd, faqJsonLd } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: BPM_KEY_TITLE,
  description: BPM_KEY_DESCRIPTION,
  path: BPM_KEY_PATH,
});

export default function BpmKeyFinderPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={[...bpmKeyFinderJsonLd(), faqJsonLd(BPM_KEY_FAQS)]} />
      <SiteNav />
      <section className="px-5 pb-16 pt-14 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow className="mb-4">Free tool · Nothing is uploaded</Eyebrow>
          <h1 className="max-w-4xl text-balance text-[38px] leading-[0.98] tracking-[-0.02em] md:text-[60px]">
            Find the BPM and key of any song
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Drop a song, a loop, or a rough export. You get the tempo, the musical key, and the Camelot code, worked
            out in your browser so the audio never leaves your machine.
          </p>
          <BpmKeyFinder />
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="bg-canvas px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow className="mb-3">How it works</Eyebrow>
          <h2 id="how-it-works" className="max-w-3xl text-[28px] leading-[1.05] md:text-[40px]">
            Tempo from the drums, key from the notes
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            The page decodes the file with the Web Audio API, then estimates the tempo from the spacing of hits and
            the key from which pitches show up. Heavy analysis code loads only after you choose a file, so the rest
            of MidiRoad stays light.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            <li className="rounded-md border border-line bg-card p-5">
              <p className="font-wide text-sm text-brand">01</p>
              <h3 className="mt-3 text-lg">Drop the audio</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                MP3, WAV, FLAC, OGG, or M4A, up to 8 minutes. A full mix or a melodic loop both work.
              </p>
            </li>
            <li className="rounded-md border border-line bg-card p-5">
              <p className="font-wide text-sm text-brand">02</p>
              <h3 className="mt-3 text-lg">Read BPM and key</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Tempo in BPM, key as &ldquo;A minor&rdquo; or &ldquo;C major&rdquo;, plus the Camelot code DJs use to mix.
              </p>
            </li>
            <li className="rounded-md border border-line bg-card p-5">
              <p className="font-wide text-sm text-brand">03</p>
              <h3 className="mt-3 text-lg">Match a drum kit</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                The result links to MidiRoad patterns in that tempo, and to a kit that fits the pocket.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-3xl">
          <FaqList faqs={BPM_KEY_FAQS} title="BPM and key finder FAQ" />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
