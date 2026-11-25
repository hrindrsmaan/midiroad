/**
 * Kit and tempo-hub links for the result. Fields mirror KIT_PRODUCTS and
 * BPM_RANGES, inlined so this tool does not pull the MIDI catalog into the
 * browser bundle. Links go to catalog pages, never checkout.
 *
 * This file stays free of the analyzer module so the FFT code can load only
 * after a file is dropped.
 */
export type KeyMode = "major" | "minor";
type KitPick = {
  slug: string;
  name: string;
  tagline: string;
};

const KITS = {
  essentials: {
    slug: "essentials-vault",
    name: "Essentials Vault",
    tagline: "The workhorse kit: kicks, snares, hats and 808s for any beat.",
  },
  blackMarket: {
    slug: "black-market-heist",
    name: "Black Market Heist",
    tagline: "Gritty street trap: punchy kicks, hard hats and menacing 808s.",
  },
  odyssey: {
    slug: "midnight-odyssey",
    name: "Midnight Odyssey",
    tagline: "Late-night melodic trap: rolling hats and gliding 808s.",
  },
  psycho: {
    slug: "psycho-ward",
    name: "Psycho Ward",
    tagline: "Unhinged dark trap: eerie bounce and 808s that hit like a jump scare.",
  },
  decoy: {
    slug: "decoy-protocol",
    name: "Decoy Protocol",
    tagline: "Cold and calculated: skippy drill hats and sliding 808s.",
  },
} as const satisfies Record<string, KitPick>;

export type TempoBand = {
  slug: string;
  label: string;
  href: string;
};

export type Suggestion = {
  band: TempoBand;
  /** Pattern hub at double the detected BPM, when the track reads as half-time. */
  doubledBand: TempoBand | null;
  kit: KitPick & { href: string };
  blurb: string;
  cta: string;
};

export function tempoBand(bpm: number): TempoBand {
  const rounded = Math.round(bpm);
  if (rounded < 120) return { slug: "under-120", label: "under 120 BPM", href: "/midi/bpm/under-120" };
  if (rounded < 140) return { slug: "120-139", label: "120–139 BPM", href: "/midi/bpm/120-139" };
  if (rounded < 160) return { slug: "140-159", label: "140–159 BPM", href: "/midi/bpm/140-159" };
  return { slug: "160-plus", label: "160 BPM and up", href: "/midi/bpm/160-plus" };
}

function kitFor(styleBpm: number, mode: KeyMode): KitPick {
  if (mode === "minor" && styleBpm >= 132 && styleBpm < 170) return KITS.decoy;
  if (mode === "minor" && styleBpm >= 100) return KITS.psycho;
  if (styleBpm >= 148) return KITS.blackMarket;
  if (styleBpm >= 100) return KITS.odyssey;
  return KITS.essentials;
}

/**
 * Pick a kit from the tempo a producer would program. When a slow reading has
 * a strong double-time pulse, style follows the faster grid (how trap
 * half-time is written) and the copy says so.
 */
export function suggestFor(input: {
  bpm: number;
  mode: KeyMode;
  tonic: string;
  alternateBpm: number | null;
}): Suggestion {
  const { bpm, mode, tonic, alternateBpm } = input;
  const doubled =
    alternateBpm !== null && alternateBpm > bpm * 1.9 && alternateBpm < bpm * 2.1 && bpm < 100
      ? alternateBpm
      : null;
  const styleBpm = doubled ?? bpm;
  const kit = kitFor(styleBpm, mode);
  const band = tempoBand(bpm);
  const doubledBand = doubled ? tempoBand(doubled) : null;
  const keyName = `${tonic} ${mode}`;
  const tempo = Math.round(bpm);

  const blurb = doubled
    ? `${keyName} at ${tempo} BPM is a half-time feel. Program the project at ${Math.round(doubled)} and the drums still lock. ${kit.name}: ${kit.tagline}`
    : `${keyName} at ${tempo} BPM. ${kit.name}: ${kit.tagline}`;

  return {
    band,
    doubledBand,
    kit: { ...kit, href: `/kits/${kit.slug}` },
    blurb,
    cta: `See ${kit.name}`,
  };
}
