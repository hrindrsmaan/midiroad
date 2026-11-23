import type { FaqItem } from "@/lib/faq";
import { PART_ORDER, genreStats } from "@/lib/patterns";

/**
 * Long-form copy for each /midi/<genre> hub: what defines the style, its
 * tempo, its drums, and how to use the patterns, plus a short FAQ.
 * Tempo figures come from the catalog, so they stay true when patterns change.
 */
export type GenreFacts = {
  minBpm: number;
  maxBpm: number;
  /** Middle half of the patterns by tempo (25th to 75th percentile). */
  coreMin: number;
  coreMax: number;
  count: number;
  /** "40 808s, 30 hi-hats and 11 snares", most common first. */
  partsLine: string;
  kitName: string;
};

export type GenreCopy = {
  /** Paragraphs for the intro, in order: style, tempo, drums, how to use. */
  intro: string[];
  faqs: FaqItem[];
};

const PART_NOUN: Record<string, [string, string]> = {
  hihat: ["hi-hat pattern", "hi-hat patterns"],
  "open-hat": ["open-hat pattern", "open-hat patterns"],
  snare: ["snare pattern", "snare patterns"],
  kick: ["kick pattern", "kick patterns"],
  "808": ["808 pattern", "808 patterns"],
};

const listJoin = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

export function genreFacts(slug: string): GenreFacts | undefined {
  const stats = genreStats(slug);
  if (!stats) return undefined;
  const bpms = stats.patterns.map((p) => p.bpm).sort((a, b) => a - b);
  const at = (f: number) => bpms[Math.floor((bpms.length - 1) * f)];
  const parts = PART_ORDER.map((id) => ({ id, n: stats.patterns.filter((p) => p.partId === id).length }))
    .filter((p) => p.n > 0)
    .sort((a, b) => b.n - a.n)
    .map((p) => `${p.n} ${PART_NOUN[p.id][p.n === 1 ? 0 : 1]}`);
  return {
    minBpm: stats.minBpm,
    maxBpm: stats.maxBpm,
    coreMin: at(0.25),
    coreMax: at(0.75),
    count: stats.patterns.length,
    partsLine: listJoin(parts),
    kitName: stats.kit.name,
  };
}

const tempoLine = (f: GenreFacts) =>
  f.coreMin === f.coreMax
    ? `The ${f.count} patterns here run from ${f.minBpm} to ${f.maxBpm} BPM, and most sit at ${f.coreMin} BPM.`
    : `The ${f.count} patterns here run from ${f.minBpm} to ${f.maxBpm} BPM, and most sit between ${f.coreMin} and ${f.coreMax} BPM.`;

