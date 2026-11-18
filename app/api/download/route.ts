import { readFile } from "node:fs/promises";
import path from "node:path";
import { stripe } from "@/lib/stripe";
import { BUNDLE_ID, sellable } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return new Response("Missing or invalid session", { status: 400 });
  }

  let productId: string;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // $0 orders (the test kit) complete as "no_payment_required".
    if (session.status !== "complete" || session.payment_status === "unpaid") {
      return new Response("Payment not completed", { status: 402 });
    }
    // Older Payment Link purchases carry no metadata: they bought the bundle.
    productId = session.metadata?.product ?? BUNDLE_ID;
  } catch {
    return new Response("Could not verify payment", { status: 403 });
  }

  const product = sellable(productId);
  if (!product) {
    return new Response("Unknown product", { status: 404 });
  }

  const file = await readFile(path.join(process.cwd(), "private", product.file));
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product.downloadName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
