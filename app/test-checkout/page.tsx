import type { Metadata } from "next";
import { BuyButton, BUY_BUTTON_CLASS } from "@/components/BuyButton";
import { Eyebrow } from "@/components/Section";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { TEST_ID } from "@/lib/products";

/**
 * Unlisted page for testing the live purchase flow with a $0 order:
 * Stripe checkout → success page → email → download.
 */
export const metadata: Metadata = {
  title: "Test checkout",
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
    <main className="min-h-screen bg-canvas">
      <SiteNav />
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-xl space-y-6 rounded-md border border-line bg-card p-6 sm:p-8">
          <div>
            <Eyebrow className="mb-3">Free · $0.00</Eyebrow>
            <h1 className="text-2xl md:text-3xl leading-tight">Test checkout</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Runs a real order through the live site without charging anything.
            </p>
          </div>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-muted">
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
