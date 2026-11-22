import type { Metadata } from "next";
import { MidiGenerator } from "@/components/MidiGenerator";
import { ProductDetail } from "@/components/ProductDetail";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { googleConfigured } from "@/lib/auth";
import { beatMakerJsonLd } from "@/lib/site";

const title = "Free Trap Beat Maker – Export MIDI to Your DAW";
const description =
  "Make a trap drum beat in one click: hi-hats, snare, kick and 808. Change tempo, key and sounds, mute parts, and export the MIDI to FL Studio, Ableton, Logic or any DAW.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/beat-maker" },
  // Pages that set their own openGraph lose the root share image, so name it.
  openGraph: { title, description, url: "/beat-maker", type: "website", siteName: "MidiRoad", images: "/opengraph-image" },
  twitter: { card: "summary_large_image", title, description, images: "/opengraph-image" },
};

export default function BeatMakerPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <JsonLd data={beatMakerJsonLd()} />
      <SiteNav />
      <MidiGenerator google={googleConfigured} />
      {/* Hand-made patterns for when a generated beat isn't enough. */}
      <ProductDetail variant="upsell" />
      <SiteFooter />
    </main>
  );
}
