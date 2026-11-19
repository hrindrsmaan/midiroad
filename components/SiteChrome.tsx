import Link from "next/link";
import { AddToCartButton, CartButton } from "@/components/cart/CartButtons";
import { Logo } from "@/components/Logo";
import { formatUSD } from "@/lib/pricing";

const NAV_LINKS = [
  { href: "/#kits", label: "MIDI Packs" },
  { href: "/#midi-kits", label: "Listen" },
  { href: "/#generator", label: "Beat Maker" },
  { href: "/#faq", label: "FAQ" },
];

/** Sticky top bar: logo, section links and the cart. */
export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center" aria-label="MidiRoad home">
          <Logo />
        </Link>
        <div className="flex items-center gap-5 md:gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm font-medium text-muted transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <CartButton />
        </div>
      </div>
    </nav>
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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-4">
        <p className="shrink-0 leading-tight">
          {originalPrice !== undefined && (
            <span className="block text-xs text-muted line-through">{formatUSD(originalPrice)}</span>
          )}
          <span className="text-lg font-bold text-brand">{formatUSD(price)}</span>
        </p>
        <AddToCartButton
          product={product}
          className="h-12 flex-1 rounded-full bg-brand text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-hover"
        />
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Drag-and-drop MIDI drum kits and trap one-shots for producers.
          </p>
        </div>
        <div className="flex gap-16 text-sm">
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
            <li className="text-white/40">Support</li>
            <li>
              <a href="mailto:support@midiroad.com" className="text-white/60 transition-colors hover:text-white">
                support@midiroad.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-white/40">
          © {new Date().getFullYear()} MidiRoad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
