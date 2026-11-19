import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { unlock, user } from "@/lib/db/schema";

/**
 * Credit balance changes. Each one is a single SQL statement, so it is atomic
 * on Neon's HTTP driver without a transaction.
 */

/**
 * Adds credits once per ref (Stripe retries webhooks; the ref makes that safe).
 * With a cap, the new balance is limited to it: unused credits roll over only
 * up to the cap. Returns the new balance, or null if this ref was already granted.
 */
export async function grantCredits(opts: {
  userId: string;
  amount: number;
  reason: string;
  ref: string;
  cap?: number;
}): Promise<number | null> {
  const cap = opts.cap ?? 2_147_483_647;
  const { rows } = await db.execute<{ credits: number }>(sql`
    with granted as (
      insert into credit_grant (user_id, amount, reason, ref)
      values (${opts.userId}, ${opts.amount}, ${opts.reason}, ${opts.ref})
      on conflict (ref) do nothing
      returning amount
    )
    update "user"
    set credits = greatest(least(credits + (select amount from granted), ${cap}), credits)
    where id = ${opts.userId} and exists (select 1 from granted)
    returning credits
  `);
  return rows[0]?.credits ?? null;
}

export type SpendResult =
  | { ok: true; charged: boolean; credits: number }
  | { ok: false; reason: "no_credits"; credits: number };

/**
 * Unlocks an item for 1 credit. Items already unlocked are free to download
 * again. Item keys: "lib:<library id>" or "gen:<pattern id>".
 */
export async function spendCredit(userId: string, item: string): Promise<SpendResult> {
  const { rows } = await db.execute<{ credits: number }>(sql`
    with charged as (
      update "user" set credits = credits - 1
      where id = ${userId} and credits >= 1
        and not exists (select 1 from unlock where user_id = ${userId} and item = ${item})
      returning credits
    ), unlocked as (
      insert into unlock (user_id, item)
      select ${userId}, ${item} from charged
      on conflict do nothing
    )
    select credits from charged
  `);
  if (rows[0]) return { ok: true, charged: true, credits: rows[0].credits };

  // Not charged: either already unlocked (free) or out of credits.
  const [owned, balance] = await Promise.all([
    db.select({ item: unlock.item }).from(unlock).where(and(eq(unlock.userId, userId), eq(unlock.item, item))),
    getCredits(userId),
  ]);
  return owned.length ? { ok: true, charged: false, credits: balance } : { ok: false, reason: "no_credits", credits: balance };
}

export async function getCredits(userId: string) {
  const [row] = await db.select({ credits: user.credits }).from(user).where(eq(user.id, userId));
  return row?.credits ?? 0;
}

/** Item keys the user has unlocked, e.g. to mark library files as owned. */
export async function getUnlocks(userId: string) {
  const rows = await db.select({ item: unlock.item }).from(unlock).where(eq(unlock.userId, userId));
  return new Set(rows.map((r) => r.item));
}
