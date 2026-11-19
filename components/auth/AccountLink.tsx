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
    <div className="flex items-center gap-4">
      <Link
        href={credits > 0 ? "/account" : "/pricing"}
        title={credits > 0 ? "Your credits: 1 credit = 1 MIDI file" : "Out of credits: get a plan"}
        className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold tabular-nums transition-colors ${
          credits > 0 ? "border-line text-ink hover:bg-canvas" : "border-brand/40 bg-brand/5 text-brand hover:bg-brand/10"
        }`}
      >
        <CreditIcon />
        {credits.toLocaleString()}
        <span className="hidden font-medium text-muted sm:inline">credits</span>
      </Link>
      <Link href="/account" className="text-sm font-medium text-muted transition-colors hover:text-ink">
        Account
      </Link>
    </div>
  );
}

function CreditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
