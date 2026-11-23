import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ORG_ID, SHARE_IMAGE, SITE_URL, WEBSITE_ID, absoluteUrl, faqJsonLd } from "@/lib/site";
import type { FaqItem } from "@/lib/faq";

/**
 * Educational guides. Each guide's body lives in its own page under
 * app/guides/<slug>/page.tsx; the title, description, dates and FAQ live here
 * so the /guides index, the sitemap, llms.txt and the JSON-LD share one copy.
 */
export type Guide = {
  slug: string;
  /** The <h1> and Article headline. */
  title: string;
  /** <title> tag, before the " | MidiRoad" suffix. */
  metaTitle: string;
  description: string;
  /** One line for the /guides index and llms.txt. */
  summary: string;
  datePublished: string;
  dateModified: string;
  faqs: FaqItem[];
};

export const GUIDES: Guide[] = [
  {
    slug: "what-are-midi-drum-patterns",
    title: "What are MIDI drum patterns?",
    metaTitle: "What Are MIDI Drum Patterns? A Producer's Guide",
    description:
      "What MIDI drum patterns are, how they differ from drum loops and samples, what's inside a MIDI file, and how producers use them in FL Studio, Ableton and any DAW.",
    summary: "What a MIDI drum pattern is, how it differs from an audio loop, and why producers use them.",
    datePublished: "2026-11-23",
    dateModified: "2026-11-23",
    faqs: [
      {
        q: "Do MIDI drum patterns include sounds?",
        a: "No. A MIDI file only stores notes: which drum plays, when, and how hard. You hear it through whatever drum kit or sampler you load in your DAW, so the same pattern can sound completely different with different samples.",
      },
      {
        q: "What's the difference between a MIDI pattern and a drum loop?",
        a: "A drum loop is recorded audio: the sounds and the rhythm are baked together. A MIDI pattern is just the rhythm, so you can change any note, the tempo, the swing and the sounds without re-recording or time-stretching.",
      },
      {
        q: "Will a MIDI drum pattern work in my DAW?",
        a: "Yes, if your DAW opens standard .mid files. That covers FL Studio, Ableton Live, Logic Pro, Studio One, Reason, Cubase, Pro Tools and Maschine.",
      },
      {
        q: "Does the BPM of a MIDI file matter?",
        a: "Not much. MIDI notes are stored in beats, so a pattern plays at your project's tempo when you drop it in. The listed BPM is the tempo it was written for and where it feels most natural.",
      },
    ],
  },
  {
    slug: "how-to-use-midi-drums-in-fl-studio",
    title: "How to use MIDI drums in FL Studio",
    metaTitle: "How to Use MIDI Drum Patterns in FL Studio (Step by Step)",
    description:
      "Step-by-step: import MIDI drum patterns into FL Studio's Channel Rack or Piano Roll, map the notes to your drum kit, add swing, and shape velocity so the groove hits.",
    summary: "Import MIDI drums into the Channel Rack or Piano Roll, map them to your kit, then set swing and velocity.",
    datePublished: "2026-11-23",
    dateModified: "2026-11-23",
    faqs: [
      {
        q: "Why does my MIDI drum pattern play the wrong sounds in FL Studio?",
        a: "The notes in the file are on pitches your sampler doesn't expect. Load a single drum sample into each channel and import one part per channel, or move the notes in the Piano Roll to the keys your drum plugin uses.",
      },
      {
        q: "Should I import drum MIDI into the Channel Rack or the Piano Roll?",
        a: "Use the Piano Roll for hi-hat rolls, 808s and anything with fast or pitched notes, since the step sequencer can't show 1/32 rolls or note lengths. The Channel Rack is fine for simple kicks and snares on a 1/16 grid.",
      },
      {
        q: "How do I stop FL Studio changing my project tempo when I import MIDI?",
        a: "Untick the tempo option in the import dialog, or just drag the file onto a channel in the Channel Rack. MIDI notes follow your project tempo either way.",
      },
    ],
  },
  {
    slug: "how-to-use-midi-drums-in-ableton",
    title: "How to use MIDI drums in Ableton Live",
    metaTitle: "How to Use MIDI Drum Patterns in Ableton Live",
    description:
      "Load a Drum Rack, drag MIDI drum clips into Ableton Live, match the notes to your pads, and use the Groove Pool to add swing and humanize trap and drill drums.",
    summary: "Build a Drum Rack, drag MIDI clips onto it, line notes up with pads, and add feel with the Groove Pool.",
    datePublished: "2026-11-23",
    dateModified: "2026-11-23",
    faqs: [
      {
        q: "Why is my MIDI drum clip silent in Ableton?",
        a: "The clip's notes are on pitches with no pad in your Drum Rack. Open the clip and fold the editor to see which notes it uses, then drag those notes to the rows of the pads that hold your sounds, or drop a sample on the empty pad.",
      },
      {
        q: "Does Ableton keep the tempo of a MIDI file?",
        a: "No. Dragging a .mid file into a track creates a clip that plays at the project tempo. That's usually what you want: set the Live set to the BPM listed for the pattern and it feels as written.",
      },
      {
        q: "How do I add swing to MIDI drums in Ableton?",
        a: "Open the Groove Pool, drag a groove such as Swing 16-55 onto the clip, then lower the Amount until the hats bounce without sounding late. Press Commit to write the timing into the notes.",
      },
    ],
  },
  {
    slug: "how-to-make-trap-drums",
    title: "How to make trap drums",
    metaTitle: "How to Make Trap Drums: Hi-Hat Rolls, 808s and BPM",
    description:
      "How to program trap drums: pick a tempo between 130 and 160 BPM, place the snare and kick, write hi-hat rolls and triplets, and lock the 808 to the kick.",
    summary: "Tempo, snare and kick placement, hi-hat rolls and triplets, and 808 placement for trap beats.",
    datePublished: "2026-11-23",
    dateModified: "2026-11-23",
    faqs: [
      {
        q: "What BPM is trap?",
        a: "Most trap sits between 130 and 160 BPM, programmed in half time so it feels like 65–80 BPM. 140 is a common starting point. Melodic trap often drops lower, and some producers work at 70–80 BPM in double time instead.",
      },
      {
        q: "Where does the snare go in a trap beat?",
        a: "On beat 3 of each bar in half time (the third quarter note), which is what makes a 140 BPM beat feel slow. Some producers add a clap layer or a ghost snare just before it.",
      },
      {
        q: "Should the 808 play with the kick?",
        a: "Usually, yes. Starting the 808 on the kick keeps the low end punchy, and most producers either remove the kick where an 808 hits or sidechain the 808 to the kick so they don't clash.",
      },
      {
        q: "How do I make hi-hat rolls?",
        a: "Start with straight 1/8 or 1/16 hats, then swap a few spots for 1/32 bursts or 1/16 triplets, usually leading into the snare or the end of a bar. Ramp the velocity up or down across the roll so it doesn't sound like a machine gun.",
      },
    ],
  },
  {
    slug: "royalty-free-midi-explained",
    title: "Royalty-free MIDI, explained",
    metaTitle: "Royalty-Free MIDI Explained: What You Can and Can't Do",
    description:
      "What royalty-free means for MIDI drum kits: release songs on Spotify, Apple Music and YouTube with no credit or fees, and why you can't resell or share the raw files.",
    summary: "What royalty-free means for MidiRoad MIDI: commercial releases are fine, reselling the files isn't.",
    datePublished: "2026-11-23",
    dateModified: "2026-11-23",
    faqs: [
      {
        q: "Can I use MidiRoad MIDI in songs I release?",
        a: "Yes. Everything is royalty-free for your own songs and beats, including commercial releases on Spotify, Apple Music and YouTube. No credit needed.",
      },
      {
        q: "Do I have to credit MidiRoad?",
        a: "No. You don't need to credit MidiRoad in your track title, description or metadata.",
      },
      {
        q: "Can I share or resell the MIDI files?",
        a: "No. You can't resell or share the raw files. The license covers using them inside your own songs and beats, not passing the MIDI or WAV files on, whether on their own or packed into another kit.",
      },
      {
        q: "What if the kit isn't right for me?",
        a: "Email support@inbox.midiroad.com within 30 days of purchase for a full refund.",
      },
    ],
  },
];

export const guidePath = (guide: { slug: string }) => `/guides/${guide.slug}`;

export function guideBySlug(slug: string) {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Unknown guide ${slug}`);
  return guide;
}

export function guideMetadata(slug: string): Metadata {
  const guide = guideBySlug(slug);
  const meta = pageMetadata({ title: guide.metaTitle, description: guide.description, path: guidePath(guide) });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
  };
}

/** Article, BreadcrumbList and FAQPage for one guide. */
export function guideJsonLd(guide: Guide) {
  const url = absoluteUrl(guidePath(guide));
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: guide.title,
      description: guide.description,
      url,
      mainEntityOfPage: url,
      image: SHARE_IMAGE,
      datePublished: guide.datePublished,
      dateModified: guide.dateModified,
      inLanguage: "en",
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": WEBSITE_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    faqJsonLd(guide.faqs),
  ];
}
