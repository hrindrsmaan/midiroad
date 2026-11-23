import type { Metadata } from "next";
import Link from "next/link";
import { FreeKitBanner } from "@/components/FreeKitCta";
import { JsonLd } from "@/components/JsonLd";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { GUIDES, guidePath } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL, WEBSITE_ID, absoluteUrl } from "@/lib/site";

const title = "MIDI Drum Guides for FL Studio, Ableton and Trap";
const description =
  "Free guides to MIDI drum patterns: what they are, how to use them in FL Studio and Ableton Live, how to program trap drums, and what royalty-free MIDI lets you do.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/guides" });

export default function GuidesIndexPage() {
  const url = absoluteUrl("/guides");
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            isPartOf: { "@id": WEBSITE_ID },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: GUIDES.length,
              itemListElement: GUIDES.map((guide, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: guide.title,
                url: absoluteUrl(guidePath(guide)),
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Guides", item: url },
            ],
          },
        ]}
      />
      <SiteNav />
      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Eyebrow className="mb-3">Guides</Eyebrow>
          <h1 className="text-3xl leading-tight md:text-5xl">MIDI drum guides</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
            Practical walkthroughs for getting MIDI drum patterns into your DAW and making them groove. Every
            guide links to patterns you can preview in the browser.
          </p>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link href={guidePath(guide)} className="group block py-6">
                  <h2 className="text-xl leading-snug group-hover:text-brand md:text-2xl">{guide.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{guide.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <FreeKitBanner source="guide" count={FREE_KIT_COUNT} className="mt-10" />
          <p className="mt-10 text-sm text-muted">
            Ready to try one?{" "}
            <Link href="/midi" className="font-semibold text-ink underline underline-offset-4">
              Browse MIDI patterns
            </Link>{" "}
            or open the{" "}
            <Link href="/beat-maker" className="font-semibold text-ink underline underline-offset-4">
              free trap beat maker
            </Link>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
