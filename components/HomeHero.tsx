import { BuyButton } from "@/components/BuyButton";
import { HeroPlayer } from "@/components/HeroPlayer";
import { KitCoverFront } from "@/components/KitCover";
import { featuredBeat } from "@/lib/featured-beat";
import { MIDI_PATTERN_COUNT } from "@/lib/midi-kits";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_ID, KIT_PRODUCTS } from "@/lib/products";
import { BUNDLE_PRICE_NOW, PRICING, REFUND_DAYS, centsPerPattern, formatUSD } from "@/lib/pricing";

/**
 * BUY_BUTTON_CLASS lives in a client module, so a server component can pass it
 * along but can't build a new string from it; this is its hero-sized copy.
 */
const HERO_BUY_CLASS =
  "w-full h-[52px] rounded-key bg-brand hover:bg-brand-hover text-on-brand text-base font-semibold shadow-none transition-colors md:w-auto md:px-7";

/**
 * Homepage hero: hear the drums first. A full beat from one kit plays on the
 * right (under the headline on a phone), and the Vault is the one offer.
 */
export function HomeHero() {
  const beat = featuredBeat();
  const kit = KIT_PRODUCTS.find((product) => product.id === beat.kitId);
  const cover = kit ? <KitCoverFront kit={kit} /> : null;

  return (
    <section className="px-5 pb-10 pt-6 md:pb-16 md:pt-[72px]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] md:grid-rows-[auto_auto] md:gap-x-16">
        <div className="min-w-0 md:self-end">
          <p className="text-[13px] font-semibold text-muted md:text-sm">
            MIDI drum kits for trap, drill &amp; RnB<span className="hidden md:inline"> · royalty-free</span>
          </p>
          <h1 className="mt-2.5 text-balance text-[40px] leading-[0.98] tracking-[-0.045em] md:mt-4 md:text-[72px] md:leading-[0.95]">
            Hear the drums before you buy them.
          </h1>
          <p className="mt-6 hidden max-w-[520px] text-pretty text-lg leading-relaxed text-muted md:block">
            {MIDI_PATTERN_COUNT} hi-hat, snare, kick and 808 patterns. Press play on any of them, then drag the MIDI into
            FL Studio, Ableton, Logic or any DAW.
          </p>
        </div>

        {/* Right column on desktop; between the headline and the price on a phone. */}
        <div className="mt-5 min-w-0 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:self-center">
          <HeroPlayer beat={beat} cover={cover} />
        </div>

        <div className="min-w-0 md:col-start-1 md:row-start-2">
          <div className="mt-[22px] flex flex-col gap-1 md:mt-9 md:gap-1.5">
            <p className="text-[13px] font-semibold text-brand md:text-sm">
              The Complete Vault · every kit + {ONE_SHOT_COUNT} one-shots
            </p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-wide text-[34px] leading-none text-ink md:text-[40px]">{formatUSD(BUNDLE_PRICE_NOW)}</span>
              <span className="text-[13px] text-muted md:text-[15px]">
                one payment<span className="md:hidden"> · about {centsPerPattern(MIDI_PATTERN_COUNT)}¢ a pattern</span>
                <span className="hidden md:inline">
                  {" "}
                  · yours forever
                  {PRICING.originalPrice > BUNDLE_PRICE_NOW && <> · {formatUSD(PRICING.originalPrice)} if you bought each kit</>}
                </span>
              </span>
            </p>
            <p className="hidden text-sm text-muted md:block">
              {PRICING.discountPercent}% less than buying the kits one by one · about {centsPerPattern(MIDI_PATTERN_COUNT)}¢ a
              pattern
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2.5 md:mt-6 md:flex-row md:items-center md:gap-5">
            <BuyButton
              product={BUNDLE_ID}
              label="Homepage hero"
              className={HERO_BUY_CLASS}
            >
              Get The Complete Vault
            </BuyButton>
            <p className="text-center text-xs text-muted md:text-left md:text-[13px]">
              {REFUND_DAYS}-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
