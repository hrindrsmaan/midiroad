import { MIDI_KITS, type MidiKit } from "./midi-kits";

/**
 * Everything MidiRoad sells: six single MIDI kits and the bundle that holds
 * all of them plus the one-shot drum kit.
 *
 * Pricing strategy: each kit is priced on its own, so the bundle's "worth"
 * figure is the real sum of the kits, not an invented anchor. The bundle
 * also includes the one-shots, which are not sold separately.
 *
 * Downloads: each kit's zip (private/kits/<id>.zip) is built from the bundle
 * zip by scripts/split-kits.sh.
 */
export type KitProduct = {
  /** Matches the kit id in midi-kits.json and the zip in private/kits. */
  id: string;
  slug: string;
  name: string;
  /** Short genre/vibe line, shown on cards. */
  vibe: string;
  tagline: string;
  description: string;
  price: number;
  /** Optional real "was" price, shown struck through on cards. */
  originalPrice?: number;
  /** Cover colors until real artwork is added. */
  accent: string;
  accent2: string;
  /** Optional cover art in /public, e.g. "/images/kits/psycho.png". */
  image?: string;
};

export const KIT_PRODUCTS: KitProduct[] = [
  {
    id: "essentials",
    slug: "essentials-vault",
    name: "Essentials Vault",
    vibe: "Every drum part",
    tagline: "The workhorse kit: kicks, snares, hats and 808s for any beat.",
    description:
      "The biggest kit in the collection. Every drum part covered, from bouncy hi-hat rolls to long 808 basslines, across a wide tempo range. Start a beat with any of these and you're halfway there.",
    price: 9.99,
    accent: "#2bd96b",
    accent2: "#0b3d20",
  },
  {
    id: "black-market",
    slug: "black-market-heist",
    name: "Black Market Heist",
    vibe: "Street trap",
    tagline: "Gritty street trap: punchy kicks, hard hats and menacing 808s.",
    description:
      "Built for hard-hitting street trap. Punchy kick patterns, aggressive hi-hats and open hats, and 808s that move with them. Drop it in and the beat already sounds dangerous.",
    price: 7.99,
    accent: "#f5b324",
    accent2: "#3d2a05",
  },
  {
    id: "odyssey",
    slug: "midnight-odyssey",
    name: "Midnight Odyssey",
    vibe: "Melodic trap",
    tagline: "Late-night melodic trap: rolling hats and gliding 808s.",
    description:
      "For moody, spaced-out beats. Rolling hi-hats with plenty of variation, snares and open hats that sit back in the mix, and 808s that glide under melodic loops.",
    price: 6.99,
    accent: "#7c6cff",
    accent2: "#1b1545",
  },
  {
    id: "psycho",
    slug: "psycho-ward",
    name: "Psycho Ward",
    vibe: "Dark horror trap",
    tagline: "Unhinged dark trap: eerie bounce and 808s that hit like a jump scare.",
    description:
      "Dark, off-kilter trap drums. Kicks, snares, hats and open hats with an unsettling bounce, plus 808s built to hit hard. A complete kit for horror-style beats.",
    price: 6.99,
    accent: "#ff3b5c",
    accent2: "#40060f",
  },
  {
    id: "decoy",
    slug: "decoy-protocol",
    name: "Decoy Protocol",
    vibe: "Cold drill",
    tagline: "Cold and calculated: skippy drill hats and sliding 808s.",
    description:
      "Icy, precise drums for drill and dark trap. Skippy hi-hat patterns, tight snares and sliding 808s that keep the groove moving.",
    price: 6.99,
    accent: "#38c8ff",
    accent2: "#062f40",
  },
  {
    id: "focus",
    slug: "focus-808-lab",
    name: "Focus 808 Lab",
    vibe: "808s only",
    tagline: "Nothing but 808 basslines, from 110 to 170 BPM.",
    description:
      "A kit dedicated to the low end. Every file is an 808 pattern with slides and bounce, ready to drag under your drums and load with your favorite 808.",
    price: 4.99,
    accent: "#ff90e8",
    accent2: "#3f0c34",
  },
];

export const BUNDLE_ID = "bundle";
export const BUNDLE_PRICE = 14.99;
export const BUNDLE_NAME = "The Complete Vault";

