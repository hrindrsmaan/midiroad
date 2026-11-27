import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const NEXT_STOPS = [
  {
    href: "/kits",
    title: "MIDI kits",
    text: "Six drum kits and The Complete Vault, every pattern playable before you buy.",
  },
  {
    href: "/midi",
    title: "Pattern library",
    text: "All 210 patterns, filtered by style, tempo and drum part.",
  },
  {
    href: "/beat-maker",
    title: "Beat maker",
    text: "Generate a trap beat in the browser and download the MIDI.",
  },
  {
    href: "/pricing",
    title: "Pricing",
    text: "One-time kit prices, the bundle, and monthly credits.",
  },
];

/** Any URL that no longer exists lands here, inside the site's own chrome. */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Eyebrow className="mb-3">Page not found</Eyebrow>
          <h1 className="max-w-2xl text-[34px] leading-[1.02] tracking-[-0.03em] md:text-[56px]">
            This page isn’t here
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
            The link may be old, or the page may have moved. Everything the store has is one tap away below — and every
            pattern on the site plays before you pay.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {NEXT_STOPS.map((stop) => (
              <li key={stop.href}>
                <Link
                  href={stop.href}
                  className="group flex h-full flex-col rounded-md border border-line bg-card p-5 transition-colors hover:border-strong"
                >
                  <span className="text-base font-bold leading-tight group-hover:text-brand">{stop.title}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-muted">{stop.text}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted">
            Looking for something specific?{" "}
            <a href="mailto:support@inbox.midiroad.com" className="font-semibold text-ink underline underline-offset-4">
              support@inbox.midiroad.com
            </a>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
