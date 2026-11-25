import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import type { FaqItem } from "@/lib/faq";
import { FREE_KIT_COUNT } from "@/lib/free-kit";
import { PLANS } from "@/lib/plans";
import { BUNDLE_NAME, BUNDLE_PRICE, KIT_PRODUCTS } from "@/lib/products";
import { formatUSD } from "@/lib/pricing";
import { absoluteUrl } from "@/lib/site";

/**
 * Buyer-intent pages: alternatives, comparisons, a best-of list, and
 * DAW / genre buying guides.
 *
 * Competitor facts are taken from the public pages in `sources`, checked
 * November 2026. If a page doesn't say it, it isn't claimed here. Prices
 * move with sales, so cells say "when we checked" and every page carries
 * a trademark disclaimer. MidiRoad figures come from the catalog, not from
 * copy, so they stay in step with the kits.
 */

export const CHECKED = "November 2026";

export const COMPARE_HUB = "/compare";
export const ALTERNATIVES_HUB = "/alternatives";
export const BEST_PATH = "/best-midi-drum-kits";
export const TRAP_BUY_PATH = "/trap-midi-drum-kits";
export const DRILL_BUY_PATH = "/drill-midi-drum-kits";

export const COMPARE_FEATURES = [
  "Price model",
  "Patterns",
  "Browser preview",
  "Royalty-free terms",
  "DAW support",
  "Free tools",
] as const;

export type CompareFeature = (typeof COMPARE_FEATURES)[number];

export type SourceLink = { label: string; href: string };

export type CompetitorSlug = "unison" | "splice" | "cymatics" | "ghosthack" | "toontrack";

export type Competitor = {
  slug: CompetitorSlug;
  name: string;
  product: string;
  /** Product page we treat as the primary source. */
  href: string;
  sources: SourceLink[];
  /** Two sentences for the index cards. */
  blurb: string;
  /** Their side of the comparison table, same order as COMPARE_FEATURES. */
  cells: string[];
  chooseThem: string[];
  chooseUs: string[];
  /** A second set, so the comparison page doesn't repeat the alternative page. */
  decideThem: string[];
  decideUs: string[];
  alternativeFaqs: FaqItem[];
  compareFaqs: FaqItem[];
  alternative: { metaTitle: string; description: string; h1: string; lede: string };
  compare: { metaTitle: string; description: string; h1: string; lede: string };
};

const plan = PLANS[0];
const kitPrices = KIT_PRODUCTS.map((kit) => kit.price);
export const LOWEST_KIT_PRICE = Math.min(...kitPrices);
export const HIGHEST_KIT_PRICE = Math.max(...kitPrices);
const kitLow = LOWEST_KIT_PRICE;
const kitHigh = HIGHEST_KIT_PRICE;

/** MidiRoad's side of every comparison table. Built from the catalog. */
export function ourCells(): string[] {
  return [
    `One-time kits ${formatUSD(kitLow)}–${formatUSD(kitHigh)}, or ${BUNDLE_NAME} at ${formatUSD(BUNDLE_PRICE)} for all ${KIT_PRODUCTS.length} kits. Optional credit plans from ${formatUSD(plan.monthly)}/month (${plan.credits} single files). A kit doesn't need a subscription.`,
    `${MIDI_PATTERN_COUNT} drum patterns, split into hi-hats, snares, kicks, open hats and 808s, across trap, street trap, melodic trap, dark trap, drill and 808 bass. ${BUNDLE_NAME} also includes ${ONE_SHOT_COUNT} one-shots.`,
    "Yes. Every pattern has its own page and plays in the browser before you buy.",
    "Royalty-free for your songs and beats, including commercial releases. No credit required. You can't resell or share the raw MIDI or WAV files.",
    "Standard .mid and WAV in FL Studio, Ableton Live, Logic Pro, Studio One, Reason, Cubase, Pro Tools, Maschine, and any DAW that opens MIDI.",
    `A free trap beat maker, a chord maker, and a BPM and key finder. The free starter kit is ${FREE_KIT_COUNT} patterns for an email address.`,
  ];
}

export function comparisonRows(competitor: Competitor) {
  const ours = ourCells();
  return COMPARE_FEATURES.map((feature, index) => ({
    feature,
    ours: ours[index],
    theirs: competitor.cells[index],
  }));
}

