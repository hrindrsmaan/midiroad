import Link from "next/link";
import { KitCardPlay } from "@/components/BundlePreviews";
import { BundleCover, KitCover } from "@/components/KitCover";
import { AddToCartButton } from "@/components/cart/CartButtons";
import { BUNDLE_ID, KIT_PRODUCTS, BUNDLE_NAME, BUNDLE_PRICE } from "@/lib/products";
import { PRICING, formatUSD } from "@/lib/pricing";
import { Section, SectionHeader, type Tone } from "@/components/Section";

type Card = {
  key: string;
  product: string;
  href: string;
  name: string;
  price: number;
  originalPrice?: number;
  cover: React.ReactNode;
};

/**
 * Store-style grid of MIDI packs: the bundle first, then each kit, with a
 * centered title and a strikethrough price where there is a real anchor.
 */
export function KitGrid({
  excludeId,
  includeBundle = true,
  title = "MIDI Packs",
  eyebrow = "Shop",
  tone = "canvas",
}: {
  excludeId?: string;
  /** Off where the bundle already has its own section above the grid. */
  includeBundle?: boolean;
  title?: string;
  eyebrow?: string;
  tone?: Tone;
}) {
  const bundleCard: Card = {
    key: "bundle",
    product: BUNDLE_ID,
    href: "/#main-cta",
    name: `${BUNDLE_NAME} Bundle`,
    price: BUNDLE_PRICE,
    originalPrice: PRICING.originalPrice,
    cover: <BundleCover />,
  };
  const cards: Card[] = [
    ...(includeBundle ? [bundleCard] : []),
    ...KIT_PRODUCTS.filter((k) => k.id !== excludeId).map((kit) => ({
      key: kit.id,
      product: kit.id,
      href: `/kits/${kit.slug}`,
      name: kit.name,
      price: kit.price,
      originalPrice: kit.originalPrice,
      cover: <KitCover kit={kit} />,
    })),
  ];

  return (
    <Section id="kits" tone={tone}>
      <SectionHeader eyebrow={eyebrow} title={title} />

      <ul className="grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.key}>
            <Link
              href={card.href}
              className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <div className="max-w-[260px] drop-shadow-[0_14px_14px_rgba(31,31,31,0.18)] transition-transform duration-300 group-hover:-translate-y-1.5">
                {card.cover}
              </div>
              <h3 className="mt-5 text-[15px] leading-snug md:text-base">{card.name}</h3>
              <p className="mt-1.5 text-[15px] tabular-nums">
                {card.originalPrice !== undefined && (
                  <span className="mr-2 text-muted line-through">{formatUSD(card.originalPrice)}</span>
                )}
                <span className="font-bold text-brand">{formatUSD(card.price)}</span>
              </p>
            </Link>
            <div className="mt-3 flex flex-wrap gap-2">
              {card.key !== "bundle" && <KitCardPlay kitId={card.product} kitName={card.name} />}
              <AddToCartButton
                product={card.product}
                className="h-9 rounded-key border border-strong px-4 text-[13px] font-semibold transition-colors hover:bg-foreground/[0.06]"
              />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default KitGrid;
