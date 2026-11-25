"use client";

import { useEffect } from "react";
import {
  ATTRIBUTION_KEY,
  ATTRIBUTION_TTL,
  CTA_KEY,
  CTA_TTL,
  UTM_KEYS,
  cleanAttribution,
  type Attribution,
  type SignupSource,
} from "@/lib/attribution";

/**
 * Remembers ?ref= and utm_* tags from the URL a visitor lands on (last tagged
 * visit wins, for 30 days), so a signup a few pages later still credits the
 * YouTube video that sent them. Rendered once in the root layout.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const keys = ["ref", ...UTM_KEYS];
      if (!keys.some((k) => params.get(k))) return;
      const tags = Object.fromEntries(keys.map((k) => [k, params.get(k) ?? undefined]));
      const saved = cleanAttribution({ ...tags, landingPath: window.location.pathname });
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ ...saved, at: Date.now() }));
    } catch {}
  }, []);
  return null;
}

/** The saved landing tags, plus any on the current URL (those win). */
export function readAttribution(): Attribution {
  let saved: Attribution = {};
  try {
    const raw = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) ?? "null");
    if (raw && Date.now() - raw.at < ATTRIBUTION_TTL) saved = cleanAttribution(raw);
  } catch {}
  try {
    const params = new URLSearchParams(window.location.search);
    const keys = ["ref", ...UTM_KEYS];
    if (keys.some((k) => params.get(k))) {
      return cleanAttribution({
        ...Object.fromEntries(keys.map((k) => [k, params.get(k) ?? undefined])),
        landingPath: window.location.pathname,
      });
    }
  } catch {}
  return saved;
}

/** Called when a free-kit call to action is clicked, so the signup records where. */
export function rememberCta(source: SignupSource) {
  try {
    localStorage.setItem(CTA_KEY, JSON.stringify({ source, at: Date.now() }));
  } catch {}
}

export function readCta(): SignupSource | undefined {
  try {
    const raw = JSON.parse(localStorage.getItem(CTA_KEY) ?? "null");
    if (raw && Date.now() - raw.at < CTA_TTL) return raw.source;
  } catch {}
  return undefined;
}
