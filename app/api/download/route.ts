import { readFile } from "node:fs/promises";
import path from "node:path";
import { stripe } from "@/lib/stripe";
import { sellable } from "@/lib/products";
import { orderProductIds } from "@/lib/cart";

export const dynamic = "force-dynamic";

/**
 * Downloads one product from a paid order. `product` picks which one when
 * the order has several; without it, the order's first product.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const sessionId = params.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return new Response("Missing or invalid session", { status: 400 });
  }

  let productIds: string[];
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // $0 orders (the test kit) complete as "no_payment_required".
    if (session.status !== "complete" || session.payment_status === "unpaid") {
      return new Response("Payment not completed", { status: 402 });
    }
    productIds = orderProductIds(session.metadata);
  } catch {
    return new Response("Could not verify payment", { status: 403 });
  }

  const productId = params.get("product") ?? productIds[0];
  if (!productIds.includes(productId)) {
    return new Response("That product isn't part of this order", { status: 403 });
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
