"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Catches anything a page throws in production. Keeps the visitor on the
 * site with a retry and a way out, instead of the framework's error screen.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-20">
      <div className="w-full max-w-md">
        <p className="flex items-center gap-2 text-sm font-semibold text-muted">
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-destructive" />
          Something went wrong
        </p>
        <h1 className="mt-3 text-[32px] leading-[1.05] tracking-[-0.03em] md:text-[40px]">
          That page didn’t load
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Nothing was charged and nothing was lost. Try again, or head back to the kits.
          {error.digest ? <span className="mt-2 block text-xs text-muted">Reference {error.digest}</span> : null}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 cursor-pointer items-center rounded-key bg-brand px-5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-key border border-strong px-5 text-sm font-semibold transition-colors hover:bg-foreground/[0.06]"
          >
            Back to MidiRoad
          </Link>
        </div>
      </div>
    </main>
  );
}
