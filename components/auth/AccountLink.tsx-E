"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { CREDITS_EVENT } from "@/lib/paid-download";

/**
 * Top-right of the nav: "Sign in", or the credit balance plus "Account".
 * Read client-side so pages stay static; downloads push the new balance
 * through CREDITS_EVENT so it updates without a reload.
 */
export function AccountLink() {
  const { data, isPending } = authClient.useSession();
  const [live, setLive] = useState<number | null>(null);

  useEffect(() => {
    const onCredits = (e: Event) => setLive((e as CustomEvent<number>).detail);
    window.addEventListener(CREDITS_EVENT, onCredits);
    return () => window.removeEventListener(CREDITS_EVENT, onCredits);
  }, []);

  if (isPending) return <span className="w-14" aria-hidden />;
  if (!data) {
    return (
      <Link href="/login" className="text-sm font-medium text-muted transition-colors hover:text-ink">
        Sign in
      </Link>
    );
  }

  const credits = live ?? (data.user as { credits?: number }).credits ?? 0;
  return (
    <div className="flex items-center gap-3.5 md:gap-5">
      <Link
        href={credits > 0 ? "/account" : "/pricing"}
        title={credits > 0 ? "Your credits: 1 credit = 1 MIDI file" : "Out of credits: get a plan"}
        className={`flex h-8 items-center gap-1.5 rounded-key border px-3 text-xs font-semibold tabular-nums transition-colors ${
          credits > 0 ? "border-line text-ink hover:bg-white/5" : "border-brand/40 bg-brand/5 text-brand hover:bg-brand/10"
        }`}
      >
        <CreditIcon />
        {credits.toLocaleString()}
        <span className="hidden font-medium text-muted sm:inline">credits</span>
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-muted transition-colors hover:text-ink">
        Plans
      </Link>
      <Link
        href="/account"
        aria-label="Account"
        className="text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <span className="hidden sm:inline">Account</span>
        <AccountIcon />
      </Link>
    </div>
  );
}

/** Stands in for the "Account" label on phones, where the nav is tight. */
function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className="sm:hidden">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CreditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
