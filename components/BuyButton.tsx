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
  children: React.ReactNode;
};

/** Primary green CTA style shared by the big buy buttons. */
export const BUY_BUTTON_CLASS =
  "group relative w-full bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase tracking-wide rounded-full px-8 py-6 text-base shadow-[5px_5px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all";

/**
 * A buy button is a form that POSTs to /api/checkout, which redirects to
 * Stripe. It works before hydration; JS only adds analytics and the
 * "Redirecting…" state.
 */
export function BuyButton({ product, label, className, size = "lg", children, ...rest }: Props) {
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
        gtag.event({ action: "click_download", category: "engagement", label: `${product} · ${label}` });
        setLoading(true);
      }}
    >
      <input type="hidden" name="product" value={product} />
      <Button type="submit" size={size} disabled={loading} className={className} aria-label={rest["aria-label"]}>
        {loading ? "Redirecting…" : children}
      </Button>
    </form>
  );
}

export default BuyButton;
