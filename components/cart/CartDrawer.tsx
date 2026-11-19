"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { BundleCover, KitCover } from "@/components/KitCover";
import { cartItem, cartTotal } from "@/lib/cart";
import { BUNDLE_ID, BUNDLE_PRICE, KIT_PRODUCTS, kitById } from "@/lib/products";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import { formatUSD } from "@/lib/pricing";
import * as gtag from "@/lib/gtag";

/** Slide-over cart: items, bundle suggestion, subtotal and checkout. */
export function CartDrawer() {
  const cart = useCart();
  const { isOpen, close } = cart;
  const panelRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const items = cart.ids.map(cartItem).filter((i) => !!i);
  const total = cartTotal(cart.ids);
  const kitCount = cart.hasBundle ? 0 : items.length;

  // Escape closes; lock page scroll and move focus into the panel while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, close]);

  // Back from Stripe via the back button restores this page from cache.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => e.persisted && setSubmitting(false);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-xl">
            Your cart{" "}
            {items.length > 0 && <span className="font-sans text-base font-medium text-muted">({items.length})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="-mr-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted">Add a MIDI kit, or get every kit at once with the bundle.</p>
            <Link
              href="/#kits"
              onClick={close}
              className="mt-6 inline-flex h-11 items-center rounded-full border border-ink px-6 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-white"
            >
              Browse MIDI packs
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => {
                const kit = kitById(item.id);
                return (
                  <li key={item.id} className="flex items-center gap-4 py-5">
                    <Link href={item.href} onClick={close} className="w-20 shrink-0">
                      {item.id === BUNDLE_ID ? <BundleCover /> : kit && <KitCover kit={kit} />}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={item.href} onClick={close} className="font-semibold leading-snug hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {item.id === BUNDLE_ID
                          ? `All ${KIT_PRODUCTS.length} kits + ${ONE_SHOT_COUNT} one-shots`
                          : "MIDI drum kit · Instant download"}
                      </p>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.id)}
                        className="mt-2 cursor-pointer text-xs text-muted underline underline-offset-2 hover:text-brand"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="shrink-0 font-semibold">{formatUSD(item.price)}</p>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-line px-6 py-5">
              {/* Two or more kits: point out the bundle */}
              {kitCount >= 2 && (
                <div className="mb-5 rounded-2xl bg-canvas p-4">
                  <p className="text-sm leading-relaxed">
                    {total >= BUNDLE_PRICE ? (
                      <>
                        <strong>Save {formatUSD(total - BUNDLE_PRICE)}:</strong> get all {KIT_PRODUCTS.length} kits +{" "}
                        {ONE_SHOT_COUNT} one-shots for {formatUSD(BUNDLE_PRICE)}.
                      </>
                    ) : (
                      <>
                        <strong>Only {formatUSD(BUNDLE_PRICE - total)} more</strong> gets all {KIT_PRODUCTS.length} kits
                        + {ONE_SHOT_COUNT} one-shots.
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => cart.add(BUNDLE_ID)}
                    className="mt-3 h-9 cursor-pointer rounded-full border border-ink px-4 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-white"
                  >
                    Switch to the bundle
                  </button>
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-heading text-2xl font-extrabold">{formatUSD(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">One-time payment. Promo codes can be added at checkout.</p>

              <form
                action="/api/checkout"
                method="POST"
                className="mt-4"
                onSubmit={() => {
                  gtag.event({ action: "begin_checkout", category: "engagement", label: cart.ids.join(",") });
                  setSubmitting(true);
                }}
              >
                <input type="hidden" name="items" value={cart.ids.join(",")} />
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-14 w-full cursor-pointer rounded-full bg-brand text-[15px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
                >
                  {submitting ? "Redirecting…" : "Checkout"}
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-muted">Secure checkout via Stripe · Instant download</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
