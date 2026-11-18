import Image from "next/image";
import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { formatUSD } from "@/lib/pricing";

/** Fixed top bar: logo, kit link and one buy button. */
export function SiteNav({
  product,
  cta = "Get Instant Access",
}: {
  product: string;
  cta?: string;
}) {
  return (
    <nav className="flex items-center justify-between gap-4 px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black fixed top-0 z-50">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="MidiRoad Home"
      >
        <Image src="/logo-white.png" alt="MidiRoad" width={640} height={640} priority className="h-10 w-auto" />
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/#kits"
          className="hidden sm:block text-[12px] uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
        >
          Kits
        </Link>
        <BuyButton
          product={product}
          label="Nav Button"
          size="default"
          className="bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase text-[13px] tracking-wider rounded-full px-5 shadow-[2px_2px_0_0_#fff]"
        >
          {cta}
        </BuyButton>
      </div>
    </nav>
  );
}

/** Sticky buy bar on mobile, so the CTA is always one tap away. */
export function StickyBuyBar({
  product,
  price,
  originalPrice,
  badge,
  cta = "Get Instant Access",
}: {
  product: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  cta?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-black md:hidden z-50 shadow-[0_-4px_0_0_#000]">
      <div className="flex items-center justify-between gap-2 mb-2">
        {originalPrice ? (
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 line-through">
            {formatUSD(originalPrice)}
          </span>
        ) : (
          <span />
        )}
        {badge && (
          <span className="bg-black text-[#ff90e8] text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
        <span className="text-sm font-black text-black">{formatUSD(price)}</span>
      </div>
      <BuyButton
        product={product}
        label="Mobile Sticky Bar"
        className="w-full bg-[#2bd96b] hover:bg-[#22c55e] text-black border-2 border-black font-black uppercase tracking-wide shadow-[3px_3px_0_0_#000]"
      >
        {cta}
      </BuyButton>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Image
              src="/logo-white.png"
              alt="MidiRoad"
              width={640}
              height={640}
              className="h-10 w-auto mb-4 mx-auto md:mx-0"
            />
            <p className="text-gray-400 text-sm max-w-xs">
              Drag-and-drop MIDI drum kits and trap one-shots.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              <a href="mailto:support@midiroad.com" className="hover:text-white transition-colors">
                support@midiroad.com
              </a>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © {new Date().getFullYear()} MidiRoad. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
