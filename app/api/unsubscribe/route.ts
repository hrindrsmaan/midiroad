import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriber } from "@/lib/db/schema";
import { checkUnsubscribeToken } from "@/lib/signing";

export const dynamic = "force-dynamic";

/**
 * Unsubscribes from MidiRoad emails. Takes the signed token as ?t= (mail
 * apps' one-click List-Unsubscribe POST, RFC 8058) or as a `t` form field
 * (the button on /unsubscribe, which then shows the confirmation).
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get("t");
  let fromPage = false;
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("form")) {
    const form = await req.formData().catch(() => null);
    const field = form?.get("t");
    if (typeof field === "string" && field) {
      token = field;
      fromPage = true;
    }
  }

  const id = checkUnsubscribeToken(token);
  if (id) {
    await db.update(subscriber).set({ unsubscribedAt: new Date() }).where(eq(subscriber.id, id));
  }

  if (fromPage) {
    return Response.redirect(new URL(`/unsubscribe?${id ? "done=1" : "invalid=1"}`, req.url), 303);
  }
  return id ? new Response("Unsubscribed", { status: 200 }) : new Response("Invalid link", { status: 400 });
}
