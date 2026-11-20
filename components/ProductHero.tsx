import Link from "next/link";
import type { ReactNode } from "react";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { Reassurance } from "@/components/Reassurance";
import { formatUSD } from "@/lib/pricing";

/**
 * Product page hero shared by the bundle and every kit: cover on the left,
 * a centered title, price and buy button on the right, then the product's
 * own previews and details underneath.
 */
export function ProductHero({
  id,
  product,
  label,
  cover,
  eyebrow,
  title,
  price,
  originalPrice,
  badge,
  backLink,
  compact = false,
  children,
}: {
  id?: string;
  product: string;
  /** Analytics label for the buy button. */
  label: string;
  cover: ReactNode;
  eyebrow?: ReactNode;
  title: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  backLink?: { href: string; label: string };
  /** Less padding and a smaller cover, for when the hero sits mid-page. */
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 bg-white px-5 ${compact ? "py-12 md:py-16" : "pt-8 pb-20 md:pt-12 md:pb-28"}`}
    >
      <div className="mx-auto max-w-6xl">
        {backLink && (
          <Link href={backLink.href} className="mb-6 inline-block text-sm text-muted transition-colors hover:text-ink">
            ← {backLink.label}
          </Link>
        )}

        <div className={`grid grid-cols-1 items-start md:grid-cols-2 ${compact ? "gap-8 md:gap-12" : "gap-10 md:gap-14"}`}>
          <div className="md:sticky md:top-24">
            <div className={`rounded-3xl bg-canvas ${compact ? "p-6 md:p-8" : "p-8 md:p-12"}`}>
              <div
                className={`mx-auto max-w-md ${compact ? "" : "drop-shadow-[0_24px_24px_rgba(0,0,0,0.28)]"}`}
              >
                {cover}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[540px] md:mx-0">
            <div className="text-center">
              {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{eyebrow}</p>}
              <h1 className="text-4xl md:text-5xl leading-[1.05]">{title}</h1>
              <p className="mt-4 flex items-center justify-center gap-3">
                {originalPrice !== undefined && (
                  <span className="text-2xl text-muted line-through md:text-[28px]">{formatUSD(originalPrice)}</span>
                )}
                <span className="font-heading text-3xl font-extrabold text-brand md:text-[38px]">
                  {formatUSD(price)}
                </span>
                {badge && (
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
                    {badge}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <AddToCartButton product={product} className={BUY_BUTTON_CLASS} />
              <BuyButton
                product={product}
                label={label}
                size="default"
                className="h-12 w-full rounded-full border border-ink bg-transparent text-[13px] font-semibold uppercase tracking-[0.14em] text-ink shadow-none transition-colors hover:bg-ink hover:text-white"
                aria-label={`Buy ${title} now for ${formatUSD(price)}`}
              >
                Buy it now
              </BuyButton>
              <Reassurance className="pt-1" />
            </div>

            {children && <div className={compact ? "mt-8 space-y-8" : "mt-10 space-y-10"}>{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A titled block inside the hero's details column. */
export function HeroBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-xl md:text-2xl leading-tight">{title}</h2>
      {children}
    </div>
  );
}

export default ProductHero;
