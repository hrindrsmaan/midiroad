import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sharedBeat } from "@/lib/db/schema";
import { isRandomId, randomId } from "@/lib/ids";
import { ipKey, rateLimit, tooMany } from "@/lib/rate-limit";
import { MAX_BEAT_BYTES, parseBeat } from "@/lib/shared-beat";

export const dynamic = "force-dynamic";

/**
 * Saves a beat maker beat for sharing at /b/<id>. No sign-in. Guards: the
 * body is capped at MAX_BEAT_BYTES, every field must be one the beat maker can
 * produce (lib/shared-beat.ts), and each IP can save 30 beats an hour.
 * `parentId` marks a remix of another shared beat.
 */
export async function POST(req: Request) {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BEAT_BYTES) return Response.json({ error: "too_large" }, { status: 413 });
  const text = await req.text();
  if (text.length > MAX_BEAT_BYTES) return Response.json({ error: "too_large" }, { status: 413 });

  let body: { beat?: unknown; parentId?: unknown } | null = null;
  try {
    body = JSON.parse(text);
  } catch {}
  const beat = parseBeat(body?.beat);
  if (!beat) return Response.json({ error: "invalid", message: "That beat can't be shared." }, { status: 400 });

  const limit = await rateLimit(ipKey("share-beat", req), 30, 60 * 60);
  if (!limit.ok) return tooMany(limit.retryAfter, "You've shared a lot of beats. Try again in a little while.");

  let parentId: string | null = null;
  if (isRandomId(body?.parentId)) {
    const [parent] = await db.select({ id: sharedBeat.id }).from(sharedBeat).where(eq(sharedBeat.id, body.parentId)).limit(1);
    parentId = parent?.id ?? null;
  }

  // 62^8 ids: a clash is very unlikely, but retry rather than fail if one happens.
  for (let attempt = 0; attempt < 4; attempt++) {
    const id = randomId(8);
    const [row] = await db
      .insert(sharedBeat)
      .values({ id, parentId, data: beat })
      .onConflictDoNothing()
      .returning({ id: sharedBeat.id });
    if (row) return Response.json({ id: row.id, parentId }, { status: 201 });
  }
  return Response.json({ error: "failed", message: "Couldn't save the beat. Try again." }, { status: 500 });
}