/** What the six kits cost bought one by one. */
export const KITS_TOTAL =
  Math.round(KIT_PRODUCTS.reduce((n, k) => n + k.price, 0) * 100) / 100;

export function kitBySlug(slug: string) {
  return KIT_PRODUCTS.find((k) => k.slug === slug);
}

export function kitById(id: string) {
  return KIT_PRODUCTS.find((k) => k.id === id);
}

export function midiKitFor(kit: KitProduct): MidiKit {
  const midi = MIDI_KITS.find((m) => m.id === kit.id);
  if (!midi) throw new Error(`No MIDI data for kit ${kit.id}`);
  return midi;
}

export type KitStats = {
  patterns: number;
  parts: string[];
  minBpm: number;
  maxBpm: number;
};

export function kitStats(kit: KitProduct): KitStats {
  const midi = midiKitFor(kit);
  const bpms = midi.parts.flatMap((p) => p.patterns.map((x) => x.bpm));
  return {
    patterns: midi.parts.reduce((n, p) => n + p.patterns.length, 0),
    parts: midi.parts.map((p) => p.label),
    minBpm: Math.min(...bpms),
    maxBpm: Math.max(...bpms),
  };
}

/** Display name for a kit id, falling back to the name in midi-kits.json. */
export function kitDisplayName(id: string, fallback: string) {
  return kitById(id)?.name ?? fallback;
}

/** What a checkout sells, resolved from a product id ("bundle" or a kit id). */
export type Sellable = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** File in /private to download after payment. */
  file: string;
  downloadName: string;
  /** Page to return to if checkout is cancelled. */
  path: string;
};

/**
 * Free, unlisted product for checking the live purchase flow end to end
 * (checkout → email → download) without paying. Bought from /test-checkout.
 */
export const TEST_ID = "test";

/**
 * Upgrade to the bundle after buying a single kit (or the test kit), priced
 * at the difference. Offered only on the success page; /api/checkout checks
 * the original order before selling it.
 */
export const UPGRADE_PREFIX = "upgrade-";

/** The product an upgrade id upgrades from, if it's a valid upgrade. */
export function upgradeBase(id: string): Sellable | undefined {
  if (!id.startsWith(UPGRADE_PREFIX)) return undefined;
  const baseId = id.slice(UPGRADE_PREFIX.length);
  if (baseId === BUNDLE_ID || baseId.startsWith(UPGRADE_PREFIX)) return undefined;
  return sellable(baseId);
}

export function upgradePrice(base: Sellable) {
  return Math.round((BUNDLE_PRICE - base.price) * 100) / 100;
}

export function sellable(id: string): Sellable | undefined {
  const base = upgradeBase(id);
  if (base) {
    const bundle = sellable(BUNDLE_ID)!;
    return {
      ...bundle,
      id,
      name: `${BUNDLE_NAME} – Upgrade`,
      description: `Every other kit plus 77 one-shots, at the difference from your ${base.name.replace(/ – .*$/, "")} order.`,
      price: upgradePrice(base),
    };
  }
  if (id === TEST_ID) {
    return {
      id,
      name: "MidiRoad Test Kit (Free)",
      description: "A free test download: one MIDI file and a README. Used to check checkout, email and download.",
      price: 0,
      file: "test-kit.zip",
      downloadName: "midiroad-test-kit.zip",
      path: "/test-checkout",
    };
  }
  if (id === BUNDLE_ID) {
    return {
      id,
      name: `${BUNDLE_NAME} – All 6 MIDI Kits + 77 One-Shots`,
      description:
        "210 drag-and-drop MIDI drum patterns across 6 kits + 77 one-shot WAVs. Royalty-free, works in any DAW. Instant download.",
      price: BUNDLE_PRICE,
      file: "midiroad.zip",
      downloadName: "midiroad.zip",
      path: "/",
    };
  }
  const kit = kitById(id);
  if (!kit) return undefined;
  const stats = kitStats(kit);
  return {
    id,
    name: `${kit.name} – MIDI Drum Kit`,
    description: `${stats.patterns} drag-and-drop MIDI drum patterns (${stats.minBpm}–${stats.maxBpm} BPM). Royalty-free, works in any DAW. Instant download.`,
    price: kit.price,
    file: `kits/${kit.id}.zip`,
    downloadName: `midiroad-${kit.slug}.zip`,
    path: `/kits/${kit.slug}`,
  };
}
