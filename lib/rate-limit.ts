import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { hashIp } from "@/lib/signing";

/**
 * Fixed-window rate limits kept in Postgres (rate_limit table), so they hold
 * across serverless instances. One upsert per check: the counter resets when
 * its window has passed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const rows = await db.execute<{ count: number; retry: number }>(sql`
    INSERT INTO rate_limit (key, count, reset_at)
    VALUES (${key}, 1, now() + ${windowSeconds}::int * interval '1 second')
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limit.reset_at <= now() THEN 1 ELSE rate_limit.count + 1 END,
      reset_at = CASE WHEN rate_limit.reset_at <= now() THEN now() + ${windowSeconds}::int * interval '1 second' ELSE rate_limit.reset_at END
    RETURNING count, ceil(extract(epoch from reset_at - now()))::int AS retry
  `);
  const row = rows.rows[0];
  const count = Number(row?.count ?? 1);
  const retryAfter = Math.max(1, Number(row?.retry ?? windowSeconds));
  // Expired windows are cleared now and then, so the table stays small.
  if (Math.random() < 0.01) void db.execute(sql`DELETE FROM rate_limit WHERE reset_at < now() - interval '1 day'`).catch(() => {});
  return { ok: count <= limit, count, retryAfter };
}

/** The caller's IP as Vercel reports it (first x-forwarded-for hop). */
export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/** Rate-limit key for this client: `<scope>:<hashed ip>`. */
export const ipKey = (scope: string, req: Request) => `${scope}:ip:${hashIp(clientIp(req))}`;

export const tooMany = (retryAfter: number, message = "Too many requests. Try again in a few minutes.") =>
  Response.json({ error: "rate_limited", message }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
