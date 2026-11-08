/**
 * FAQ content for the MidiRoad bundle landing page.
 *
 * Each entry pairs a common objection (the Q) with a concrete answer that
 * either removes a barrier or reinforces a benefit. Answers are short,
 * scannable, and avoid hype.
 */
export type FaqItem = {
  q: string;
  a: string;
  /** Optional secondary bullet list for multi-part answers. */
  bullets?: string[];
};

export const FAQS: FaqItem[] = [
  {
    q: "What DAWs are these MIDI files and samples compatible with?",
    a: "Every file works with all major DAWs — both desktop and mobile. We've tagged each file with accurate key labels so they drop straight into your project.",
    bullets: [
      "FL Studio, Ableton Live, Logic Pro, Reason, Studio One",
      "Maschine, MPC, Pro Tools, GarageBand, Cubase",
      "iOS/Android DAWs (BandLab, Cubasis, GarageBand iOS)",
    ],
  },
  {
    q: "I'm a beginner — will I actually be able to use these?",
    a: "Yes. The MIDI files give you the chords, basslines, and drum patterns ready-to-use. You don't need to know music theory — just drag, drop, and tweak a few notes. The 'Accurate key labels' on every file mean you'll never sound off-key.",
    bullets: [
      "Open the file → drop it on a track → pick a sound → done",
      "No MIDI keyboard or production experience required",
      "Works the same whether it's your first beat or your 1000th",
    ],
  },
  {
    q: "How does the 30-day money-back guarantee actually work?",
    a: "No paperwork, no friction. If you're not satisfied for any reason, email us within 30 days and we'll process a full refund — usually within the same business day.",
    bullets: [
      "Send 1 email to support@midiroad.com",
      "We process refunds within 1 business day",
      "You keep the files — no need to delete anything",
    ],
  },
  {
    q: "Are these royalty-free? Can I release songs with them commercially?",
    a: "Yes — 100% royalty-free. Use them in songs you release on Spotify, Apple Music, TikTok, YouTube, sync placements, anything. No attribution required, no hidden fees, no per-stream royalties.",
    bullets: [
      "Sell unlimited streams & downloads",
      "Use in sync / film / TV placements",
      "Resell or redistribute the raw files? No — but use in YOUR music? Yes.",
    ],
  },
  {
    q: "What exactly is included in the bundle?",
    a: "838 files total: WAVs (drums, 808s, FX), MIDIs (chord progressions, drum patterns, melodic ideas), and preset packs — covering dark trap, RnB, and soul.",
    bullets: [
      "(73) HiHat MIDIs  •  (80) 808 MIDIs  •  (35) Kick MIDIs",
      "(50) Open Hat MIDIs  •  (45) Snare MIDIs  •  (14) 808s",
      "Plus claps, crashes, FX, hi-hats, kicks, open hats, percussions, snares, rim snares",
    ],
  },
  {
    q: "How will I receive the files after purchase?",
    a: "Instantly. After checkout you land on a download page, and we also email you a download link — usually within a minute. Check spam if it doesn't arrive.",
    bullets: [
      "Delivered as a single .zip (~1.2 GB) — organized into folders by category",
      "Your download link stays valid — re-download anytime from the email",
    ],
  },
  {
    q: "Will these work with my existing drum kits and plugins?",
    a: "Yes. The MIDIs work with any sound you load onto them. The WAVs are normalized @ 44.1kHz / 24-bit, which is the universal DAW standard — they drop into any project without conversion.",
  },
  {
    q: "How is this different from free MIDI packs online?",
    a: "Free packs usually have 5–10 files of questionable quality, mismatched keys, and no percussive detail. Every file here is tagged with an accurate key label, organized by BPM/key/style, and engineered to be mix-ready — not a starter pack, a *workflow*.",
    bullets: [
      "All files key-labeled & mix-ready (free packs rarely are)",
      "Curated, not random — works together as a system",
      "Saves you 5–10 hours/week of searching & organizing",
    ],
  },
];
