import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { BUNDLE_NAME, BUNDLE_PRICE, KIT_PRODUCTS, kitStats, type KitProduct } from "@/lib/products";

/**
 * Site identity for search engines and AI assistants: the canonical origin,
 * and the structured data (schema.org JSON-LD) that describes the store.
 */
export const SITE_URL = "https://midiroad.com";
export const SITE_NAME = "MidiRoad";
export const SITE_DESCRIPTION = `Royalty-free MIDI drum kits for trap, drill and RnB producers: ${MIDI_PATTERN_COUNT} drag-and-drop MIDI drum patterns and ${ONE_SHOT_COUNT} drum one-shots for FL Studio, Ableton, Logic and any DAW, plus a free trap beat maker.`;

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

/** Social share image, also used as the product image in structured data. */
export const SHARE_IMAGE = absoluteUrl("/opengraph-image");
export const BUNDLE_IMAGE = absoluteUrl("/images/bundle-poster.png");

const ORG_ID = absoluteUrl("/#organization");

const offer = (price: number, url: string) => ({
  "@type": "Offer",
  price: price.toFixed(2),
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  url,
  seller: { "@id": ORG_ID },
});

/** Who runs the site and what it is; on every page. */
export const siteJsonLd = () => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/midiroad-logo.png"),
    email: "support@inbox.midiroad.com",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  },
];

/** The bundle, for the home page. */
export const homeJsonLd = () => [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${BUNDLE_NAME} – MIDI Drum Kit Bundle`,
    description: `All ${KIT_PRODUCTS.length} MidiRoad MIDI drum kits in one download: ${MIDI_PATTERN_COUNT} royalty-free MIDI drum patterns and ${ONE_SHOT_COUNT} drum one-shots for trap, drill and RnB. Works in FL Studio, Ableton Live, Logic Pro and any DAW.`,
    image: BUNDLE_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "MIDI drum kits",
    url: SITE_URL,
    offers: offer(BUNDLE_PRICE, SITE_URL),
  },
];

/** The free beat maker, for its own page. */
export const beatMakerJsonLd = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MidiRoad Free Trap Beat Maker",
    url: absoluteUrl("/beat-maker"),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (runs in the browser)",
    description:
      "Generate a trap drum beat (hi-hats, snare, kick and 808) in one click, change tempo, key and sounds, mute parts, and export the MIDI to your DAW as one file or one track at a time.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
  },
];

/** One kit's product page. */
export const kitJsonLd = (kit: KitProduct) => {
  const url = absoluteUrl(`/kits/${kit.slug}`);
  const stats = kitStats(kit);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${kit.name} – MIDI Drum Kit`,
      description: `${kit.tagline} ${stats.patterns} royalty-free MIDI drum patterns (${stats.parts.join(", ")}), ${stats.minBpm}–${stats.maxBpm} BPM, for FL Studio, Ableton, Logic and any DAW.`,
      image: SHARE_IMAGE,
      brand: { "@type": "Brand", name: SITE_NAME },
      category: "MIDI drum kits",
      url,
      offers: offer(kit.price, url),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "MIDI drum kits", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: kit.name, item: url },
      ],
    },
  ];
};

/** FAQ answers as structured data, from the same list the page shows. */
export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
