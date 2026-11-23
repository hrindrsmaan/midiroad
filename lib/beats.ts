import { cache } from "react";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sharedBeat } from "@/lib/db/schema";
import { isRandomId } from "@/lib/ids";
import { parseBeat, type SharedBeat } from "@/lib/shared-beat";

export type StoredBeat = { id: string; parentId: string | null; beat: SharedBeat; createdAt: Date; remixes: number };

/** One shared beat with its remix count, or null. Cached per request (page, metadata and OG image share it). */
export const getBeat = cache(async (id: string): Promise<StoredBeat | null> => {
  if (!isRandomId(id)) return null;
  const [row] = await db.select().from(sharedBeat).where(eq(sharedBeat.id, id)).limit(1);
  const beat = row ? parseBeat(row.data) : null;
  if (!row || !beat) return null;
  const [{ n }] = await db.select({ n: count() }).from(sharedBeat).where(eq(sharedBeat.parentId, id));
  return { id: row.id, parentId: row.parentId, beat, createdAt: row.createdAt, remixes: n };
});
