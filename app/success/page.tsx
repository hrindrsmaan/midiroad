import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { KitCover } from "@/components/KitCover";
import { SiteFooter } from "@/components/SiteChrome";
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
  productId: string;
  email?: string;
  free: boolean;
};

/** The order behind a session. Old Payment Link orders carry no product: the bundle. */
async function loadOrder(sessionId?: string): Promise<Order | null> {
  if (!sessionId?.startsWith("cs_")) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      productId: session.metadata?.product ?? BUNDLE_ID,
      email: session.customer_details?.email ?? session.customer_email ?? undefined,
      free: (session.amount_total ?? 0) === 0,
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
  const product = sellable(order?.productId ?? BUNDLE_ID) ?? sellable(BUNDLE_ID)!;
  const kit = kitById(product.id);
  const isBundle = product.id === BUNDLE_ID || product.id.startsWith(UPGRADE_PREFIX);
  const downloadHref = sessionId
    ? `/api/download?session_id=${encodeURIComponent(sessionId)}`
    : null;

  // Kit (and test kit) buyers get the bundle at the difference.
  const upgradeId = `${UPGRADE_PREFIX}${product.id}`;
  const upgradeFrom = order && !isBundle ? upgradeBase(upgradeId) : undefined;

  return (
    <main className="min-h-screen bg-[#0e1014] text-white font-sans">
      <nav className="flex items-center px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black">
        <Link href="/" className="hover:opacity-80 transition-opacity" aria-label="MidiRoad Home">
          <Image src="/logo-white.png" alt="MidiRoad" width={640} height={640} priority className="h-10 w-auto" />
        </Link>
      </nav>

      <section className="px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path d="m9.55 17.6-4.95-4.95 1.41-1.41 3.54 3.54 8.49-8.49 1.41 1.42-9.9 9.9Z" />
              </svg>
              Order confirmed
            </p>
            <h1 className="text-3xl md:text-4xl leading-tight">
              {order?.free ? "You're all set." : "Thanks for your order."}
            </h1>
            <p className="mt-3 text-base font-light text-gray-300">
              Your files are ready to download.
              {order?.email ? (
                <>
                  {" "}We&apos;ve also emailed the link to <span className="text-white">{order.email}</span>.
                </>
              ) : (
                " We've also emailed you the link."
              )}
            </p>
          </div>

          {/* What was bought + download */}
          <article className="bg-[#18181b] rounded-md p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
            <div className="w-28 shrink-0">
              {kit ? (
                <KitCover kit={kit} />
              ) : isBundle ? (
                <Image
                  src="/images/bundle-poster.png"
                  alt={`${BUNDLE_NAME} cover`}
                  width={782}
                  height={897}
                  className="w-full h-auto rounded-md"
                />
              ) : (
                <div className="aspect-square w-full rounded-md border border-white/10 bg-white/[0.03] grid place-items-center text-xs text-gray-400">
                  Test
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl leading-tight">{product.name}</h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-gray-400">{product.description}</p>
            </div>
            {downloadHref ? (
              <a
                href={downloadHref}
                download
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#2bd96b] hover:bg-[#22c55e] border-2 border-black px-6 py-3 font-display text-sm uppercase tracking-wider text-black shadow-[3px_3px_0_0_#000] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M12 3v10.6l3.3-3.3 1.4 1.4L12 16.4 7.3 11.7l1.4-1.4 3.3 3.3V3h2Zm-8 14h16v2H4v-2Z" />
                </svg>
                Download
              </a>
            ) : (
              <p className="text-sm text-gray-300 max-w-[14rem]">
                Check your email for the download link, or contact support@midiroad.com.
              </p>
            )}
          </article>

          {/* Bundle upgrade at the difference */}
          {upgradeFrom && sessionId && (
            <article className="rounded-md border-2 border-dashed border-[#2bd96b]/50 p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
                Only on this page
              </p>
              <h2 className="mt-2 text-xl md:text-2xl leading-tight">
                Get everything else for {formatUSD(upgradePrice(upgradeFrom))}
              </h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-gray-300">
                Upgrade to {BUNDLE_NAME}: all {KIT_PRODUCTS.length} MIDI kits plus {ONE_SHOT_COUNT} one-shot
                WAVs.
                {upgradePrice(upgradeFrom) < BUNDLE_PRICE &&
                  ` You only pay the difference from this order, not the full ${formatUSD(BUNDLE_PRICE)}.`}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Kits in the bundle">
                {KIT_PRODUCTS.filter((k) => k.id !== product.id).map((k) => (
                  <li
                    key={k.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-gray-300"
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
          <article className="rounded-md border border-white/10 p-5 sm:p-6">
            <h2 className="text-lg">Start in 30 seconds</h2>
            <ol className="mt-3 space-y-2 list-decimal pl-5 text-sm font-light text-gray-300">
              {QUICK_START.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <p className="text-sm text-gray-400">
            Need help? Email{" "}
            <a href="mailto:support@midiroad.com" className="text-white underline underline-offset-4">
              support@midiroad.com
            </a>{" "}
            and we&apos;ll sort it out.{" "}
            <Link href="/" className="text-white underline underline-offset-4">
              Back to the store
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
