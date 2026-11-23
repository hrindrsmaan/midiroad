import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * HMAC signing for links sent by email (free kit download, unsubscribe) and
 * for hashing IPs in rate-limit keys. The key is LINK_SIGNING_SECRET; outside
 * production a fixed development key is used so the flow runs locally.
 * Rotating the secret invalidates every link already sent.
 */
function secret() {
  const value = process.env.LINK_SIGNING_SECRET;
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV !== "production") return "midiroad-dev-only-link-signing-secret-000";
  throw new Error("LINK_SIGNING_SECRET is not set (32+ characters)");
}

const sign = (purpose: string, payload: string) =>
  createHmac("sha256", secret()).update(`${purpose}:${payload}`).digest("base64url");

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const FREE_KIT_LINK_DAYS = 7;

/** `<subscriber id>.<expiry, unix seconds>.<signature>` */
export function downloadToken(subscriberId: string, now = Date.now()) {
  const exp = Math.floor(now / 1000) + FREE_KIT_LINK_DAYS * 24 * 60 * 60;
  const payload = `${subscriberId}.${exp}`;
  return `${payload}.${sign("free-kit", payload)}`;
}

export type TokenCheck = { ok: true; subscriberId: string } | { ok: false; reason: "invalid" | "expired" };

export function checkDownloadToken(token: string | null, now = Date.now()): TokenCheck {
  const parts = (token ?? "").split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const [id, exp, sig] = parts;
  if (!/^[0-9A-Za-z]{1,40}$/.test(id) || !/^\d{1,12}$/.test(exp)) return { ok: false, reason: "invalid" };
  if (!same(sig, sign("free-kit", `${id}.${exp}`))) return { ok: false, reason: "invalid" };
  if (Number(exp) * 1000 < now) return { ok: false, reason: "expired" };
  return { ok: true, subscriberId: id };
}

/** Unsubscribe links never expire: `<subscriber id>.<signature>`. */
export const unsubscribeToken = (subscriberId: string) => `${subscriberId}.${sign("unsubscribe", subscriberId)}`;

export function checkUnsubscribeToken(token: string | null): string | null {
  const [id, sig, extra] = (token ?? "").split(".");
  if (extra !== undefined || !id || !sig || !/^[0-9A-Za-z]{1,40}$/.test(id)) return null;
  return same(sig, sign("unsubscribe", id)) ? id : null;
}

/** A keyed hash of the client IP: rate limits work without storing addresses. */
export const hashIp = (ip: string) => createHash("sha256").update(`${secret()}|ip|${ip}`).digest("base64url").slice(0, 22);