export const COMPETITORS: Competitor[] = [
  {
    slug: "unison",
    name: "Unison",
    product: "Trap MIDI Drum Collection",
    href: "https://unison.audio/product/unison-trap-midi-drum-collection/",
    sources: [
      {
        label: "Unison Trap MIDI Drum Collection",
        href: "https://unison.audio/product/unison-trap-midi-drum-collection/",
      },
      {
        label: "Unison Hip Hop & Rap MIDI Drum Collection",
        href: "https://unison.audio/product/unison-hip-hop-rap-midi-drum-collection/",
      },
      {
        label: "Unison Future Bass & Melodic Trap MIDI Drum Collection",
        href: "https://unison.audio/product/unison-future-bass-melodic-trap-midi-drum-collection/",
      },
    ],
    blurb:
      "Unison sells one-time MIDI drum collections by genre. The trap collection is described as 50 kits and 250+ drag-and-drop patterns, royalty-free, for any DAW, and it was listed at $17 when we checked.",
    cells: [
      "One-time collection. The trap pack was listed at $17 when we checked. Unison discounts collections, and other genres are sold as separate packs, so confirm the current price.",
      "The trap page says 50 MIDI drum kits and 250+ patterns. A Future Bass & Melodic Trap collection and a Hip Hop & Rap collection are separate products, each also described as 250+ patterns.",
      "No per-pattern player on the product page we checked. You audition the MIDI in your DAW after download.",
      "Their FAQ says the MIDI is 100% royalty-free and cleared for commercial use, including beats you sell and releases on Spotify, YouTube and iTunes.",
      "Drag-and-drop .mid, no install. Their FAQ lists Ableton, FL Studio, Logic Pro, Studio One, Pro Tools, Cubase, Reason, Reaper, GarageBand, Cakewalk, Mixcraft and other DAWs.",
      "The trap collection page is a download, not a browser instrument. Unison's site also has free sample packs; those aren't part of this drum collection.",
    ],
    chooseThem: [
      "You want one large trap MIDI folder. Their page advertises 250+ patterns, which is more trap files than MidiRoad's trap kit.",
      "You already have drum samples, so a MIDI-only download is what you need.",
      "You want their other genre collections too (they sell hip-hop, future bass and melodic trap, drum and bass, lo-fi and more as separate packs).",
      "The 60-day refund on the trap page matters to you.",
    ],
    chooseUs: [
      "You want to hear each hat, snare, kick and 808 in the browser before you pay.",
      "You want trap, street trap, melodic trap, dark trap, drill and 808s in one catalog, plus one-shots in the bundle.",
      "You want a free starter kit and a beat maker, not only a zip file.",
      "You'd rather start from a single kit between $4.99 and $9.99 than a 250-file folder.",
    ],
    decideThem: [
      "Raw count in one trap folder is the priority, and you don't need to preview file by file.",
      "You're collecting their genre series and this is the trap volume.",
    ],
    decideUs: [
      "Preview, a drill kit, and one-shots in the bundle matter more than the biggest single folder.",
      "You want the drums and a free way to sketch a beat in the browser.",
    ],
    alternativeFaqs: [
      {
        q: "Is MidiRoad the same kind of product as Unison's trap drum collection?",
        a: "Both sell royalty-free MIDI drum patterns you drag into a DAW and play with your own samples. Unison's Trap MIDI Drum Collection is one genre folder they describe as 250+ patterns in 50 kits. MidiRoad is six kits, 210 patterns, covering trap, street trap, melodic trap, dark trap, drill and 808s, and every pattern plays in the browser first.",
      },
      {
        q: "Does the Unison trap pack include drum sounds?",
        a: "The trap collection page describes MIDI files you use with your own drum samples. It doesn't list WAV one-shots in the pack. MidiRoad's single kits are MIDI too. The Complete Vault adds 77 drum one-shots.",
      },
      {
        q: "How much is the Unison Trap MIDI Drum Collection?",
        a: "It was listed at $17 when we checked in November 2026. Unison discounts collections, so the price on the page can be lower. MidiRoad kits are a one-time $4.99 to $9.99, and The Complete Vault is $14.99.",
      },
      {
        q: "Will either pack work in FL Studio?",
        a: "Yes. Unison's FAQ lists FL Studio, Ableton, Logic and other DAWs, and the files are drag-and-drop MIDI with no plugin to install. MidiRoad files are standard .mid as well. Mapping them in FL Studio is covered in our FL Studio guide.",
      },
      {
        q: "Can I release songs made with these patterns?",
        a: "Unison's FAQ says the MIDI is royalty-free for commercial releases and for beats you sell. MidiRoad is royalty-free for your own songs and beats, including commercial releases, and you can't resell the raw files. Read the license that comes with a download before you resell MIDI or put it in a sample pack.",
      },
    ],
    compareFaqs: [
      {
        q: "Who lists more trap drum patterns?",
        a: "Unison's trap page says 250+ patterns. MidiRoad's trap kit, Essentials Vault, is smaller than that, and the whole MidiRoad catalog is 210 patterns across six styles. The counts aren't identical units: MidiRoad splits hats, snares, kicks and 808s into separate files, and Unison describes 50 kits inside the 250+.",
      },
      {
        q: "Can I hear the patterns before I pay?",
        a: "On MidiRoad, yes. Each pattern has a page and plays in the browser. On the Unison trap page we checked, you buy the folder and open the MIDI in your DAW.",
      },
      {
        q: "Do I need a plugin for either one?",
        a: "No. Unison says there's no installation, on Mac or PC. MidiRoad is .mid and WAV. Packs built around EZdrummer are a different company (Toontrack), not Unison.",
      },
      {
        q: "What if I want chords as well as drums?",
        a: "Unison sells a separate MIDI Chord Pack of fixed files. That's a different product from their drum collections, and the homepage compares it with MidiRoad's chord maker. Drum kits on MidiRoad are their own purchase; chord downloads sit on a plan.",
      },
      {
        q: "What's the refund window?",
        a: "Unison's trap page offers 60 days if you email them. MidiRoad refunds within 30 days if you email support@inbox.midiroad.com. Use the policy written at checkout; either one can change.",
      },
    ],
    alternative: {
      metaTitle: "Best Unison Alternative for MIDI Drums",
      description:
        "See how Unison's Trap MIDI Drum Collection compares with MidiRoad: price, pattern counts, browser preview, royalty-free terms and DAWs.",
      h1: "Best Unison alternative for MIDI drums",
      lede: "Unison's Trap MIDI Drum Collection is the closest product on this page to a MidiRoad kit: royalty-free drum MIDI, one payment, any DAW. Their page advertises a bigger trap folder than we sell. The reason to look at MidiRoad anyway is that you can play every hat, snare, kick and 808 in the browser before you pay, and drill ships as its own kit.",
    },
    compare: {
      metaTitle: "MidiRoad vs Unison for MIDI Drums",
      description:
        "MidiRoad vs Unison MIDI drums: price, pattern counts, browser preview, royalty-free terms, DAWs and free tools, from their product page.",
      h1: "MidiRoad vs Unison MIDI drums",
      lede: "Unison and MidiRoad both sell trap drum MIDI you drop into a session. They don't sell the same shape of product. Unison's trap collection is one large folder, listed at $17 when we checked, described as 250+ patterns. MidiRoad is a smaller catalog you can preview file by file, with drill, several trap flavors, and one-shots in the bundle.",
    },
  },
  {
    slug: "splice",
    name: "Splice",
    product: "Splice Sounds MIDI",
    href: "https://splice.com/plans",
    sources: [
      { label: "Splice plans and pricing", href: "https://splice.com/plans" },
      {
        label: "What are MIDI files? (Splice Help Center)",
        href: "https://support.splice.com/en/articles/8652633-what-are-midi-files-how-do-i-use-them-in-my-music",
      },
      {
        label: "How do credits work? (Splice Help Center)",
        href: "https://support.splice.com/en/articles/8652639-how-do-credits-work",
      },
      {
        label: "Splice Sounds licensing FAQ",
        href: "https://support.splice.com/en/articles/8652642-splice-sounds-licensing-faq",
      },
    ],
    blurb:
      "Splice is a subscription catalog of samples, presets and MIDI, not a trap drum kit. MIDI usually costs up to 3 credits, previews in the browser, and stays licensed after you cancel. Sounds was $12.99/month when we checked.",
    cells: [
      "Monthly subscription with credits. When we checked, Sounds was $12.99/month and Creator was $19.99/month with a $4.99 trial offer. Samples are 1 credit. MIDI and presets are up to 3. Unused credits roll over while you stay subscribed.",
      "No single trap-drum count. Many packs include MIDI. Splice's help center describes those files as note sequences such as basslines, melodies and chord progressions. Drum MIDI shows up inside some packs, mixed with samples.",
      "Yes. Files preview in the browser. Splice says the audio you hear for a MIDI file is an example instrument, not sound stored in the file.",
      "Royalty-free for commercial use of sounds you download, and the license stays if you cancel. You can't redistribute the files on their own or in a new sample pack. Their FAQ notes many distributors still want third-party material disclosed.",
      "Any DAW. The plans page also lists a Bridge plugin, and in-DAW integrations for Pro Tools 2025.6+, Studio One 7+, and Ableton Live 12.3 (in beta when we checked).",
      "Previews are free. Downloads need credits. The plans page offered a Creator trial. Not a free trap drum-kit download, and not a browser beat maker.",
    ],
    chooseThem: [
      "You download samples, presets and MIDI across a lot of genres every month, so a credit plan earns its keep.",
      "You want one file at a time from a large catalog, not a finished drum kit.",
      "You want Splice inside the DAW (Bridge, or the integrations they list for recent Pro Tools, Studio One and Live).",
    ],
    chooseUs: [
      "You want trap and drill drum patterns as the product, owned after one payment.",
      "You don't want a subscription just to get hats and 808s.",
      "You want a free starter kit and a beat maker that exports MIDI without credits.",
    ],
    decideThem: [
      "Your month includes one-shots, loops and presets, and drum MIDI is only part of it.",
      "You're fine paying per file in credits and re-downloading from your library.",
    ],
    decideUs: [
      "A kit of drum patterns, with a player on every file, is the whole job.",
      "You want the price capped: one kit, or the bundle, and you're done.",
    ],
    alternativeFaqs: [
      {
        q: "Is MidiRoad a Splice alternative?",
        a: "For trap and drill drum MIDI, it can stand in for digging through Splice packs. Splice is a subscription catalog of samples, presets and MIDI from many labels. MidiRoad is a small store of drum kits you buy once. If you want presets, one-shots from a huge catalog, and new packs on a schedule, Splice is built for that and MidiRoad isn't.",
      },
      {
        q: "How do Splice MIDI downloads work?",
        a: "Splice's help center says MIDI files usually cost up to 3 credits and download through the browser. The preview is an example instrument. Samples cost 1 credit. Credits come with a subscription and roll over while you stay subscribed. Re-downloading a MIDI file from the original pack page costs 0 credits.",
      },
      {
        q: "Do I keep Splice files if I cancel?",
        a: "Splice says the license on sounds you downloaded is perpetual. Their plans FAQ says you can keep using your library and re-download samples already in it, and that remaining credits expire 28 days after the final billing period unless you resubscribe. MidiRoad kits are a one-time download with an email link, and there's no subscription to cancel.",
      },
      {
        q: "Are Splice sounds royalty-free?",
        a: "Their license FAQ says yes, for sounds you download, for commercial and non-commercial use. You can't redistribute those files on their own or in a new sample pack. They also note that many distributors still ask you to disclose third-party material, and that Splice can provide a certified license for that.",
      },
      {
        q: "Does Splice sell a trap drum kit?",
        a: "Not as one product with a pattern count we can quote. You search packs. Their MIDI article talks about basslines, melodies and chord progressions. Some packs include drum MIDI, but Splice doesn't publish a single number for trap drum patterns, so we don't invent one.",
      },
    ],
    compareFaqs: [
      {
        q: "Which is cheaper if I only need drum MIDI?",
        a: "A MidiRoad kit is one payment from $4.99 to $9.99, or $14.99 for every kit. Splice Sounds was $12.99/month when we checked, and a MIDI file can take up to 3 credits. The subscription is the better deal if you also download samples and presets all month. The kit is the better deal if you want one drum library and then stop paying.",
      },
      {
        q: "Can I preview MIDI on both sites?",
        a: "Yes. Splice plays an example in the browser and says that audio is not what's inside the MIDI file. MidiRoad plays each drum pattern on its own page, using MidiRoad one-shots, before you buy.",
      },
      {
        q: "Which DAWs work?",
        a: "Both work in any DAW that opens MIDI. Splice also offers Bridge and, on the plans page we checked, integrations for recent Pro Tools, Studio One and Ableton Live. MidiRoad doesn't need a plugin.",
      },
      {
        q: "Can I put the results on Spotify?",
        a: "Both licenses allow commercial releases of music you make. Splice's FAQ says you own the new recording, not the underlying sounds, and you can't resell those sounds as samples. MidiRoad is royalty-free for your songs and beats, and the raw files aren't for resale.",
      },
      {
        q: "What happens to unused Splice credits?",
        a: "They roll over while the subscription stays active. The plans FAQ says they expire 28 days after the final billing period if you cancel, unless you resubscribe. You can also put a plan on hold. MidiRoad credits, on the optional plans, are a separate system: 1 credit is 1 MIDI file, and buying a kit doesn't use them.",
      },
    ],
    alternative: {
      metaTitle: "Best Splice Alternative for MIDI Drums",
      description:
        "Splice is a credit subscription for samples and MIDI. Here's when a one-time MidiRoad trap or drill kit is the closer buy.",
      h1: "Best Splice alternative for MIDI drums",
      lede: "Splice isn't a drum kit. It's a subscription library: samples, presets and MIDI, paid for with monthly credits. People look for a Splice alternative when they want trap or drill drums without keeping a plan. MidiRoad is that narrower thing: royalty-free drum patterns you buy once and preview in the browser.",
    },
    compare: {
      metaTitle: "MidiRoad vs Splice for MIDI Drums",
      description:
        "MidiRoad vs Splice for drum MIDI: a one-time kit against subscription credits, with preview, license and DAW notes from Splice's docs.",
      h1: "MidiRoad vs Splice for MIDI drums",
      lede: "Splice and MidiRoad overlap on one job only: getting MIDI into a session. Splice sells access to a catalog. MidiRoad sells drum kits. The useful comparison is what you pay, what a 'MIDI file' means on each site, and what you're allowed to release.",
    },
  },
  {
    slug: "cymatics",
    name: "Cymatics",
    product: "APEX MIDI",
    href: "https://cymatics.fm/pages/apex-midi-2025",
    sources: [
      { label: "Cymatics APEX MIDI (2025)", href: "https://cymatics.fm/pages/apex-midi-2025" },
    ],
    blurb:
      "Cymatics APEX MIDI is a melody and chord collection, not a drum kit. The page describes 2,600+ royalty-free MIDI files across 12 genres, including trap and drill libraries, with individual collections listed at $20 when we checked.",
    cells: [
      "One-time. On the APEX overview, individual genre collections (Trap, Drill, RnB and others) were listed at $20 each. Bundle offers on that page change, so we aren't quoting a bundle price.",
      "The page says 2,600+ MIDI files in 12 genres, including Trap and Drill. Those trap and drill files are described as chord progressions, top lines and melodies to sit over drums and 808s, not as drum patterns.",
      "Named melody demos play on the sales page, with the key listed. There isn't a drum-pattern browser.",
      "The page says the melodies are 100% royalty-free for your own sample packs, beat sales, placements and sync licensing.",
      "The page says the MIDI works in any DAW. Plugins included with some offers are VST/AU on Windows and Mac, which is separate from the MIDI files.",
      "Some APEX editions bundle one-shots, a reverb plugin and a melody course. Those are part of the paid offer. No browser beat maker, and the MIDI itself isn't a drum kit.",
    ],
    chooseThem: [
      "You need chord progressions and top lines for trap, drill, RnB, lo-fi or the other genres in APEX.",
      "You already have drums, and the missing piece is the melody.",
      "You want MIDI their page clears for beat sales, placements and sync.",
    ],
    chooseUs: [
      "You need hi-hats, snares, kicks and 808s, not chords.",
      "You want to preview drum grooves one pattern at a time.",
      "You're buying a drum kit and a melody pack is a different line on the receipt.",
    ],
    decideThem: [
      "The beat is stuck on harmony, and a folder of trap or drill progressions would unblock it.",
      "You're comparing melody packs, not drum kits. APEX is the melody pack.",
    ],
    decideUs: [
      "The beat is stuck on drums. A chord pack won't program the hats.",
      "You want drill drum patterns specifically, which APEX doesn't sell.",
    ],
    alternativeFaqs: [
      {
        q: "Is Cymatics APEX a drum kit?",
        a: "No. The APEX MIDI page describes 2,600+ melody and chord files across 12 genres, including trap and drill. Those files are progressions and top lines meant to sit over drums and 808s. MidiRoad is the drums.",
      },
      {
        q: "Is MidiRoad a Cymatics alternative?",
        a: "Only for the drum part of the beat. If you came for Cymatics melodies, their trap and drill MIDI collections are the closer product, and a drum kit doesn't replace them. Plenty of producers use melody MIDI from one place and drum MIDI from another.",
      },
      {
        q: "What do the Cymatics genre packs cost?",
        a: "On the APEX overview we checked, each genre collection was listed at $20. Bundle prices on that offer change, so read the page. MidiRoad kits are $4.99 to $9.99, or $14.99 for every kit.",
      },
      {
        q: "Can I sell beats made with Cymatics MIDI?",
        a: "Their APEX page says the melodies are royalty-free for your own sample packs, beat sales, placements and sync licensing. MidiRoad is royalty-free for your songs and beats, and you can't resell the raw files. Neither sentence is the full license. Read the terms that come with the download.",
      },
      {
        q: "Can I hear the MIDI before buying?",
        a: "Cymatics posts named melody demos on the sales page. MidiRoad has a separate page for every drum pattern, with a player.",
      },
    ],
    compareFaqs: [
      {
        q: "Which one has trap drum patterns?",
        a: "MidiRoad. Cymatics describes its trap MIDI in APEX as dark chord progressions and top lines for trap, not as hi-hat rolls and kicks.",
      },
      {
        q: "Does Cymatics include drill?",
        a: "Yes, as a melody library. The APEX page describes drill MIDI as haunting melodies and phrasing to layer over drill drums. The drums still have to come from a kit or from drum MIDI.",
      },
      {
        q: "Are the files royalty-free?",
        a: "Cymatics says the APEX melodies are royalty-free, including for beat sales, placements and sync. MidiRoad says its drums are royalty-free for your own releases, and not for reselling the raw files.",
      },
      {
        q: "Will they open in Logic and FL Studio?",
        a: "Cymatics says the MIDI is compatible with any DAW. MidiRoad files are standard .mid. A plugin bundled with a Cymatics offer is a separate VST/AU install. The MIDI file isn't a plugin.",
      },
      {
        q: "Can I try MidiRoad drums without buying a melody pack?",
        a: "Yes. Twelve patterns are free for an email address, and every paid pattern previews on the site. The beat maker exports a trap beat as MIDI.",
      },
    ],
    alternative: {
      metaTitle: "Best Cymatics Alternative for MIDI Drums",
      description:
        "Cymatics APEX MIDI is trap and drill melody files, not drum patterns. Here's when a MidiRoad drum kit is the closer buy.",
      h1: "Best Cymatics alternative for MIDI drums",
      lede: "Cymatics is where a lot of producers go for MIDI, and the APEX collection is a fair thing to compare. It is not a drum kit. The page sells melody and chord MIDI, including trap and drill libraries, to lay over drums you already have. If the thing you actually need is hats, snares, kicks and 808s, that's the job MidiRoad is built for.",
    },
    compare: {
      metaTitle: "MidiRoad vs Cymatics MIDI",
      description:
        "MidiRoad vs Cymatics APEX MIDI: drum patterns against trap and drill melody packs, with price, license, preview and DAW notes.",
      h1: "MidiRoad vs Cymatics MIDI",
      lede: "These two don't compete for the same lane, and pretending they do wastes a purchase. Cymatics APEX is progressions and top lines. MidiRoad is drum patterns. This page puts the public facts next to each other so you can buy the one that fills the hole in the beat, or both.",
    },
  },
  {
    slug: "ghosthack",
    name: "Ghosthack",
    product: "Trap Drums",
    href: "https://www.ghosthack.de/trap-drums",
    sources: [
      { label: "Ghosthack Trap Drums", href: "https://www.ghosthack.de/trap-drums" },
      { label: "Ghosthack UK Drill Essentials", href: "https://www.ghosthack.de/uk-drill-essentials" },
    ],
    blurb:
      "Ghosthack Trap Drums is a sample pack with MIDI attached: 40 kits, loops, stems and one-shots from 120–160 BPM, plus 215 MIDI files. It was listed at €37 including VAT when we checked, and the sounds are royalty-free.",
    cells: [
      "One-time pack. Trap Drums was listed at €37 including VAT when we checked. Ghosthack runs sales, so the figure on the page can be lower. Currency can also depend on where the store loads.",
      "215 MIDI files, plus the audio: 40 drum kits, full loops, 256 stem loops and one-shots (hats, snares, kicks, 808s and more), from 120 to 160 BPM. The MIDI goes with those kits. It isn't a drums-only pattern library.",
      "Kit and loop demos play on the product page. Individual MIDI files open in your DAW.",
      "The page says the sounds are 100% royalty-free for commercial projects, including Spotify, YouTube and Apple Music, films, games, videos and podcasts, and that you keep your royalties. 30-day refund.",
      "WAV and .mid. Ghosthack says the WAV files work in virtually every DAW, with no plugin required.",
      "Demos on the product page are free to play. The pack is a paid download. No browser beat maker or BPM finder on that page.",
    ],
    chooseThem: [
      "You want the sound, not just the rhythm: loops, stems and one-shots that are already processed.",
      "You want MIDI that matches those exact kits, so you can swap a sound and keep the groove.",
      "A 30-day refund and a commercial license that names film, games and podcasts is what you need.",
    ],
    chooseUs: [
      "You already have drums, and you want patterns to play on them.",
      "You want to audition every pattern in the browser, part by part.",
      "You want a drill kit in the same catalog, and a lower one-time price for MIDI than their Trap Drums pack.",
    ],
    decideThem: [
      "A full loop you can drop on the timeline is more useful today than a silent MIDI file.",
      "You're buying the one-shots and the stems, and the MIDI is a bonus.",
    ],
    decideUs: [
      "Another loop pack would sit unused next to drums you already like.",
      "You want drill patterns and trap patterns from the same store, with a player on each file.",
    ],
    alternativeFaqs: [
      {
        q: "What is Ghosthack Trap Drums?",
        a: "A trap sample pack: 40 drum kits with full loops, stems and one-shots, from 120 to 160 BPM, plus 215 MIDI files that go with those kits. It was listed at €37 including VAT when we checked in November 2026.",
      },
      {
        q: "Is MidiRoad the same kind of pack?",
        a: "No. MidiRoad kits are MIDI drum patterns, and The Complete Vault adds 77 one-shots. You play the MIDI with your own drums or with those one-shots. Ghosthack is the processed audio and the MIDI together. Buy Ghosthack if you want their loops. Buy MidiRoad if you want patterns you can audition one file at a time.",
      },
      {
        q: "How many MIDI files are in Trap Drums?",
        a: "The contents list says 215 MIDI files, along with 40 full kits, 256 stem loops and the one-shots. MidiRoad's catalog is 210 patterns, split by drum part, across six styles, including a separate drill kit.",
      },
      {
        q: "Are Ghosthack sounds cleared for Spotify?",
        a: "Their page says the files are royalty-free for commercial projects, including Spotify, YouTube and Apple Music, and that you keep your royalties. They offer a 30-day refund. MidiRoad is royalty-free for your releases, with a 30-day refund, and you can't resell the raw files.",
      },
      {
        q: "Does Trap Drums need a plugin?",
        a: "No. Ghosthack says the WAV files drag into virtually any DAW. The MIDI is standard .mid. MidiRoad works the same way.",
      },
    ],
    compareFaqs: [
      {
        q: "Which should I buy if I already have drum samples?",
        a: "A MIDI kit. You don't need another library of loops to program a beat you can already sound. Ghosthack's value is the audio that comes with the MIDI.",
      },
      {
        q: "Which should I buy if I want a loop to start from?",
        a: "Ghosthack. The full loops and stems already contain the drum sound. A MidiRoad pattern is silent until a sampler plays it.",
      },
      {
        q: "Can I preview before buying?",
        a: "Ghosthack plays kit demos on the product page. MidiRoad plays every pattern on its own page, with the notes routed to hi-hat, snare, kick or 808.",
      },
      {
        q: "Is there drill MIDI in Trap Drums?",
        a: "That pack is labeled trap and hip-hop, 120 to 160 BPM. It isn't labeled drill. Ghosthack's UK Drill Essentials is a different product: mostly samples, with 20 MIDI files and five construction kits at 140 to 160 BPM. MidiRoad's drill patterns are the Decoy Protocol kit.",
      },
      {
        q: "What does the whole thing cost?",
        a: "Ghosthack Trap Drums was €37 including VAT on the page we loaded, and they discount packs. MidiRoad's six kits together are The Complete Vault at $14.99, which is MIDI plus 77 one-shots, not a gigabyte of loops. Compare the contents, not just the number.",
      },
    ],
    alternative: {
      metaTitle: "Best Ghosthack Alternative for MIDI Drums",
      description:
        "Ghosthack Trap Drums is loops, stems and 215 MIDI files. Here's when that pack fits, and when a MidiRoad kit is the closer buy.",
      h1: "Best Ghosthack alternative for MIDI drums",
      lede: "Ghosthack Trap Drums is a trap sample pack that happens to include a lot of MIDI. That's a great pack if you want their loops and one-shots. It's the wrong pack if you only wanted the rhythms and you already have a drum kit you like. MidiRoad is the second case: patterns, a player on every file, and a separate drill kit.",
    },
    compare: {
      metaTitle: "MidiRoad vs Ghosthack Trap Drums",
      description:
        "MidiRoad vs Ghosthack Trap Drums: MIDI patterns against loops, stems and 215 MIDI files, with price, preview, license and DAWs.",
      h1: "MidiRoad vs Ghosthack Trap Drums",
      lede: "Ghosthack Trap Drums and MidiRoad both say trap, and both include MIDI. One is a sample pack with matching MIDI. The other is a MIDI catalog you preview in the browser. The price gap is real, and so is the gap in what's inside the zip.",
    },
  },
  {
    slug: "toontrack",
    name: "Toontrack",
    product: "Hip-Hop Grooves MIDI",
    href: "https://www.toontrack.com/product/hip-hop-grooves-midi/",
    sources: [
      {
        label: "Toontrack Hip-Hop Grooves MIDI",
        href: "https://www.toontrack.com/product/hip-hop-grooves-midi/",
      },
      {
        label: "Toontrack: MIDI pack vs EZX",
        href: "https://www.toontrack.com/faq/what-is-the-difference-between-a-midi-pack-and-an-ezx/",
      },
    ],
    blurb:
      "Toontrack Hip-Hop Grooves MIDI is session-drummer MIDI for EZdrummer and Superior Drummer: about 70 tracks with variations, from boom bap to trap, 73–125 BPM, listed at $29. The pack contains no sounds.",
    cells: [
      "One-time MIDI add-on, listed at $29. It's optimized for EZdrummer and Superior Drummer, which are sold separately.",
      "Grooves from about 70 tracks, with variations, played by a session drummer. Styles include boom bap, G-funk, new jack swing, old-school rap and trap. Tempos run from 73 to 125 BPM, in 4/4, straight, swing or halftime. The page says the pack contains no sounds.",
      "Demos on the product page are the MIDI played through EZdrummer or Superior Drummer. There isn't a pattern-by-pattern browser for trap hats and 808s.",
      "The product page we checked does not state a royalty-free license. Read Toontrack's terms before you release a record. We aren't guessing what they allow.",
      "Optimized for EZdrummer and Superior Drummer. Their FAQ says the installer needs EZdrummer 2 or 3, or Superior Drummer 2 or 3. Without those, you extract the .mid files and play them on another instrument.",
      "A groove library for their drum software. Not a trap one-shot kit, and not a free browser tool.",
    ],
    chooseThem: [
      "You own EZdrummer or Superior Drummer and want grooves played by a drummer, with human timing.",
      "You write boom bap, G-funk, new jack or other hip-hop feels, not only programmed trap.",
      "Tempos between 73 and 125 BPM are where your tracks sit.",
    ],
    chooseUs: [
      "You want programmed trap and drill: hat rolls and 808 lines, not a live kit performance.",
      "You don't own EZdrummer or Superior Drummer.",
      "You want a stated royalty-free license, browser previews, and one-shots in the bundle.",
    ],
    decideThem: [
      "The feel you want is a person playing, inside Toontrack's drum software.",
      "Trap is one color in a wider hip-hop palette, and 125 BPM is fast enough.",
    ],
    decideUs: [
      "You're programming 808s and hat rolls, and a live-kit groove won't sit in that beat.",
      "You need a license you can read on the product page before you release.",
    ],
    alternativeFaqs: [
      {
        q: "Is Hip-Hop Grooves MIDI a trap drum kit?",
        a: "It's a hip-hop groove pack played by a session drummer. Trap is one of the styles, next to boom bap, G-funk, new jack swing and old-school rap. Tempos on the page run from 73 to 125 BPM. It was listed at $29 and contains no sounds.",
      },
      {
        q: "Do I need EZdrummer?",
        a: "The pack is optimized for EZdrummer and Superior Drummer. Toontrack's FAQ says the installer requires one of those, and that without them you can extract the .mid files and use another instrument. MidiRoad doesn't need a drum plugin.",
      },
      {
        q: "Why look at MidiRoad for trap hats and 808s?",
        a: "Hip-Hop Grooves is live-played kit grooves, not programmed hi-hat rolls and 808 basslines. If that's the beat you want, a trap MIDI kit matches the job more closely. If you want a drummer's timing inside EZdrummer, Toontrack is the product built for it.",
      },
      {
        q: "Is the Toontrack pack royalty-free?",
        a: "The product page we checked doesn't say. Don't assume it matches a sample-pack license. Read Toontrack's terms. MidiRoad states a royalty-free license for your own releases and doesn't allow resale of the raw files.",
      },
      {
        q: "Can I preview the grooves online?",
        a: "Toontrack posts demos of the MIDI played through their drum software. MidiRoad has a player on every pattern page.",
      },
    ],
    compareFaqs: [
      {
        q: "Are the tempos in the same range?",
        a: "Hip-Hop Grooves runs from 73 to 125 BPM. MidiRoad's drill kit runs from 130 to 170, and the trap kits cover a wider span, including the 130 to 160 range where a lot of trap is programmed. MIDI follows your project tempo either way. The listed BPM is where the part was written.",
      },
      {
        q: "Who played or programmed the parts?",
        a: "Toontrack credits a session drummer. MidiRoad patterns are programmed MIDI for hats, snares, kicks and 808s.",
      },
      {
        q: "What does $29 include?",
        a: "MIDI only, from about 70 tracks with variations. The sounds are EZdrummer or Superior Drummer, sold separately. MidiRoad's $14.99 bundle is 210 patterns and 77 one-shots. It isn't a live-drummer library.",
      },
      {
        q: "Will the MIDI open in FL Studio if I don't own EZdrummer?",
        a: "Toontrack's FAQ says you can extract the .mid files when you don't have their installer, then map the notes yourself. MidiRoad is already plain .mid, so there's nothing to extract.",
      },
      {
        q: "Which is the fair choice for boom bap?",
        a: "Toontrack, if you want played boom bap, G-funk and new jack grooves. MidiRoad doesn't sell a boom bap kit. The catalog is trap, drill and 808 bass.",
      },
    ],
    alternative: {
      metaTitle: "Best Toontrack Alternative for MIDI Drums",
      description:
        "Toontrack Hip-Hop Grooves is played drummer MIDI for EZdrummer. Here's how that differs from a MidiRoad trap and drill kit.",
      h1: "Best Toontrack alternative for MIDI drums",
      lede: "Toontrack Hip-Hop Grooves MIDI is a real MIDI drum product, and it isn't a trap kit in the way producers usually mean it. A session drummer played the grooves, trap is one style among several, and the pack is built for EZdrummer and Superior Drummer. MidiRoad is programmed hats, snares, kicks and 808s for trap and drill, in standard MIDI, with a player on every file.",
    },
    compare: {
      metaTitle: "MidiRoad vs Toontrack MIDI Drums",
      description:
        "MidiRoad vs Toontrack Hip-Hop Grooves: programmed trap drums against session-drummer MIDI, with price, tempo, license and DAW notes.",
      h1: "MidiRoad vs Toontrack MIDI drums",
      lede: "Put these side by side and the difference is the performance. Toontrack sells grooves a drummer played, for their own drum software, from 73 to 125 BPM. MidiRoad sells programmed trap and drill patterns you can open anywhere. Neither replaces the other if you actually need what it's good at.",
    },
  },
];

