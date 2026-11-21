import type { Metadata } from "next";
import Link from "next/link";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { Eyebrow } from "@/components/Section";
import { BundleCover, KitCover } from "@/components/KitCover";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteChrome";
import { ClearCartOnMount } from "@/components/cart/CartButtons";
import { TrackPurchase } from "@/components/TrackPurchase";
import { orderProductIds } from "@/lib/cart";
import { stripe } from "@/lib/stripe";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import {
  BUNDLE_ID,
  BUNDLE_NAME,
  BUNDLE_PRICE,
  KIT_PRODUCTS,
  UPGRADE_PREFIX,
  kitById,
  sellable,
  type Sellable,
  upgradeBase,
  upgradePrice,
} from "@/lib/products";
import { formatUSD } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed | MidiRoad",
  robots: { index: false, follow: false },
};

type Order = {
  productIds: string[];
  email?: string;
  free: boolean;
  /** What was actually charged (after any discount), in major units. */
  amount: number;
  currency: string;
  paid: boolean;
};

/** The order behind a session. Old Payment Link orders carry no product: the bundle. */
async function loadOrder(sessionId?: string): Promise<Order | null> {
  if (!sessionId?.startsWith("cs_")) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      productIds: orderProductIds(session.metadata),
      email: session.customer_details?.email ?? session.customer_email ?? undefined,
      free: (session.amount_total ?? 0) === 0,
      amount: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      paid: session.payment_status === "paid",
    };
  } catch {
    return null;
  }
}

const QUICK_START = [
  "Unzip the download.",
  "Drag a MIDI file onto a drum track in your DAW.",
  "Load any drum sound and press play. Every pattern is editable.",
];

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const order = await loadOrder(sessionId);
  const products = (order?.productIds ?? [BUNDLE_ID])
    .map((id) => sellable(id))
    .filter((p): p is Sellable => !!p);
  if (products.length === 0) products.push(sellable(BUNDLE_ID)!);
  const product = products[0];
  const isBundleId = (id: string) => id === BUNDLE_ID || id.startsWith(UPGRADE_PREFIX);
  const downloadHref = (id: string) =>
    sessionId
      ? `/api/download?session_id=${encodeURIComponent(sessionId)}${products.length > 1 ? `&product=${encodeURIComponent(id)}` : ""}`
      : null;

  // A single kit (or test kit) order gets the bundle at the difference.
  const upgradeId = `${UPGRADE_PREFIX}${product.id}`;
  const upgradeFrom =
    order && products.length === 1 && !isBundleId(product.id) ? upgradeBase(upgradeId) : undefined;

  return (
    <main className="min-h-screen bg-canvas">
      {order && <ClearCartOnMount />}
      {order && sessionId && order.paid && !order.free && (
        <TrackPurchase
          transactionId={sessionId}
          value={order.amount}
          currency={order.currency}
          items={products.map((p) => ({ item_id: p.id, item_name: p.name, price: p.price, quantity: 1 }))}
        />
      )}
      <nav className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Link href="/" aria-label="MidiRoad home">
            <Logo />
          </Link>
        </div>
      </nav>

      <section className="px-5 py-14 md:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <Eyebrow className="mb-3 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path d="m9.55 17.6-4.95-4.95 1.41-1.41 3.54 3.54 8.49-8.49 1.41 1.42-9.9 9.9Z" />
              </svg>
              Order confirmed
            </Eyebrow>
            <h1 className="text-3xl md:text-[42px] leading-tight">
              {order?.free ? "You're all set." : "Thanks for your order."}
            </h1>
            <p className="mt-3 text-base text-muted">
              Your files are ready to download.
              {order?.email ? (
                <>
                  {" "}We&apos;ve also emailed the links to <span className="font-medium text-ink">{order.email}</span>.
                </>
              ) : (
                " We've also emailed you the links."
              )}
            </p>
          </div>

          {/* What was bought + downloads */}
          <div className="space-y-3">
            {products.map((p) => {
              const kit = kitById(p.id);
              const href = downloadHref(p.id);
              return (
                <article
                  key={p.id}
                  className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="w-28 shrink-0">
                    {kit ? (
                      <KitCover kit={kit} />
                    ) : isBundleId(p.id) ? (
                      <BundleCover />
                    ) : (
                      <div className="grid aspect-square w-full place-items-center rounded-xl bg-canvas text-xs text-muted">
                        Test
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl leading-tight">{p.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                  </div>
                  {href ? (
                    <a
                      href={href}
                      download
                      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-hover"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                        <path d="M12 3v10.6l3.3-3.3 1.4 1.4L12 16.4 7.3 11.7l1.4-1.4 3.3 3.3V3h2Zm-8 14h16v2H4v-2Z" />
                      </svg>
                      Download
                    </a>
                  ) : (
                    <p className="max-w-[14rem] text-sm text-muted">
                      Check your email for the download link, or contact support@inbox.midiroad.com.
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {/* Bundle upgrade at the difference */}
          {upgradeFrom && sessionId && (
            <article className="rounded-2xl border border-brand/30 bg-white p-5 sm:p-6">
              <Eyebrow>Only on this page</Eyebrow>
              <h2 className="mt-2 text-xl md:text-2xl leading-tight">
                Get everything else for {formatUSD(upgradePrice(upgradeFrom))}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Upgrade to {BUNDLE_NAME}: all {KIT_PRODUCTS.length} MIDI kits plus {ONE_SHOT_COUNT} one-shot
                WAVs.
                {upgradePrice(upgradeFrom) < BUNDLE_PRICE &&
                  ` You only pay the difference from this order, not the full ${formatUSD(BUNDLE_PRICE)}.`}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Kits in the bundle">
                {KIT_PRODUCTS.filter((k) => k.id !== product.id).map((k) => (
                  <li
                    key={k.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs"
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: k.accent }} />
                    {k.name}
                  </li>
                ))}
              </ul>
              <div className="mt-5 max-w-sm">
                <BuyButton
                  product={upgradeId}
                  fields={{ from: sessionId }}
                  label="Success Page Upgrade"
                  className={BUY_BUTTON_CLASS}
                >
                  Upgrade for {formatUSD(upgradePrice(upgradeFrom))}
                </BuyButton>
              </div>
            </article>
          )}

          {/* Quick start */}
          <article className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg">Start in 30 seconds</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
              {QUICK_START.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <p className="text-sm text-muted">
            Need help? Email{" "}
            <a href="mailto:support@inbox.midiroad.com" className="text-ink underline underline-offset-4">
              support@inbox.midiroad.com
            </a>{" "}
            and we&apos;ll sort it out.{" "}
            <Link href="/" className="text-ink underline underline-offset-4">
              Back to the store
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
