"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The menu panel's id. There is one menu per page (it lives in SiteNav), so a
 * fixed id is safe, and unlike useId it is the same on the server and the client.
 */
const PANEL_ID = "mobile-nav-panel";

/**
 * Phone navigation. Below `md` the inline links are hidden, so without this
 * the header had no route to the kits or the tools at all.
 */
const LINKS: { href: string; label: string; note: string }[] = [
  { href: "/kits", label: "MIDI kits", note: "Six kits and the bundle" },
  { href: "/midi", label: "Pattern library", note: "210 patterns, all playable" },
  { href: "/beat-maker", label: "Beat maker", note: "Free, in the browser" },
  { href: "/chord-maker", label: "Chord maker", note: "Progressions to MIDI" },
  { href: "/guides", label: "Guides", note: "Into FL Studio, Ableton, Logic" },
  { href: "/pricing", label: "Pricing", note: "Kits once, or credits monthly" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5" aria-hidden>
      {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Any navigation closes the panel.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-foreground/[0.04]"
      >
        <MenuIcon open={open} />
      </button>

      {open && (
        <>
          {/* Tapping outside closes the panel. Keyboard users have Escape and the close button. */}
          <div
            role="presentation"
            onClick={() => setOpen(false)}
            className="absolute left-0 right-0 top-full h-[calc(100dvh-4rem)] bg-foreground/25"
          />
          <div
            id={PANEL_ID}
            className="absolute left-0 right-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-background shadow-[0_18px_30px_-24px_rgba(31,31,31,0.5)]"
          >
            <ul className="mx-auto max-w-6xl divide-y divide-line px-4">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex min-h-14 flex-col justify-center py-3">
                    <span className="text-[15px] font-semibold leading-tight">{link.label}</span>
                    <span className="mt-0.5 text-xs text-muted">{link.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/compare" className="text-sm font-medium text-muted hover:text-ink">
                Compare kits
              </Link>
              <Link href="/login" className="text-sm font-medium text-muted hover:text-ink">
                Sign in
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
