import type { Metadata } from "next";
import { ChordMaker } from "@/components/ChordMaker";
import { ChordPackCompare } from "@/components/ChordPackCompare";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { googleConfigured } from "@/lib/auth";
import { chordMakerJsonLd } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const title = "Free Chord Progression Maker – Export MIDI to Your DAW";
const description =
  "Make a chord progression in any key: pick a preset or shuffle, edit chords on a piano roll, change rhythm and tempo, and download the MIDI for FL Studio, Ableton, Logic or any DAW.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/chord-maker" });

export default function ChordMakerPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <JsonLd data={chordMakerJsonLd()} />
      <SiteNav />
      <ChordMaker google={googleConfigured} />
      <ChordPackCompare />
      <SiteFooter />
    </main>
  );
}