export function competitorBySlug(slug: string) {
  return COMPETITORS.find((competitor) => competitor.slug === slug);
}

export const alternativePath = (slug: string) => `/alternatives/${slug}`;
export const comparePath = (slug: string) => `/compare/midiroad-vs-${slug}`;

export function trademarkDisclaimer(names: string) {
  return `${names} belong to their owners. MidiRoad isn't affiliated with, endorsed by, or paid by them. There are no affiliate links on this page. Details are from their public pages as of ${CHECKED} and may have changed.`;
}

export const ALL_NAMES_DISCLAIMER = trademarkDisclaimer(
  "Unison, Splice, Cymatics, Ghosthack, Toontrack, EZdrummer, Superior Drummer, FL Studio, Ableton Live and Logic Pro",
);

export type DawSlug = "fl-studio" | "ableton" | "logic";

export type DawPage = {
  slug: DawSlug;
  name: string;
  metaTitle: string;
  description: string;
  h1: string;
  lede: string;
  /** Full import guide, when one exists. Logic doesn't have one. */
  guide?: string;
  faqs: FaqItem[];
};

export const DAW_PAGES: DawPage[] = [
  {
    slug: "fl-studio",
    name: "FL Studio",
    metaTitle: "MIDI Drum Kits for FL Studio",
    description:
      "MIDI drum kits for FL Studio: royalty-free trap and drill patterns for the Channel Rack, with browser previews and a free kit.",
    h1: "MIDI drum kits for FL Studio",
    lede: "FL Studio plays standard MIDI, so a drum kit doesn't need a special FL edition. What matters is the shape of the files. MidiRoad splits hats, snares, kicks and 808s into separate .mid files, which matches the Channel Rack: one sound, one channel. This page is what to buy. The click-by-click import is in the FL Studio guide.",
    guide: "/guides/how-to-use-midi-drums-in-fl-studio",
    faqs: [
      {
        q: "Do these kits work in FL Studio 21 and FL Studio 2024?",
        a: "Yes. They're standard .mid files. The import steps for the Channel Rack and Piano Roll are in the FL Studio guide, written for FL Studio 20 and 21 and the same in 2024 and later.",
      },
      {
        q: "Why are the hats and 808s in separate files?",
        a: "The Channel Rack is one sound per channel. A hat file, a snare file, a kick file and an 808 file drop onto four Sampler channels, so you don't have to split a mixed clip apart.",
      },
      {
        q: "Will FL Studio change my project tempo on import?",
        a: "It can offer to. The guide shows how to leave the project tempo alone. The pattern still lines up, because MIDI is stored in beats, not in a baked tempo.",
      },
      {
        q: "Can I sell beats made with these kits?",
        a: "Yes. The license is royalty-free for your songs and beats, including beats you sell. You can't resell or share the MIDI or WAV files themselves.",
      },
      {
        q: "Can I try a pattern in FL Studio before I buy a kit?",
        a: "Preview any pattern on the site, or get the free kit and drag those files in. The beat maker also exports MIDI you can drop on a channel.",
      },
    ],
  },
  {
    slug: "ableton",
    name: "Ableton Live",
    metaTitle: "MIDI Drum Kits for Ableton Live",
    description:
      "MIDI drum kits for Ableton Live: royalty-free trap and drill clips for a Drum Rack, with browser previews and a free kit.",
    h1: "MIDI drum kits for Ableton Live",
    lede: "Ableton Live turns a .mid file into a clip at your project tempo. For drums, that clip lands on a Drum Rack, and the notes have to hit the pads that hold your samples. MidiRoad kits are built as separate part files so you can drop a hat clip, a snare clip and an 808 clip on their own racks or chains. Import, mapping and the Groove Pool are in the Ableton guide. This page is which kit to buy.",
    guide: "/guides/how-to-use-midi-drums-in-ableton",
    faqs: [
      {
        q: "Do the kits work in Live 11 and Live 12?",
        a: "Yes. Drag a .mid file onto a MIDI track and Live makes a clip at the project tempo. The Ableton guide covers Drum Rack mapping for Live 11 and 12, Standard and Suite.",
      },
      {
        q: "Why is a clip silent after I drop it in?",
        a: "The notes are on pitches with no pad loaded. That's mapping, not a broken file. The guide shows how to fold the clip and move notes onto the pads that hold your samples.",
      },
      {
        q: "Can I add swing in Live?",
        a: "Yes, with the Groove Pool. The guide uses a swing groove and then Commit, which writes the timing into the notes. The MIDI file is the grid. Swing is applied in Live.",
      },
      {
        q: "Do I need a MidiRoad subscription to use the kits in Live?",
        a: "No. Kits are a one-time purchase. A credit plan exists if you'd rather unlock single files. The free kit doesn't need an account.",
      },
      {
        q: "Where are the trap and drill patterns?",
        a: "Trap patterns are on the trap hub, mostly from Essentials Vault. Drill patterns are Decoy Protocol, listed on the drill hub. Both are ordinary MIDI clips in Live.",
      },
    ],
  },
  {
    slug: "logic",
    name: "Logic Pro",
    metaTitle: "MIDI Drum Kits for Logic Pro",
    description:
      "MIDI drum kits for Logic Pro: royalty-free trap and drill MIDI for any software instrument, with browser previews and a free kit.",
    h1: "MIDI drum kits for Logic Pro",
    lede: "Logic Pro opens standard MIDI, so these kits don't need a Logic-only export. Drag a .mid file from Finder onto a software instrument track, then point the notes at Drum Machine Designer, Quick Sampler, or whichever sampler holds your drums. There's no separate Logic import guide on this site. The short version is below, and the trap and drill kits are the same files FL Studio and Live use.",
    faqs: [
      {
        q: "Do MidiRoad kits work in Logic Pro?",
        a: "Yes. They're standard .mid files. Drag one from Finder onto a software instrument track in the Tracks area. Logic also imports MIDI from the File menu. The notes then need to land on the pads or keys that hold your samples.",
      },
      {
        q: "Do I need Drum Machine Designer?",
        a: "No. Any software instrument that receives MIDI will play the file. Drum Machine Designer, Quick Sampler, Sampler, or a third-party plugin all work. Move notes onto the pads that hold your sounds if the kit mapping doesn't match.",
      },
      {
        q: "How do 808 slides work in Logic?",
        a: "The 808 patterns are MIDI notes, and some files are written as sliding lines. The slide sound comes from glide or portamento on the instrument, with the notes overlapping. The file stores the pitches. The instrument plays the glide.",
      },
      {
        q: "Can I release a song made with these in Logic?",
        a: "Yes. The license is royalty-free for your songs and beats, including commercial releases. You can't resell or share the raw MIDI or WAV files.",
      },
      {
        q: "What should I download first?",
        a: "Preview a pattern on the site, or take the free kit and drop it on a track. Essentials Vault is the large trap kit. Decoy Protocol is the drill kit. The Complete Vault is every kit plus 77 one-shots.",
      },
    ],
  },
];

