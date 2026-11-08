import { readFile } from "node:fs/promises";
import path from "node:path";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return new Response("Missing or invalid session", { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return new Response("Payment not completed", { status: 402 });
    }
  } catch {
    return new Response("Could not verify payment", { status: 403 });
  }

  const file = await readFile(path.join(process.cwd(), "private", "midiroad.zip"));
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="midiroad.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
