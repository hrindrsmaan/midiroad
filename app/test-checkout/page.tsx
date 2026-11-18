import type { Metadata } from "next";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { BUNDLE_ID, TEST_ID } from "@/lib/products";

/**
 * Unlisted page for testing the live purchase flow with a $0 order:
 * Stripe checkout → success page → email → download.
 */
export const metadata: Metadata = {
  title: "Test checkout | MidiRoad",
  robots: { index: false, follow: false },
};

const STEPS = [
  "Click the button and complete the $0 Stripe checkout with your email. No card is needed.",
  "You land on the success page: the Download button should give you midiroad-test-kit.zip.",
  "Within a minute you get an email with the same download link.",
  "The zip holds one MIDI file and a README saying everything works.",
];

export default function TestCheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0e1014] text-white font-sans">
      <SiteNav product={BUNDLE_ID} cta="Get the Bundle" />
      <section className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-xl mx-auto bg-[#18181b] rounded-md p-6 sm:p-8 space-y-6">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
              Free · $0.00
            </p>
            <h1 className="text-2xl md:text-3xl leading-tight">Test checkout</h1>
            <p className="mt-3 text-sm font-light leading-relaxed text-gray-400">
              Runs a real order through the live site without charging anything.
            </p>
          </div>
          <ol className="space-y-3 list-decimal pl-5 text-sm text-gray-300">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <BuyButton product={TEST_ID} label="Test Checkout" className={BUY_BUTTON_CLASS}>
            Get the free test kit
          </BuyButton>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
