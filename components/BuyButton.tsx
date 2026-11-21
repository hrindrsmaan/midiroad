"use client";

import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import * as gtag from "@/lib/gtag";

type Props = {
  /** "bundle" or a kit id from lib/products.ts. */
  product: string;
  /** Which button was clicked, for analytics. */
  label: string;
  className?: string;
  size?: ButtonProps["size"];
  "aria-label"?: string;
  /** Extra form fields sent to /api/checkout, e.g. the original order. */
  fields?: Record<string, string>;
  children: React.ReactNode;
};

/** Primary buy button: the one red call to action used across the store. */
export const BUY_BUTTON_CLASS =
  "w-full h-14 rounded-full bg-brand hover:bg-brand-hover text-white text-[15px] font-semibold uppercase tracking-[0.16em] shadow-none transition-colors";

/** Secondary action: outlined, for upsells next to a primary button. */
export const SECONDARY_BUTTON_CLASS =
  "h-11 rounded-full border border-ink bg-transparent px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink shadow-none hover:bg-ink hover:text-white transition-colors";

/**
 * A buy button is a form that POSTs to /api/checkout, which redirects to
 * Stripe. It works before hydration; JS only adds analytics and the
 * "Redirecting…" state.
 */
export function BuyButton({ product, label, className, size = "lg", fields, children, ...rest }: Props) {
  const [loading, setLoading] = useState(false);

  // Coming back from Stripe with the back button restores the page from
  // cache with the button still disabled; re-enable it.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <form
      action="/api/checkout"
      method="POST"
      onSubmit={() => {
        gtag.event({ action: "begin_checkout", category: "engagement", label: `${product} · ${label}` });
        setLoading(true);
      }}
    >
      <input type="hidden" name="product" value={product} />
      {Object.entries(fields ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" size={size} disabled={loading} className={className} aria-label={rest["aria-label"]}>
        {loading ? "Redirecting…" : children}
      </Button>
    </form>
  );
}

export default BuyButton;
