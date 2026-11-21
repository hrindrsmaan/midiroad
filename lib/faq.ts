/**
 * FAQ content for the MidiRoad bundle landing page.
 *
 * One short answer per question, and only claims the download backs up.
 * Bundle contents are covered by "What's inside", so they aren't repeated here.
 */
export type FaqItem = {
  q: string;
  a: string;
};

export const FAQS: FaqItem[] = [
  {
    q: "Which DAWs does it work with?",
    a: "Any DAW that opens MIDI and WAV files: FL Studio, Ableton Live, Logic Pro, Studio One, Reason, Cubase, Pro Tools, Maschine and more.",
  },
  {
    q: "I'm new to producing. Can I use these?",
    a: "Yes. Drag a MIDI pattern onto a track, load a drum sound (or one of the included one-shots), and it plays. Every pattern is editable, so you can tweak it to fit your beat.",
  },
  {
    q: "Can I use them in music I release?",
    a: "Yes. Everything is royalty-free for your own songs and beats, including commercial releases on Spotify, Apple Music and YouTube. No credit needed. You just can't resell or share the raw files.",
  },
  {
    q: "How do I get the files?",
    a: "Right after checkout you land on a download page, and we email you a download link you can reuse anytime.",
  },
  {
    q: "What if it's not for me?",
    a: "Email support@inbox.midiroad.com within 30 days of purchase for a full refund.",
  },
];
