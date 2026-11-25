import Link from "next/link";
import type { ReactNode } from "react";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { Reassurance } from "@/components/Reassurance";
import { Eyebrow } from "@/components/Section";
import { Testimonials } from "@/components/Testimonials";
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
  promo,
  backLink,
  headingLevel = "h1",
  intro,
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
  /** Sale box under the price, e.g. a coupon. */
  promo?: ReactNode;
  backLink?: { href: string; label: string };
  /** h1 on a product page; h2 when the hero sits under another page heading. */
  headingLevel?: "h1" | "h2";
  /** One line under the title, e.g. how this product relates to the rest of the page. */
  intro?: ReactNode;
  /** Less padding and a smaller cover, for when the hero sits mid-page. */
  compact?: boolean;
  children?: ReactNode;
}) {
  const Heading = headingLevel;
  return (
    <section
      id={id}
      className={`scroll-mt-16 bg-background px-5 ${compact ? "py-12 md:py-16" : "pt-8 pb-20 md:pt-12 md:pb-28"}`}
    >
      <div className="mx-auto max-w-6xl">
        {backLink && (
          <Link href={backLink.href} className="mb-6 inline-block text-sm text-muted transition-colors hover:text-ink">
            ← {backLink.label}
          </Link>
        )}

        <div className={`grid grid-cols-1 items-start md:grid-cols-2 ${compact ? "gap-8 md:gap-12" : "gap-10 md:gap-14"}`}>
          <div className="md:sticky md:top-24">
            <div className={`rounded-md bg-canvas ${compact ? "p-6 md:p-8" : "p-8 md:p-12"}`}>
              <div
                className={`mx-auto max-w-md ${compact ? "" : "drop-shadow-[0_24px_24px_rgba(31,31,31,0.22)]"}`}
              >
                {cover}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[540px] md:mx-0">
            <div>
              {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
              <Heading className="text-[34px] leading-[1] tracking-[-0.025em] md:text-[52px]">{title}</Heading>
              {intro && <p className="mt-3 max-w-md text-base leading-relaxed text-muted">{intro}</p>}
              <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                {originalPrice !== undefined && (
                  <span className="text-xl tabular-nums text-muted line-through md:text-2xl">{formatUSD(originalPrice)}</span>
                )}
                <span className="font-wide text-[34px] leading-none text-brand md:text-[44px]">
                  {formatUSD(price)}
                </span>
                {badge && (
                  <span className="self-center rounded-key bg-primary px-2.5 py-1 text-xs font-bold text-on-brand">
                    {badge}
                  </span>
                )}
              </p>
              {promo && <div className="mt-5">{promo}</div>}
            </div>

            <div className="mt-6 space-y-3">
              <AddToCartButton product={product} className={BUY_BUTTON_CLASS} />
              <BuyButton
                product={product}
                label={label}
                size="default"
                className="h-12 w-full rounded-key border border-strong bg-transparent text-sm font-semibold text-ink shadow-none transition-colors hover:bg-foreground/[0.06]"
                aria-label={`Buy ${title} now for ${formatUSD(price)}`}
              >
                Buy it now
              </BuyButton>
              <Reassurance className="pt-1" />
              <Testimonials className="!mt-4" />
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
