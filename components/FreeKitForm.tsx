"use client";

import { useEffect, useState, type FormEvent } from "react";
import { readAttribution, readCta } from "@/components/AttributionCapture";
import type { SignupSource } from "@/lib/attribution";
import { event } from "@/lib/gtag";

type State =
  | { step: "idle" | "sending" }
  | { step: "error"; message: string }
  | { step: "done"; downloadUrl: string | null; emailed: boolean; days: number };

/**
 * Email form for the free MIDI kit. Only the email is asked for; the hidden
 * "website" field is a honeypot that people never see or fill. On success the
 * download link shows right here as well as in the email.
 */
export function FreeKitForm({ source = "free-kit-page", count }: { source?: SignupSource; count: number }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<State>({ step: "idle" });
  const [linkNote, setLinkNote] = useState<string | null>(null);

  // Back from an old or broken email link: say so and offer a fresh one.
  useEffect(() => {
    const link = new URLSearchParams(window.location.search).get("link");
    // One-off read of the URL after hydration.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (link === "expired") setLinkNote("That download link has expired. Enter your email for a fresh one.");
    else if (link === "invalid") setLinkNote("That download link didn't work. Enter your email for a new one.");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.step === "sending") return;
    setState({ step: "sending" });
    const from = readCta() ?? source;
    const attribution = readAttribution();
    try {
      const res = await fetch("/api/free-kit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website, source: from, attribution }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ step: "error", message: body.message ?? "Something went wrong. Try again." });
        event({ action: "free_kit_error", category: "free_kit", label: body.error ?? String(res.status) });
        return;
      }
      setState({ step: "done", downloadUrl: body.downloadUrl ?? null, emailed: !!body.emailed, days: body.days ?? 7 });
      setLinkNote(null);
      event({ action: "free_kit_signup", category: "free_kit", label: attribution.utm_campaign ?? attribution.ref ?? from });
    } catch {
      setState({ step: "error", message: "Network error. Try again." });
    }
  };

  if (state.step === "done") {
    return (
      <div className="rounded-md border border-brand/40 bg-brand/10 p-5" role="status">
        <p className="text-lg font-semibold text-ink">Your kit is ready</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {state.emailed
            ? `We also emailed the link to ${email}. It works for ${state.days} days. If you don't see it, check spam.`
            : `The link works for ${state.days} days.`}
        </p>
        {state.downloadUrl && (
          <a
            href={state.downloadUrl}
            onClick={() => event({ action: "free_kit_download", category: "free_kit", label: "on_page" })}
            className="mt-4 inline-flex h-12 items-center rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
          >
            Download {count} free patterns (.zip)
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      {linkNote && (
        <p className="rounded-md border border-line bg-card px-4 py-3 text-sm text-ink" role="status">
          {linkNote}
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="free-kit-email" className="sr-only">
          Email address
        </label>
        <input
          id="free-kit-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state.step === "error" || undefined}
          aria-describedby="free-kit-note"
          className="h-12 min-w-0 flex-1 rounded-key border border-strong bg-black/20 px-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
        />
        {/* Honeypot: hidden from people and screen readers, filled by bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="free-kit-website">Website</label>
          <input
            id="free-kit-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={state.step === "sending"}
          className="h-12 shrink-0 cursor-pointer rounded-key bg-brand px-6 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {state.step === "sending" ? "Sending…" : "Send me the kit"}
        </button>
      </div>
      {state.step === "error" && (
        <p className="text-sm font-medium text-red-400" role="alert">
          {state.message}
        </p>
      )}
      <p id="free-kit-note" className="text-xs leading-relaxed text-muted">
        Free, no account or password. You&apos;ll also get occasional emails from MidiRoad with new patterns and
        offers. Unsubscribe any time with the link in every email.
      </p>
    </form>
  );
}