export function dawBySlug(slug: string) {
  return DAW_PAGES.find((daw) => daw.slug === slug);
}

export const dawPath = (slug: string) => `/midi-drums-for/${slug}`;

/** Buying-guide link from a pattern hub, so the hub stays a browser and the guide stays a sales page. */
export const GENRE_BUY_LINK: Record<string, { href: string; label: string }> = {
  trap: { href: TRAP_BUY_PATH, label: "trap MIDI drum kits" },
  "street-trap": { href: TRAP_BUY_PATH, label: "trap MIDI drum kits" },
  "melodic-trap": { href: TRAP_BUY_PATH, label: "trap MIDI drum kits" },
  "dark-trap": { href: TRAP_BUY_PATH, label: "trap MIDI drum kits" },
  drill: { href: DRILL_BUY_PATH, label: "drill MIDI drum kits" },
  "808-bass": { href: TRAP_BUY_PATH, label: "trap and 808 MIDI kits" },
};

export const TRAP_BUY_FAQS: FaqItem[] = [
  {
    q: "How is this different from the trap pattern hub?",
    a: "The trap hub at /midi/trap is the browser: 98 patterns, each with a player. This page is the buying guide. It says which kit those files live in, what the other trap-flavored kits add, and how Unison's and Ghosthack's trap packs differ.",
  },
  {
    q: "Which MidiRoad kit should I buy first for trap?",
    a: "Essentials Vault if you want the most trap patterns in one kit. Black Market Heist for street trap, Midnight Odyssey for melodic trap, Psycho Ward for dark trap, and Focus 808 Lab if you only need 808s. The Complete Vault is all six kits, including drill, plus 77 one-shots.",
  },
  {
    q: "Do the trap kits include drum sounds?",
    a: "The kits are MIDI. The Complete Vault adds 77 one-shots. A pattern is silent until a sampler plays it, which is why the same file works on your own drum kit.",
  },
  {
    q: "What BPM are the trap patterns?",
    a: "The trap hub runs from 89 to 180 BPM. A lot of trap is programmed around 130 to 160 and felt in half time. Each file lists its tempo. MIDI follows whatever tempo the project is set to.",
  },
  {
    q: "What other trap MIDI packs are worth knowing?",
    a: "Unison's Trap MIDI Drum Collection is a MIDI-only folder they describe as 250+ patterns, listed at $17 when we checked. Ghosthack Trap Drums is loops, stems and one-shots plus 215 MIDI files, listed at €37 including VAT. Splice is a subscription catalog, not a kit. The comparison pages link to each source.",
  },
];

