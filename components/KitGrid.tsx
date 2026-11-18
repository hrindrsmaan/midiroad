import Link from "next/link";
import { KitCover } from "@/components/KitCover";
import { KIT_PRODUCTS, KITS_TOTAL, BUNDLE_PRICE, kitStats } from "@/lib/products";
import { formatUSD } from "@/lib/pricing";

/**
 * The six kits as cards linking to their own pages. The footer line keeps
 * the bundle in view: all six bought separately cost more than the bundle.
 */
export function KitGrid({
  excludeId,
  title = "Or pick a single kit",
  eyebrow = "6 MIDI kits",
}: {
  excludeId?: string;
  title?: string;
  eyebrow?: string;
}) {
  const kits = KIT_PRODUCTS.filter((k) => k.id !== excludeId);

  return (
    <section
      id="kits"
      className="py-16 md:py-24 px-6 bg-[#0e1014] border-t border-white/10 text-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
              {eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl leading-tight">{title}</h2>
          </div>
          <p className="text-sm font-light tracking-wide text-gray-400 max-w-sm">
            All 6 bought separately: <span className="line-through">{formatUSD(KITS_TOTAL)}</span>.{" "}
            <Link href="/#main-cta" className="text-white underline underline-offset-4 hover:text-[#2bd96b]">
              The full bundle is {formatUSD(BUNDLE_PRICE)}
            </Link>{" "}
            and adds 77 one-shots.
          </p>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {kits.map((kit) => {
            const stats = kitStats(kit);
            return (
              <li key={kit.id}>
                <Link
                  href={`/kits/${kit.slug}`}
                  className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2bd96b]"
                >
                  <div className="transition-transform duration-200 group-hover:-translate-y-1">
                    <KitCover kit={kit} />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg leading-tight group-hover:text-[#2bd96b] transition-colors">
                        {kit.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {kit.vibe} · {stats.patterns} MIDIs
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-black">{formatUSD(kit.price)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default KitGrid;
