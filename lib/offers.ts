/**
 * Offer catalog for the MidiRoad bundle landing page.
 *
 * Two tiers: the Full Bundle and a Pro kit with extras. Both ship the same
 * 838-file core; only list extras on a tier that the buyer actually receives.
 * The former "Starter" tier was removed because it sold the identical files
 * for less and advertised a smaller file count than it delivered.
 *
 * Each tier has its own Stripe Payment Link URL. Set them in .env.
 */
export type Offer = {
  id: "starter" | "standard" | "pro";
  name: string;
  tagline: string;
  /** Final amount the customer pays. */
  price: number;
  /** Display order; lower numbers appear first. */
  displayOrder: number;
  /** A short feature list for the card. */
  features: string[];
  /** A line below the price answering "is this enough for me?". */
  rationale: string;
  /** Optional badge above the card name. */
  badge?: string;
  /** Highlight background for the card. */
  accent: string;
};

export const OFFERS: Offer[] = [
  {
    id: "standard",
    name: "Full Bundle",
    tagline: "Everything you need to start",
    price: 24.99,
    displayOrder: 1,
    accent: "bg-[#ff90e8]",
    badge: "Best Value · 38% Off",
    rationale:
      "Pick me if you want the core bundle plus our workflow guide — the tier most producers go with.",
    features: [
      "All 838 WAVs, MIDIs & preset packs",
      "Dark trap, RnB & soul — full coverage",
      "Accurate key labels on every file",
      "Bonus: 14-day producer workflow guide (PDF)",
      "Royalty-free for commercial releases",
      "Instant download — keep forever",
      "Compatible with all major DAWs",
      "Priority email support",
    ],
  },
  {
    id: "pro",
    name: "Producer's Pro Kit",
    tagline: "Bundle + every bonus",
    price: 49.99,
    displayOrder: 2,
    accent: "bg-[#a0e8ff]",
    rationale:
      "Pick me if you want the bundle plus project files, a masterclass, and direct VIP support.",
    features: [
      "Everything in the Full Bundle (incl. workflow guide)",
      "Bonus: 3 fully-produced project files (.als / .flp)",
      "Bonus: MIDI chord progression masterclass",
      "VIP email support — direct line to the team",
      "Early access to future MidiRoad drops",
      "Sync / film rights included",
      "Priority email support",
    ],
  },
];

/** Get a Stripe Payment Link URL for an offer from env, with sensible fallback. */
export function getOfferPaymentLink(id: Offer["id"]): string {
  if (typeof process !== "undefined") {
    const envMap: Record<Offer["id"], string | undefined> = {
      starter: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STARTER,
      standard: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
      pro: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO,
    };
    if (envMap[id]) return envMap[id] as string;
  }
  // Fallbacks to the existing Payment Link so existing customers still work.
  const fallback = "https://buy.stripe.com/test_4gMcN56mH5ABa3p97Za3u00";
  return fallback;
}