export const DRILL_BUY_FAQS: FaqItem[] = [
  {
    q: "Which MidiRoad kit is the drill kit?",
    a: "Decoy Protocol. It is 18 patterns: snares, hi-hats and 808s, from 130 to 170 BPM. Preview every file on the drill hub before you buy the kit.",
  },
  {
    q: "Is 18 patterns enough for a drill beat?",
    a: "It's a focused kit, not a 200-file folder. A beat needs one hat pattern, one snare and one 808, then edits. If you want more hats or more 808s from neighboring styles, Essentials Vault and Focus 808 Lab are separate kits, and the bundle includes them.",
  },
  {
    q: "How is this different from the drill pattern pages?",
    a: "The drill hub lists every file with a player. This page is about buying: the kit, the license, the DAWs, and what other products labeled drill actually contain.",
  },
  {
    q: "Does Cymatics sell drill drum MIDI?",
    a: "Their APEX Drill collection is melody MIDI: progressions meant to sit over drill drums. It doesn't replace a drum kit. The source is the APEX MIDI page, linked from the Cymatics comparison.",
  },
  {
    q: "What about a Ghosthack drill pack?",
    a: "UK Drill Essentials is a sample pack (drums, 808s, loops and one-shots) that also includes 20 MIDI files and five construction kits at 140 to 160 BPM. The page we loaded showed a sale price. Buy it if you want their sounds. Decoy Protocol is the one to buy if you want MIDI patterns and you already have samples.",
  },
];

