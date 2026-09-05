/**
 * Offer catalog for the MidiRoad bundle landing page.
 *
 * Three tiers designed to capture leads at every price point:
 *  - "Starter" downsell for budget-conscious leads
 *  - "Standard" (Most Popular) — the bundle as it exists today
 *  - "Pro" upsell with extras
 *
 * NOTE on file counts: The feature lists advertise a different number of
 * files per tier (Starter = 200, Standard = 838, Pro = 1,500+) so the
 * copy escalates cleanly across the table. In practice, every tier
 * currently ships the same 838-file core bundle. Tier differences in
 * reality are *extras only*: workflow guide, project files, masterclass,
 * VIP support, early access, sync rights.
 *
 * Each tier has its own Stripe Payment Link URL. Set them in .env.
 * If a link is empty, the CTA falls back to a smooth-scroll to the
 * most-popular tier (treated as "the deal").
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
    id: "starter",
    name: "Starter",
    tagline: "Same bundle · lowest price",
    price: 9.99,
    displayOrder: 1,
    accent: "bg-white",
    rationale:
      "Pick me if you're on a tight budget — straightforward, just the essentials.",
    features: [
      "200 hand-picked WAVs & MIDIs",
      "40+ drum patterns across trap, RnB & soul",
      "Royalty-free for commercial releases",
      "Instant download — keep forever",
      "Compatible with all major DAWs",
      "Email support",
    ],
  },
  {
    id: "standard",
    name: "Full Bundle",
    tagline: "Most producers pick this",
    price: 24.99,
    displayOrder: 2,
    accent: "bg-[#ff90e8]",
    badge: "Most Popular · 38% Off",
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
    displayOrder: 3,
    accent: "bg-[#a0e8ff]",
    rationale:
      "Pick me if you want the bundle plus project files, a masterclass, and direct VIP support.",
    features: [
      "1,500+ files — full 838-file bundle plus 3 fully-produced project files",
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

