import Link from "next/link";
import type { ReactNode } from "react";
import { FaqList } from "@/components/FaqList";
import { FreeKitBanner, FreeKitLink } from "@/components/FreeKitCta";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import type { FaqItem } from "@/lib/faq";
import type { SourceLink } from "@/lib/buyer-intent";
import { absoluteUrl, faqJsonLd } from "@/lib/site";

export const buyerProse =
  "max-w-3xl text-[16px] leading-relaxed text-foreground/90 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:leading-tight md:[&_h2]:text-[30px] [&_h3]:mt-8 [&_h3]:text-lg [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6";

export type Crumb = { name: string; path: string };

export type RelatedLink = { href: string; title: string; text: string };

export function BuyerCtas({ label }: { label: string }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
      <TrackedLink
        href="/kits"
        track={{ action: "click_kits", category: "buyer", label }}
        className="inline-flex h-12 items-center rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
      >
        Shop MIDI drum kits
      </TrackedLink>
      <FreeKitLink
        source="compare"
        className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-brand"
      >
        Get the free kit
      </FreeKitLink>
    </div>
  );
}

export function ChooseColumns({
  themLabel,
  them,
  us,
}: {
  themLabel: string;
  them: string[];
  us: string[];
}) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <section className="rounded-md border border-line bg-card p-5">
        <h3 className="text-base">Choose {themLabel} if</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          {them.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-md border border-brand/40 bg-card p-5">
        <h3 className="text-base">Choose MidiRoad if</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          {us.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function BuyerShell({
  eyebrow,
  title,
  lede,
  crumbs,
  faqs,
  disclaimer,
  sources,
  related,
  ctaLabel,
  extraJsonLd,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  crumbs: Crumb[];
  faqs: FaqItem[];
  disclaimer: string;
  sources?: SourceLink[];
  related: RelatedLink[];
  ctaLabel: string;
  extraJsonLd?: unknown[];
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={[breadcrumbLd(crumbs), faqJsonLd(faqs), ...(extraJsonLd ?? [])]} />
      <SiteNav />
      <article className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <span key={crumb.path}>
                  {index > 0 && <span aria-hidden> / </span>}
                  {last ? (
                    <span className="text-ink">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-ink">
                      {crumb.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <h1 className="max-w-3xl text-3xl leading-[1.05] md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-muted">{lede}</p>
          <BuyerCtas label={ctaLabel} />
          {children}
          <FreeKitBanner source="compare" count={FREE_KIT_COUNT} className="mt-14 max-w-3xl" />
          <div className="max-w-3xl">
            <FaqList faqs={faqs} title="Frequently asked questions" />
          </div>
          {sources && sources.length > 0 && (
            <section className="mt-12 max-w-3xl" aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-2xl md:text-[30px]">
                Sources
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed">
                {sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      rel="noopener noreferrer"
                      className="font-medium text-ink underline underline-offset-4 hover:text-brand"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">{disclaimer}</p>
          <aside className="mt-14 max-w-3xl rounded-md border border-line bg-card p-6">
            <h2 className="text-xl">Keep reading</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-medium text-ink underline underline-offset-4 hover:text-brand">
                    {link.title}
                  </Link>
                  <span className="text-muted"> · {link.text}</span>
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