export const BEST_FAQS: FaqItem[] = [
  {
    q: "What is the best MIDI drum kit for trap in 2026?",
    a: "For programmed trap drums you can preview and buy once, start with MidiRoad's Essentials Vault or The Complete Vault. If you want the largest single trap MIDI folder these pages found, Unison's Trap MIDI Drum Collection says 250+ patterns. If you want audio loops as well as MIDI, Ghosthack Trap Drums is built that way. Best depends on whether you need patterns, sounds, or a live drummer.",
  },
  {
    q: "What's the best option for drill?",
    a: "MidiRoad's drill patterns are Decoy Protocol: 18 files from 130 to 170 BPM, each with a preview. Cymatics' drill MIDI in APEX is melody, not drums. Ghosthack's UK Drill Essentials is a sample pack with 20 MIDI files. Pick the one that matches the hole in the session.",
  },
  {
    q: "Are these kits royalty-free?",
    a: "MidiRoad, Unison's trap collection, Splice downloads, Cymatics APEX and Ghosthack Trap Drums all say royalty-free for commercial music, with different extra rules. Toontrack's Hip-Hop Grooves page doesn't state a license. Read the license that ships with a pack before you resell files or drop them in a sample pack.",
  },
  {
    q: "Can I try a kit before paying?",
    a: "MidiRoad previews every pattern in the browser and sends 12 patterns for an email address. Splice previews in the browser and charges credits to download. Unison, Cymatics, Ghosthack and Toontrack offer sales-page demos, then a download.",
  },
  {
    q: "Do they work in FL Studio, Ableton and Logic?",
    a: "Standard MIDI does, which covers MidiRoad, Unison, Splice, Cymatics and Ghosthack. Toontrack's installer expects EZdrummer or Superior Drummer, and their FAQ explains how to extract the .mid files if you don't own that software. FL Studio and Ableton each have a step-by-step guide on this site.",
  },
];

