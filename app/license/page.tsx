import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";

/** The same text that ships inside every download, so the two never differ. */
const LICENSE_PATH = path.join(process.cwd(), "content/license.txt");

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "Royalty-Free MIDI License | MidiRoad",
  description:
    "The MidiRoad license in plain English: use the MIDI patterns and drum one-shots in your own music, release them commercially, keep every royalty. You can't resell the raw files.",
  path: "/license",
});

/** Splits the plain-text license into blocks, keeping the heading structure. */
function blocks(text: string) {
  return text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
}

export default async function LicensePage() {
  const text = await readFile(LICENSE_PATH, "utf8");

  return (
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Eyebrow className="mb-3">License</Eyebrow>
          <h1 className="text-[34px] leading-[1] tracking-[-0.025em] md:text-[48px]">
            Royalty-free, in plain English
          </h1>
          <p className="mt-5 text-muted">
            This is the exact license that ships inside every download. If you bought a pack, the copy in your zip is the
            one that applies.
          </p>

          <div className="mt-10 space-y-6">
            {blocks(text).map((block) => {
              const heading = block.match(/^(.+)\n-+$/);
              if (heading) {
                return (
                  <h2 key={heading[1]} className="text-xl font-semibold tracking-[-0.01em] md:text-2xl">
                    {heading[1]}
                  </h2>
                );
              }
              if (block.startsWith("MIDIROAD LICENSE")) {
                return (
                  <p key="title" className="text-sm font-semibold tracking-[0.2em] text-muted">
                    {block}
                  </p>
                );
              }
              if (block.includes("\n- ")) {
                const [lead, ...items] = block.split("\n");
                return (
                  <div key={lead}>
                    <p>{lead}</p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted">
                      {items.map((item) => (
                        <li key={item}>{item.replace(/^-\s*/, "")}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return (
                <p key={block.slice(0, 24)} className="leading-relaxed text-muted">
                  {block}
                </p>
              );
            })}
          </div>

          <div className="mt-12 rounded-md border border-line bg-card p-6">
            <h2 className="text-lg font-semibold">Questions, or need a refund?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Email{" "}
              <a href="mailto:support@inbox.midiroad.com" className="font-semibold text-ink underline underline-offset-4">
                support@inbox.midiroad.com
              </a>
              . We reply to every message, and a refund is available within 30 days of purchase.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
