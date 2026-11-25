/**
 * Where a free-kit signup came from. Shared by the browser (which records
 * ?ref= and utm_* tags on landing, see components/AttributionCapture.tsx) and
 * the signup route (which cleans them before storing).
 *
 * YouTube links: https://midiroad.com/free-midi-kit?ref=youtube&utm_campaign=<video id>
 */

/** The page or button a signup started from. */
export const SIGNUP_SOURCES = [
  "free-kit-page",
  "header",
  "home",
  "beat-maker",
  "pattern-page",
  "genre-page",
  "guide",
  "shared-beat",
  "compare",
] as const;

export type SignupSource = (typeof SIGNUP_SOURCES)[number];

export const isSignupSource = (v: unknown): v is SignupSource =>
  typeof v === "string" && (SIGNUP_SOURCES as readonly string[]).includes(v);

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Attribution = {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landingPath?: string;
};

/** Trimmed, printable, at most `max` characters; anything else becomes undefined. */
export function cleanTag(value: unknown, max = 120) {
  if (typeof value !== "string") return undefined;
  const v = value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
  return v || undefined;
}

export function cleanAttribution(raw: unknown): Attribution {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Attribution = { ref: cleanTag(r.ref, 60)?.toLowerCase() };
  for (const key of UTM_KEYS) out[key] = cleanTag(r[key]);
  const path = cleanTag(r.landingPath, 300);
  out.landingPath = path?.startsWith("/") ? path : undefined;
  return out;
}

/** localStorage keys (browser only). */
export const ATTRIBUTION_KEY = "midiroad:attribution";
export const CTA_KEY = "midiroad:cta";
/** A landing tag counts for 30 days; a clicked call to action for an hour. */
export const ATTRIBUTION_TTL = 30 * 24 * 60 * 60 * 1000;
export const CTA_TTL = 60 * 60 * 1000;