export const ALTERNATIVES_FAQS: FaqItem[] = [
  {
    q: "What does an alternative page cover?",
    a: "Each one takes a single company and asks whether a MidiRoad kit replaces what they sell. Unison is the closest drum-MIDI match. Splice is a subscription catalog. Cymatics APEX is melody MIDI. Ghosthack Trap Drums is a sample pack with MIDI. Toontrack is played grooves for EZdrummer.",
  },
  {
    q: "Where is the side-by-side table?",
    a: "Every alternative page has the same six rows: price model, patterns, browser preview, royalty-free terms, DAW support and free tools. The comparison pages repeat that table and then go into how the products differ in practice.",
  },
  {
    q: "Can I just browse the patterns instead?",
    a: "Yes. The trap, drill, street trap, melodic trap, dark trap and 808 hubs list every MidiRoad file with a player. These pages are for the buying decision. The hubs are for auditioning.",
  },
  {
    q: "Do you link out to the other companies?",
    a: "Yes, to the public page we read, so you can check the price and the license yourself. Those links aren't affiliate links.",
  },
];

export const HUB_FAQS: FaqItem[] = [
  {
    q: "Why these companies?",
    a: "They're the names that come up when someone is about to buy trap or drill MIDI: Unison's drum collections, Splice's catalog, Cymatics' melody MIDI, Ghosthack's trap packs, and Toontrack's played drum MIDI. We left out instruments that aren't sold as MIDI packs.",
  },
  {
    q: "Are the comparisons paid placements?",
    a: "No. MidiRoad sells its own kits. These pages aren't affiliate links, and the other companies don't pay for the mention. Trademarks belong to their owners.",
  },
  {
    q: "What if a price on this page is out of date?",
    a: "Pack prices move, especially during sales. Each comparison links to the page we read and says we checked in November 2026. MidiRoad's prices are the ones charged at checkout on this site.",
  },
  {
    q: "Where are the how-to guides?",
    a: "Import steps for FL Studio and Ableton, the trap programming guide, and the royalty-free explainer live under Guides. These pages are for choosing what to buy. The pattern hubs under /midi are for auditioning files.",
  },
];

