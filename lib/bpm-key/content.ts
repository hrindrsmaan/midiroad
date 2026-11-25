import type { FaqItem } from "@/lib/faq";

export const BPM_KEY_PATH = "/tools/bpm-key-finder";

export const BPM_KEY_TITLE = "Free BPM & Key Finder – Tempo and Key of Any Song";

/** Kept under the 160-character meta description limit. */
export const BPM_KEY_DESCRIPTION =
  "Drop an MP3 or WAV to get the tempo, musical key, and Camelot code. The BPM and key finder runs in your browser, so the file is never uploaded.";

export const BPM_KEY_FAQS: FaqItem[] = [
  {
    q: "Is my audio uploaded?",
    a: "No. The file is decoded and analyzed in your browser with the Web Audio API. It is not sent to MidiRoad, and closing the tab clears it.",
  },
  {
    q: "Which audio files work?",
    a: "MP3, WAV, FLAC, OGG, M4A and AAC, up to 100 MB and 8 minutes. For a long mix or a DJ set, trim the section you want a reading from and drop that.",
  },
  {
    q: "How accurate are the BPM and key?",
    a: "On a clear song or loop it usually lands on the tempo you would tap in, and on the key you would write the track in. Half-time drums can read at double time, because 70 and 140 BPM share a grid. C major and A minor share the same notes, so a loop that never settles on a tonic can come back as either.",
  },
  {
    q: "What is Camelot notation?",
    a: "A DJ map of musical keys. The number is the key and the letter is the mode: A is minor, B is major. C major is 8B and A minor is 8A. Keys with the same number, or a neighboring number, mix without clashing.",
  },
  {
    q: "How do I use the result with a drum kit?",
    a: "Trap and drill are usually programmed at 130–150 BPM, even when the snare feels half-time. Set the DAW to the BPM from the result, then open the MidiRoad patterns in that tempo range and drag them onto a drum rack.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes, in current Chrome, Safari, Firefox and Edge. The analysis code loads the first time you drop a file, then a few minutes of audio takes a few seconds. Nothing is installed.",
  },
];
