"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { BUNDLE_ID } from "@/lib/products";

/** Header cart icon with the item count. */
export function CartButton() {
  const { ids, ready, open } = useCart();
  const count = ready ? ids.length : 0;
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart${count ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
      className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-foreground/[0.03]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[22px] w-[22px]" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
        <path d="M9 7V6a3 3 0 0 1 6 0v1" strokeLinecap="round" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-key bg-brand px-1 text-xs font-bold leading-none text-on-brand">
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * Adds a product to the cart and opens it. Once it's in the cart (or the
 * bundle is, which holds every kit) the button opens the cart instead.
 */
export function AddToCartButton({
  product,
  className,
  label = "Add to cart",
}: {
  product: string;
  className: string;
  label?: string;
}) {
  const cart = useCart();
  const inCart = cart.has(product);
  const inBundle = product !== BUNDLE_ID && cart.hasBundle;

  return (
    <button
      type="button"
      onClick={() => (inCart || inBundle ? cart.open() : cart.add(product))}
      className={`cursor-pointer ${className}`}
    >
      {inCart ? "In cart · View" : inBundle ? "In your bundle" : label}
    </button>
  );
}

/** Empties the cart once an order is confirmed. */
export function ClearCartOnMount() {
  const { clear, ready } = useCart();
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    clear();
  }, [ready, clear]);
  return null;
}
