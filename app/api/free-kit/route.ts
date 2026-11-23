import { sql } from "drizzle-orm";
import { cleanAttribution, isSignupSource } from "@/lib/attribution";
import { db } from "@/lib/db";
import { subscriber } from "@/lib/db/schema";
import { sendFreeKitEmail } from "@/lib/email";
import { FREE_KIT_COUNT, FREE_KIT_NAME } from "@/lib/free-kit";
import { randomId } from "@/lib/ids";
import logger from "@/lib/logger";
import { ipKey, rateLimit, tooMany } from "@/lib/rate-limit";
import { FREE_KIT_LINK_DAYS, downloadToken, hashIp, unsubscribeToken } from "@/lib/signing";

export const dynamic = "force-dynamic";

/** Deliberately loose: one @, a dot in the domain, no spaces. The email itself is the real check. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Free MIDI kit signup: stores the email with where it came from, emails a
 * download link that expires in 7 days, and returns the same link so it shows
 * on the page right away (in case the email lands in spam).
 *
 * Abuse guards: a hidden honeypot field, 5 signups per IP per 10 minutes, and
 * 3 per email address per day.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "invalid", message: "Invalid request." }, { status: 400 });

  // Bots fill every field. Look successful, do nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true, downloadUrl: null, emailed: false });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL.test(email)) {
    return Response.json({ error: "invalid_email", message: "Enter a valid email address." }, { status: 400 });
  }

  const perIp = await rateLimit(ipKey("free-kit", req), 5, 10 * 60);
  if (!perIp.ok) return tooMany(perIp.retryAfter);
  const perEmail = await rateLimit(`free-kit:email:${hashIp(`email:${email}`)}`, 3, 24 * 60 * 60);
  if (!perEmail.ok) {
    return tooMany(perEmail.retryAfter, "We've already sent this address the kit a few times today. Check your inbox and spam folder.");
  }

  const source = isSignupSource(body.source) ? body.source : "free-kit-page";
  const tags = cleanAttribution(body.attribution);

  // One row per email. A repeat signup keeps the first source and tags, and opts back in.
  const [row] = await db
    .insert(subscriber)
    .values({
      id: randomId(16),
      email,
      source,
      lastSource: source,
      ref: tags.ref,
      utmSource: tags.utm_source,
      utmMedium: tags.utm_medium,
      utmCampaign: tags.utm_campaign,
      utmContent: tags.utm_content,
      utmTerm: tags.utm_term,
      landingPath: tags.landingPath,
    })
    .onConflictDoUpdate({
      target: subscriber.email,
      set: {
        lastSource: source,
        signups: sql`${subscriber.signups} + 1`,
        unsubscribedAt: null,
        ref: sql`coalesce(${subscriber.ref}, excluded.ref)`,
        utmSource: sql`coalesce(${subscriber.utmSource}, excluded.utm_source)`,
        utmMedium: sql`coalesce(${subscriber.utmMedium}, excluded.utm_medium)`,
        utmCampaign: sql`coalesce(${subscriber.utmCampaign}, excluded.utm_campaign)`,
        utmContent: sql`coalesce(${subscriber.utmContent}, excluded.utm_content)`,
        utmTerm: sql`coalesce(${subscriber.utmTerm}, excluded.utm_term)`,
        landingPath: sql`coalesce(${subscriber.landingPath}, excluded.landing_path)`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: subscriber.id });

  const downloadPath = `/api/free-kit/download?token=${encodeURIComponent(downloadToken(row.id))}`;
  const base = process.env.BASE_URL || new URL(req.url).origin;
  let emailed = false;
  try {
    const result = await sendFreeKitEmail({
      to: email,
      downloadUrl: `${base}${downloadPath}`,
      unsubscribeUrl: `${base}/unsubscribe?t=${encodeURIComponent(unsubscribeToken(row.id))}`,
      kitName: FREE_KIT_NAME,
      patternCount: FREE_KIT_COUNT,
      days: FREE_KIT_LINK_DAYS,
    });
    emailed = result.sent;
  } catch (error) {
    // The link is on the page anyway; a failed send shouldn't fail the signup.
    logger.error({ error, subscriber: row.id }, "free kit email failed");
  }

  logger.info({ subscriber: row.id, source, ref: tags.ref, campaign: tags.utm_campaign, emailed }, "free kit signup");
  return Response.json({ ok: true, downloadUrl: downloadPath, emailed, days: FREE_KIT_LINK_DAYS });
}
