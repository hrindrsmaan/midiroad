import Link from "next/link";
import { AccountLink } from "@/components/auth/AccountLink";
import { AddToCartButton, CartButton } from "@/components/cart/CartButtons";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { TrackedLink } from "@/components/TrackedLink";
import { BPM_KEY_PATH } from "@/lib/bpm-key/content";
import { formatUSD } from "@/lib/pricing";
import { BlackFridayBar } from "@/components/BlackFriday";
import { GENRES, genrePath } from "@/lib/patterns";
import { YOUTUBE_URL } from "@/lib/site";

const NAV_LINKS = [
  { href: "/kits", label: "Kits" },
  { href: "/#kits", label: "MIDI Packs" },
  { href: "/midi", label: "Patterns" },
  { href: "/beat-maker", label: "Beat Maker" },
  { href: "/chord-maker", label: "Chord Maker" },
  { href: BPM_KEY_PATH, label: "BPM & Key Finder" },
  { href: "/guides", label: "Guides" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

/** Sticky top bar, kept to the essentials: logo, chord maker, account and cart. Every other page is linked from the footer. */
export function SiteNav({ tone = "paper" }: { tone?: "paper" | "night" } = {}) {
  const night = tone === "night";
  return (
    <>
    <BlackFridayBar />
    <nav className={`sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur ${night ? "tone-night" : ""}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="MidiRoad home">
          {/* A notch smaller on phones, so the links and cart fit beside it. */}
          <Logo
            inverted={night}
            markClassName="h-8 w-8 md:h-9 md:w-9"
            className="gap-2 md:gap-2.5 [&>span:last-child]:text-lg md:[&>span:last-child]:text-[21px]"
          />
        </Link>
        <div className="flex items-center gap-3.5 whitespace-nowrap md:gap-7">
          <TrackedLink
            href="/kits"
            track={{ action: "click_kits", category: "navigation", label: "header" }}
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink md:inline"
          >
            Kits
          </TrackedLink>
          <TrackedLink
            href="/midi"
            track={{ action: "click_patterns", category: "navigation", label: "header" }}
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink md:inline"
          >
            Patterns
          </TrackedLink>
          <TrackedLink
            href="/beat-maker"
            track={{ action: "click_beat_maker", category: "navigation", label: "header" }}
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink lg:inline"
          >
            Beat maker
          </TrackedLink>
          <TrackedLink
            href="/chord-maker"
            track={{ action: "click_chord_maker", category: "navigation", label: "header" }}
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink md:inline"
          >
            Chord Maker
          </TrackedLink>
          <MobileNav />
          <AccountLink />
          <CartButton />
        </div>
      </div>
    </nav>
    </>
  );
}

/** Sticky bar on mobile, so adding to the cart is always one tap away. */
export function StickyBuyBar({
  product,
  price,
  originalPrice,
}: {
  product: string;
  price: number;
  originalPrice?: number;
}) {
  return (
    <div className="sticky-buy fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-4">
        <p className="shrink-0 leading-tight">
          {originalPrice !== undefined && (
            <span className="block text-xs text-muted line-through">{formatUSD(originalPrice)}</span>
          )}
          <span className="text-lg font-bold text-brand">{formatUSD(price)}</span>
        </p>
        <AddToCartButton
          product={product}
          className="h-12 flex-1 rounded-key bg-brand text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
        />
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Drag-and-drop MIDI drum kits and trap one-shots for producers.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-16 gap-y-8 text-sm">
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-3">
            <li className="text-muted">Styles</li>
            {GENRES.map((genre) => (
              <li key={genre.slug}>
                <Link href={genrePath(genre)} className="text-muted transition-colors hover:text-foreground">
                  {genre.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/midi/bpm" className="text-muted transition-colors hover:text-foreground">
                By tempo
              </Link>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="text-muted">Support</li>
            <li>
              <a href="mailto:support@inbox.midiroad.com" className="text-muted transition-colors hover:text-foreground">
                support@inbox.midiroad.com
              </a>
            </li>
            <li>
              <Link href="/license" className="text-muted transition-colors hover:text-foreground">
                License
              </Link>
            </li>
            <li>
              <a href={YOUTUBE_URL} rel="me noopener" className="text-muted transition-colors hover:text-foreground">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted">
          © {new Date().getFullYear()} MidiRoad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
