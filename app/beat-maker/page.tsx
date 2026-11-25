import type { Metadata } from "next";
import { MidiGenerator } from "@/components/MidiGenerator";
import { ProductDetail } from "@/components/ProductDetail";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { FreeKitBanner } from "@/components/FreeKitCta";
import { JsonLd } from "@/components/JsonLd";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { googleConfigured } from "@/lib/auth";
import { beatMakerJsonLd } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const title = "Free Trap Beat Maker – Export MIDI to Your DAW";
const description =
  "Make a trap drum beat in one click: hi-hats, snare, kick and 808. Change tempo, key and sounds, mute parts, and export the MIDI to FL Studio, Ableton, Logic or any DAW.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/beat-maker" });

export default function BeatMakerPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <JsonLd data={beatMakerJsonLd()} />
      <SiteNav />
      <MidiGenerator google={googleConfigured} />
      <div className="bg-graphite px-5 pb-14">
        <FreeKitBanner source="beat-maker" count={FREE_KIT_COUNT} className="mx-auto max-w-6xl" />
      </div>
      {/* Hand-made patterns for when a generated beat isn't enough. */}
      <ProductDetail variant="upsell" />
      <SiteFooter />
    </main>
  );
}
