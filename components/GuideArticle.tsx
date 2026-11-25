import Link from "next/link";
import type { ReactNode } from "react";
import { FaqList } from "@/components/FaqList";
import { FreeKitBanner } from "@/components/FreeKitCta";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { GUIDES, guideBySlug, guideJsonLd, guidePath } from "@/lib/guides";

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/**
 * Shell for one guide: breadcrumb, heading, body, FAQ, and links to the other
 * guides, plus the Article/BreadcrumbList/FAQPage JSON-LD. Body copy is plain
 * children; the descendant styles below give it readable spacing.
 */
export function GuideArticle({ slug, children }: { slug: string; children: ReactNode }) {
  const guide = guideBySlug(slug);
  const others = GUIDES.filter((g) => g.slug !== slug);

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={guideJsonLd(guide)} />
      <SiteNav />
      <article className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden> / </span>
            <Link href="/guides" className="hover:text-ink">
              Guides
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">{guide.title}</span>
          </nav>
          <Eyebrow className="mb-3">Guide</Eyebrow>
          <h1 className="text-3xl leading-tight md:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{guide.description}</p>
          <p className="mt-3 text-sm text-muted">
            By MidiRoad · Updated <time dateTime={guide.dateModified}>{dateLabel(guide.dateModified)}</time>
          </p>

          <div
            className="mt-10 text-[16px] leading-relaxed text-foreground/90
              [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand
              [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:leading-tight md:[&_h2]:text-[30px]
              [&_h3]:mt-8 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-semibold
              [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4
              [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          >
            {children}
          </div>

          <FreeKitBanner source="guide" count={FREE_KIT_COUNT} className="mt-14" />

          <FaqList faqs={guide.faqs} title="Frequently asked questions" />

          <aside className="mt-14 rounded-md border border-line bg-card p-6">
            <h2 className="text-xl">More guides</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {others.map((g) => (
                <li key={g.slug}>
                  <Link href={guidePath(g)} className="font-medium text-ink underline underline-offset-4 hover:text-brand">
                    {g.title}
                  </Link>
                  <span className="text-muted"> · {g.summary}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