const COPY: Record<string, (f: GenreFacts) => GenreCopy> = {
  trap: (f) => ({
    intro: [
      `Trap is the sound of Atlanta that took over hip-hop: slow, heavy grooves under fast, busy hi-hats, with an 808 that works as both the bass and the low end of the kick. The drums are programmed in half time, so the snare lands once per bar and the beat feels half as fast as its tempo.`,
      `Most trap is made between 130 and 160 BPM, with 140 a common default. ${tempoLine(f)} The slower files suit melodic and R&B-leaning beats; the faster ones push toward rage and dark trap.`,
      `The hi-hats carry the energy: straight 1/8s and 1/16s broken up with 1/32 rolls, triplets and pitched runs, with velocity ramps so the rolls breathe. The snare or clap hits on beat 3. The kick bounces around it, and the 808 usually starts on the kick and follows the song's key, sliding between notes at the end of a phrase. This collection from the ${f.kitName} kit has ${f.partsLine}.`,
      `To use them, set your project to the pattern's BPM, drop each file on its own drum or sampler track, and mix and match parts from different patterns at similar tempos. Then make them yours: move a roll, cut a kick, or re-pitch the 808 to your melody.`,
    ],
    faqs: [
      {
        q: "What BPM are these trap MIDI patterns?",
        a: `They run from ${f.minBpm} to ${f.maxBpm} BPM, with most between ${f.coreMin} and ${f.coreMax}. Each pattern page lists its exact tempo, and MIDI plays at whatever tempo your project is set to.`,
      },
      {
        q: "Can I combine hi-hats, snares and 808s from different patterns?",
        a: "Yes. Every part is a separate MIDI file, so you can pair any hi-hat with any 808 or kick. Patterns written at similar tempos fit together most naturally.",
      },
      {
        q: "Do the trap patterns include drum sounds?",
        a: "The MIDI files are notes only, so they play through your own kit. The Complete Vault bundle also includes drum one-shots (WAV) if you need sounds.",
      },
      {
        q: "Can I use these trap patterns in released songs?",
        a: "Yes. They're royalty-free for your own songs and beats, including commercial releases on Spotify, Apple Music and YouTube, with no credit needed. You can't resell or share the raw files.",
      },
    ],
  }),

  "street-trap": (f) => ({
    intro: [
      `Street trap is trap at its rawest: harder kicks, grittier hats and menacing 808s, with less melody to hide behind. Where melodic trap leaves space for a singer, street trap drums are meant to be heard, punchy and up front in the mix, built for aggressive rap verses.`,
      `${tempoLine(f)} That's the classic trap pocket: programmed in half time, so the beat feels slow and heavy while the hats move fast.`,
      `Kicks do more work here than in most trap. They're syncopated, landing off the beat and in short clusters, so the groove bounces even before the 808 comes in. Hi-hats roll in quick bursts rather than constant runs, and open hats add attitude on the off-beats. This set from the ${f.kitName} kit has ${f.partsLine}.`,
      `Load the kicks and hats on separate tracks with short, hard samples, keep the 808 locked to the kick, and choke the open hats with the closed hats so they don't wash over the verse. Strip the hats back for the verse and bring the full pattern in for the hook.`,
    ],
    faqs: [
      {
        q: "What's the difference between street trap and regular trap?",
        a: "Street trap drums are harder and more syncopated, with punchier kicks and grittier hats, and less melodic space. Regular trap covers a wider range, from bouncy to melodic.",
      },
      {
        q: "What tempo is street trap?",
        a: `These patterns run from ${f.minBpm} to ${f.maxBpm} BPM, with most between ${f.coreMin} and ${f.coreMax}, programmed in half time.`,
      },
      {
        q: "Can I use these street trap patterns in released songs?",
        a: "Yes. They're royalty-free for your own songs and beats, including commercial releases on Spotify, Apple Music and YouTube, with no credit needed. You can't resell or share the raw files.",
      },
    ],
  }),

  "melodic-trap": (f) => ({
    intro: [
      `Melodic trap puts the melody and the vocal first. The drums keep trap's structure (half-time snare, rolling hats, 808 bass) but play lighter and leave more space, so piano, guitar or pads and a sung or auto-tuned topline can sit on top.`,
      `${tempoLine(f)} The slowest files here suit R&B-leaning, emotional beats; the faster ones work for upbeat melodic rap.`,
      `Expect smoother, rolling hi-hats with fewer hard stops, gentle velocity ramps instead of machine-gun rolls, and 808s that glide between notes and follow the chords closely. Snares are often softer or replaced by claps and rimshots. This collection from the ${f.kitName} kit has ${f.partsLine}.`,
      `Write or load your melody first, then set the 808 notes to its key; a pattern's pitches are a starting point, not fixed. Use a soft hat sample, pull the hat velocity down a little, and turn on glide for the 808 so the slides land. Leave a bar of drums out before the hook to give the vocal room.`,
    ],
    faqs: [
      {
        q: "What BPM is melodic trap?",
        a: `These patterns run from ${f.minBpm} to ${f.maxBpm} BPM, with most between ${f.coreMin} and ${f.coreMax}. Melodic trap often sits at the slower end so the vocal has room.`,
      },
      {
        q: "How do I get the 808 patterns in key with my melody?",
        a: "Select all the 808 notes and transpose them so the first note matches your song's root note, then adjust individual notes to follow the chords.",
      },
      {
        q: "Can I use these for R&B?",
        a: "Yes. The slower patterns work well under R&B and soul-leaning beats, especially with softer hat and snare samples.",
      },
    ],
  }),

  "dark-trap": (f) => ({
    intro: [
      `Dark trap is trap's horror-film side: eerie, minor-key and aggressive, with drums that feel tense rather than bouncy. It runs faster than most trap and leans on distorted 808s, sparse but heavy kicks, and hats that switch rhythm without warning.`,
      `${tempoLine(f)} At the faster end the half-time groove still feels heavy, while the hats and rolls get frantic.`,
      `The kick usually lands on the downbeat and a couple of unexpected off-beats, leaving gaps that make each hit land harder. Snares sit on beat 3 with the occasional ghost hit. Hi-hats mix rolls, triplets and sudden silences, and the 808 is often distorted and held long. This set from the ${f.kitName} kit has ${f.partsLine}.`,
      `Pair these patterns with dark, minor-key melodies or plain atmospheric pads. Push saturation on the 808, keep the kick short so it doesn't blur into it, and use the silences: dropping the hats for half a bar is one of the genre's most effective moves.`,
    ],
    faqs: [
      {
        q: "What BPM is dark trap?",
        a: `These patterns run from ${f.minBpm} to ${f.maxBpm} BPM, with most between ${f.coreMin} and ${f.coreMax}.`,
      },
      {
        q: "What makes dark trap drums different?",
        a: "More space and more tension: fewer, heavier kicks, abrupt changes in the hi-hat rhythm, and long, distorted 808s, usually under a minor-key melody.",
      },
      {
        q: "Which sounds work best with these patterns?",
        a: "A short, punchy kick, a dry snare or clap, crisp hats, and a saturated 808. The MIDI plays any kit, so try a few to find the darkest combination.",
      },
    ],
  }),

  drill: (f) => ({
    intro: [
      `Drill started in Chicago and was reshaped in London into the sound most people know today: sliding 808 basslines, skippy triplet hi-hats and syncopated snares, usually under dark, minor-key melodies. UK drill and its New York and Brooklyn offshoots share that core.`,
      `Drill is usually made close to 140 BPM, programmed in half time. ${tempoLine(f)}`,
      `What sets drill apart is the hats and the 808. The hats skip: triplet groups, rests and swung off-beats give the groove its stop-start feel. Snares land on beat 3 like trap but often add an extra hit or two that shift the backbeat. The 808 slides constantly, gliding between notes, which is why drill basslines sound like they're talking. This set from the ${f.kitName} kit has ${f.partsLine}.`,
      `Set your project to the pattern's BPM, put the hats on a short, bright sample with a little swing, and load the 808 into a mono sampler with glide on so the slides work. Pair the drill hats with the 808 patterns at the same tempo, then edit the slides to follow your melody.`,
    ],
    faqs: [
      {
        q: "What BPM is drill?",
        a: `Most drill is around 140 BPM. These patterns run from ${f.minBpm} to ${f.maxBpm} BPM, with most between ${f.coreMin} and ${f.coreMax}.`,
      },
      {
        q: "How do I make the 808 slide like UK drill?",
        a: "Load the 808 in a sampler set to mono (one voice) with glide or portamento on, and let consecutive notes overlap slightly.",
      },
      {
        q: "What's the difference between drill and trap hi-hats?",
        a: "Trap hats mostly run straight 1/16s with rolls. Drill hats use more triplets, rests and swing, which gives them a skippy, stop-start feel.",
      },
      {
        q: "Can I use these drill patterns in released songs?",
        a: "Yes. They're royalty-free for your own songs and beats, including commercial releases on Spotify, Apple Music and YouTube, with no credit needed. You can't resell or share the raw files.",
      },
    ],
  }),

  "808-bass": (f) => ({
    intro: [
      `An 808 is the long, tuned bass drum that came from the Roland TR-808 and now carries the low end of almost every trap, drill and modern rap beat. It does two jobs at once: it's the bassline, and it's the weight under the kick. These patterns are 808 lines only, for when you need a bassline that moves.`,
      `${tempoLine(f)} That covers slow melodic trap through to fast drill and rage.`,
      `An 808 pattern is about pitch, length and placement. Notes start with or near the kick, follow the song's key, and either ring long to fill the space or cut short to leave room for a bouncier groove. Slides, where one note glides into the next, give the line movement at the end of a phrase. This set from the ${f.kitName} kit has ${f.partsLine}, from simple root-note lines to sliding, syncopated basslines.`,
      `Load your 808 sample into a mono sampler so notes can't overlap, tune it (set the sampler's root note to the sample's real pitch), and turn on glide for the sliding lines. Then transpose the pattern so its first note is your song's root note, and adjust the rest to follow the chords.`,
    ],
    faqs: [
      {
        q: "What key are these 808 patterns in?",
        a: "Each pattern has its own pitches, but MIDI transposes freely. Select every note and move it so the first note matches your song's root note, then adjust individual notes to follow the chords.",
      },
      {
        q: "Why does my 808 sound out of tune?",
        a: "The sampler doesn't know the sample's real pitch. Set the sampler's root note to the note your 808 sample is tuned to, and the pattern will play in key.",
      },
      {
        q: "How do I stop 808 notes overlapping?",
        a: "Set the sampler to mono (one voice), or enable Cut itself in FL Studio. For slides, keep mono on and turn on glide or portamento.",
      },
    ],
  }),
};

export function genreCopy(slug: string) {
  const facts = genreFacts(slug);
  const build = COPY[slug];
  if (!facts || !build) return undefined;
  return { facts, ...build(facts) };
}
