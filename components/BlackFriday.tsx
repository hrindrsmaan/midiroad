"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { BLACK_FRIDAY, PRICING, formatUSD } from "@/lib/pricing";

/** Thin strip above the nav announcing the sale and the code. */
export function BlackFridayBar() {
  if (!BLACK_FRIDAY.active) return null;
  return (
    <div className="bg-foreground px-4 py-2 text-center text-[13px] leading-snug text-background">
      <span className="mr-2 rounded-[3px] bg-brand px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-on-brand">
        Black Friday
      </span>
      The Complete Vault is {PRICING.discountPercent}% off.{" "}
      <Link href="/#main-cta" className="font-semibold underline underline-offset-2">
        Code {BLACK_FRIDAY.couponCode}
      </Link>{" "}
      takes an extra ${BLACK_FRIDAY.couponAmount} off &mdash; already applied in your cart.
    </div>
  );
}

/** Coupon input + applied state. Shared by the bundle hero and the cart. */
export function CouponField({ className = "" }: { className?: string }) {
  const cart = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const id = useId();

  if (!BLACK_FRIDAY.active) return null;

  if (cart.coupon) {
    return (
      <p className={`flex items-center gap-2 text-sm ${className}`}>
        <span>
          <span className="font-semibold text-brand">✓ {cart.coupon}</span>{" "}
          <span className="text-muted">applied: extra ${BLACK_FRIDAY.couponAmount} off the bundle</span>
        </span>
      </p>
    );
  }

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        setError(!cart.applyCoupon(code));
      }}
    >
      <label htmlFor={id} className="sr-only">
        Coupon code
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder="Coupon code"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-10 min-w-0 flex-1 rounded-key border border-strong bg-transparent px-3 text-sm uppercase placeholder:normal-case placeholder:text-muted focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 shrink-0 cursor-pointer rounded-key border border-strong px-4 text-[13px] font-semibold transition-colors hover:bg-foreground/[0.06]"
        >
          Apply
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          That code isn&apos;t valid.
        </p>
      )}
    </form>
  );
}

/** Black Friday box in the bundle hero: the code, and the price with it. */
export function BlackFridayDeal() {
  const { coupon } = useCart();
  if (!BLACK_FRIDAY.active) return null;
  return (
    <div className="rounded-md border border-brand/40 bg-brand/[0.06] p-4">
      <p className="text-sm leading-relaxed">
        <strong className="text-brand">Black Friday extra:</strong>{" "}
        {coupon ? (
          <>
            you pay <strong className="font-wide text-base text-brand">{formatUSD(PRICING.couponPrice)}</strong>{" "}
            <span className="text-muted line-through">{formatUSD(PRICING.currentPrice)}</span>
          </>
        ) : (
          <>
            use code <strong className="tracking-wide">{BLACK_FRIDAY.couponCode}</strong> for{" "}
            ${BLACK_FRIDAY.couponAmount} more off, {formatUSD(PRICING.couponPrice)} total.
          </>
        )}
      </p>
      <CouponField className="mt-3" />
    </div>
  );
}