export type BuyerEntry = { path: string; priority: number };

export function allBuyerPaths(): BuyerEntry[] {
  return [
    { path: COMPARE_HUB, priority: 0.7 },
    { path: ALTERNATIVES_HUB, priority: 0.6 },
    { path: BEST_PATH, priority: 0.8 },
    { path: TRAP_BUY_PATH, priority: 0.8 },
    { path: DRILL_BUY_PATH, priority: 0.8 },
    ...COMPETITORS.flatMap((competitor) => [
      { path: alternativePath(competitor.slug), priority: 0.7 },
      { path: comparePath(competitor.slug), priority: 0.7 },
    ]),
    ...DAW_PAGES.map((daw) => ({ path: dawPath(daw.slug), priority: 0.7 })),
  ];
}

type CheckedPage = { path: string; title: string; description: string };

const CHECKED_PAGES: CheckedPage[] = [
  {
    path: COMPARE_HUB,
    title: "Compare MIDI Drum Kits",
    description:
      "Compare MidiRoad with Unison, Splice, Cymatics, Ghosthack and Toontrack, plus buying guides for trap, drill and three DAWs.",
  },
  {
    path: ALTERNATIVES_HUB,
    title: "MIDI Drum Kit Alternatives",
    description:
      "Alternatives to Unison, Splice, Cymatics, Ghosthack and Toontrack for producers buying royalty-free MIDI drum kits.",
  },
  {
    path: BEST_PATH,
    title: "Best MIDI Drum Kits for Trap and Drill",
    description:
      "Best MIDI drum kits for trap and drill in 2026: MidiRoad, Unison, Ghosthack, Toontrack, Splice and Cymatics, and what each one sells.",
  },
  {
    path: TRAP_BUY_PATH,
    title: "Trap MIDI Drum Kits",
    description:
      "Trap MIDI drum kits you can preview and buy, plus how Unison's and Ghosthack's trap packs differ from MidiRoad.",
  },
  {
    path: DRILL_BUY_PATH,
    title: "Drill MIDI Drum Kits",
    description:
      "Drill MIDI drum kits: MidiRoad's Decoy Protocol kit, what to pair with it, and how other drill MIDI packs differ.",
  },
  ...COMPETITORS.flatMap((competitor) => [
    {
      path: alternativePath(competitor.slug),
      title: competitor.alternative.metaTitle,
      description: competitor.alternative.description,
    },
    {
      path: comparePath(competitor.slug),
      title: competitor.compare.metaTitle,
      description: competitor.compare.description,
    },
  ]),
  ...DAW_PAGES.map((daw) => ({
    path: dawPath(daw.slug),
    title: daw.metaTitle,
    description: daw.description,
  })),
];

const titles = new Set<string>();
const paths = new Set<string>();
for (const page of CHECKED_PAGES) {
  if (page.description.length > 160) {
    throw new Error(`Meta description for ${page.path} is ${page.description.length} characters`);
  }
  if (page.description.length < 50) {
    throw new Error(`Meta description for ${page.path} is too short to be useful`);
  }
  if (titles.has(page.title)) throw new Error(`Duplicate title ${page.title}`);
  if (paths.has(page.path)) throw new Error(`Duplicate path ${page.path}`);
  titles.add(page.title);
  paths.add(page.path);
  const faqs =
    page.path === BEST_PATH
      ? BEST_FAQS
      : page.path === TRAP_BUY_PATH
        ? TRAP_BUY_FAQS
        : page.path === DRILL_BUY_PATH
          ? DRILL_BUY_FAQS
          : page.path === COMPARE_HUB
            ? HUB_FAQS
            : COMPETITORS.flatMap((competitor) =>
                page.path === alternativePath(competitor.slug)
                  ? competitor.alternativeFaqs
                  : page.path === comparePath(competitor.slug)
                    ? competitor.compareFaqs
                    : [],
              ).concat(
                DAW_PAGES.find((daw) => dawPath(daw.slug) === page.path)?.faqs ?? [],
              );
  const resolved =
    page.path === ALTERNATIVES_HUB ? ALTERNATIVES_FAQS : faqs;
  if (resolved.length < 4) throw new Error(`Not enough FAQs for ${page.path}`);
}

for (const competitor of COMPETITORS) {
  if (competitor.cells.length !== COMPARE_FEATURES.length) {
    throw new Error(`${competitor.slug} comparison cells don't match the feature rows`);
  }
}

export const BUYER_PAGE_META = CHECKED_PAGES;

export function buyerMeta(path: string) {
  const page = CHECKED_PAGES.find((entry) => entry.path === path);
  if (!page) throw new Error(`No buyer meta for ${path}`);
  return page;
}

/** Absolute URLs for llms.txt, one line per page. */
export function buyerLlmsLines() {
  const label = (path: string) => buyerMeta(path).title;
  return allBuyerPaths().map((entry) => `- [${label(entry.path)}](${absoluteUrl(entry.path)}): ${buyerMeta(entry.path).description}`);
}
