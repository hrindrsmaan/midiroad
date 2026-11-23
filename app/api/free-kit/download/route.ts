import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriber } from "@/lib/db/schema";
import { FREE_KIT_FILENAME, FREE_KIT_PATH, readFreeKitZip } from "@/lib/free-kit";
import { ipKey, rateLimit, tooMany } from "@/lib/rate-limit";
import { checkDownloadToken } from "@/lib/signing";

export const dynamic = "force-dynamic";

/**
 * Streams the free kit zip for a signed link from /api/free-kit. An expired
 * or broken link goes back to the landing page, which explains and lets the
 * visitor ask for a fresh one.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const check = checkDownloadToken(token);
  const back = (reason: string) =>
    Response.redirect(new URL(`${FREE_KIT_PATH}?link=${reason}#get-kit`, req.url), 303);
  if (!check.ok) return back(check.reason);

  const limit = await rateLimit(ipKey("free-kit-download", req), 30, 60 * 60);
  if (!limit.ok) return tooMany(limit.retryAfter);

  const [row] = await db
    .update(subscriber)
    .set({ downloads: sql`${subscriber.downloads} + 1`, lastDownloadAt: new Date() })
    .where(eq(subscriber.id, check.subscriberId))
    .returning({ id: subscriber.id });
  if (!row) return back("invalid");

  const zip = await readFreeKitZip();
  return new Response(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${FREE_KIT_FILENAME}"`,
      "Content-Length": String(zip.byteLength),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
