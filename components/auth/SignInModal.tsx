"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SIGNUP_CREDITS } from "@/lib/plans";

export type DownloadGate = "sign_in" | "no_credits";

/**
 * Shown when a download needs an account (sign up, get free credits) or more
 * credits. `callbackURL` is where sign-in lands, so the download can resume.
 */
export function SignInModal({
  reason,
  fileName,
  google,
  callbackURL,
  onClose,
}: {
  reason: DownloadGate | null;
  fileName?: string;
  google: boolean;
  callbackURL: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = reason !== null;

  // Escape closes; lock page scroll and move focus into the panel while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center text-left text-base text-ink sm:items-center sm:p-5">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
        tabIndex={-1}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl outline-none sm:max-w-md sm:rounded-md sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-10 w-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>

        {reason === "sign_in" ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-key bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
              </svg>
              {SIGNUP_CREDITS} free credits
            </span>
            <h2 id="signin-modal-title" className="mt-4 pr-8 text-2xl leading-tight">
              Sign in to download
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Create a free account and get <strong className="text-ink">{SIGNUP_CREDITS} credits</strong>, enough for{" "}
              {SIGNUP_CREDITS} MIDI files. 1 credit = 1 file.
              {fileName && (
                <>
                  {" "}
                  <span className="text-ink">{fileName}</span> downloads as soon as you&apos;re in.
                </>
              )}
            </p>
            <div className="mt-6">
              <SignInForm google={google} callbackURL={callbackURL} />
            </div>
            <p className="mt-4 text-center text-xs text-muted">No password needed. Already have an account? Same buttons.</p>
          </>
        ) : (
          <>
            <h2 id="signin-modal-title" className="pr-8 text-2xl leading-tight">
              You&apos;re out of credits
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Each MIDI file uses 1 credit. Get a plan for more credits every month, or get the bundle for every kit
              at once.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/pricing"
                className="flex h-12 items-center justify-center rounded-key bg-brand text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
              >
                See plans
              </Link>
              <Link
                href="/#main-cta"
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-key border border-line text-sm font-semibold transition-colors hover:bg-white/5"
              >
                Get the bundle
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
