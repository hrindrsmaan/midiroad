import Image from "next/image";
import Link from "next/link";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { PriceStack } from "@/components/PriceStack";
import { Reassurance } from "@/components/Reassurance";
import { AudioPreviews } from "@/components/AudioPreviews";
import { PRICING, formatUSD } from "@/lib/pricing";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, BUNDLE_NAME, KIT_PRODUCTS } from "@/lib/products";

export function ProductDetail() {
  return (
    <section
      id="main-cta"
      className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 bg-[#0e1014] text-white scroll-mt-32"
    >
      <div className="max-w-6xl mx-auto">
        {/*
          Poster and previews share the left column so it roughly matches the
          buy box. On mobile the DOM order puts the buy box before previews.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-10">
          {/* Poster */}
          <div className="relative flex items-center justify-center md:col-start-1 md:row-start-1">
            {/* Soft glow so the dark covers lift off the dark background */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-1/2 mx-auto aspect-square w-4/5 max-w-sm -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.28),rgba(43,217,107,0.10)_60%,transparent)] blur-2xl"
            />
            <Image
              src="/images/bundle-poster.png"
              alt="MidiRoad bundle covers"
              width={782}
              height={897}
              sizes="(min-width: 768px) 384px, 352px"
              priority
              className="relative w-full max-w-[22rem] md:max-w-sm h-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Buy box */}
          <div className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-start md:sticky md:top-28">
            <div className="bg-[#18181b] rounded-md p-6 sm:p-8 space-y-6">
              <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
                  {BUNDLE_NAME} · Best value
                </p>
                <h1 className="text-2xl md:text-3xl leading-tight">
                  Finish beats faster
                </h1>
                <p className="mt-4 text-base font-light leading-relaxed tracking-wide text-gray-300">
                  Every kit in the store: {MIDI_PATTERN_COUNT} drag-and-drop MIDI
                  drum patterns plus {ONE_SHOT_COUNT} one-shots for dark trap, RnB
                  and soul. Drag, drop, and sound professional.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Kits included">
                  {KIT_PRODUCTS.map((kit) => (
                    <li key={kit.id}>
                      <Link
                        href={`/kits/${kit.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-gray-300 hover:border-white/40 hover:text-white transition-colors"
                      >
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: kit.accent }} />
                        {kit.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-4">
                <PriceStack />
                <p className="-mt-2 text-xs text-gray-400">
                  All 6 kits bought separately cost {formatUSD(PRICING.originalPrice)}. The bundle adds{" "}
                  {ONE_SHOT_COUNT} one-shots you can&apos;t get anywhere else.
                </p>
                <BuyButton
                  product={BUNDLE_ID}
                  label="Product Section Button"
                  className={BUY_BUTTON_CLASS}
                  aria-label={`Get instant access to ${BUNDLE_NAME} for ${formatUSD(PRICING.currentPrice)}`}
                >
                  <span className="flex items-center gap-2">
                    Get the Bundle
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </BuyButton>
                <Reassurance />
              </div>
            </div>
          </div>

          {/* Quick listen */}
          <div className="md:col-start-1 md:row-start-2 rounded-md border border-white/10 p-6 sm:p-8">
            <AudioPreviews />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
