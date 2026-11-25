import Link from "next/link";
import { AccountLink } from "@/components/auth/AccountLink";
import { AddToCartButton, CartButton } from "@/components/cart/CartButtons";
import { FreeKitLink } from "@/components/FreeKitCta";
import { Logo } from "@/components/Logo";
import { TrackedLink } from "@/components/TrackedLink";
import { formatUSD } from "@/lib/pricing";
import { BlackFridayBar } from "@/components/BlackFriday";
import { GENRES, genrePath } from "@/lib/patterns";
import { YOUTUBE_URL } from "@/lib/site";

const NAV_LINKS = [
  { href: "/#kits", label: "MIDI Packs" },
  { href: "/#midi-kits", label: "Listen" },
  { href: "/midi", label: "Patterns" },
  { href: "/beat-maker", label: "Beat Maker" },
  { href: "/chord-maker", label: "Chord Maker" },
  { href: "/free-midi-kit", label: "Free MIDI Kit" },
  { href: "/guides", label: "Guides" },
  { href: "/library", label: "Library" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

/** Sticky top bar, kept to the essentials: logo, chord maker, account and cart. Every other page is linked from the footer. */
export function SiteNav() {
  return (
    <>
    <BlackFridayBar />
    <nav className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="MidiRoad home">
          {/* A notch smaller on phones, so the links and cart fit beside it. */}
          <Logo
            markClassName="h-8 w-8 md:h-9 md:w-9"
            className="gap-2 md:gap-2.5 [&>span:last-child]:text-lg md:[&>span:last-child]:text-[21px]"
          />
        </Link>
        <div className="flex items-center gap-3.5 whitespace-nowrap md:gap-7">
          <TrackedLink
            href="/midi"
            track={{ action: "click_patterns", category: "navigation", label: "header" }}
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink min-[480px]:inline"
          >
            Patterns
          </TrackedLink>
          <TrackedLink
            href="/chord-maker"
            track={{ action: "click_chord_maker", category: "navigation", label: "header" }}
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink min-[420px]:inline"
          >
            Chord Maker
          </TrackedLink>
          <FreeKitLink
            source="header"
            className="inline-flex h-8 items-center rounded-key border border-brand/50 bg-brand/10 px-2.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20 md:h-9 md:px-3.5 md:text-sm"
          >
            <span className="md:hidden">Free kit</span>
            <span className="hidden md:inline">Free MIDI kit</span>
          </FreeKitLink>
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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background/95 px-4 py-3 backdrop-blur md:hidden">
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
    <footer className="border-t border-line bg-[#0b1222] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Drag-and-drop MIDI drum kits and trap one-shots for producers.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-16 gap-y-8 text-sm">
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/60 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-3">
            <li className="text-muted">Styles</li>
            {GENRES.map((genre) => (
              <li key={genre.slug}>
                <Link href={genrePath(genre)} className="text-white/60 transition-colors hover:text-white">
                  {genre.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/midi/bpm" className="text-white/60 transition-colors hover:text-white">
                By tempo
              </Link>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="text-muted">Support</li>
            <li>
              <a href="mailto:support@inbox.midiroad.com" className="text-white/60 transition-colors hover:text-white">
                support@inbox.midiroad.com
              </a>
            </li>
            <li>
              <a href={YOUTUBE_URL} rel="me noopener" className="text-white/60 transition-colors hover:text-white">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted">
          © {new Date().getFullYear()} MidiRoad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
