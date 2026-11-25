import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { FAQS } from "@/lib/faq";
import { BUNDLE_NAME, BUNDLE_PRICE, KIT_PRODUCTS, kitStats } from "@/lib/products";
import { GUIDES, guidePath } from "@/lib/guides";
import { FREE_KIT_COUNT, FREE_KIT_MAX_BPM, FREE_KIT_MIN_BPM, FREE_KIT_PATH } from "@/lib/free-kit";
import { GENRES, genrePath } from "@/lib/patterns";
import { SITE_DESCRIPTION, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt (https://llmstxt.org): a plain-text summary of the store for AI
 * assistants, built from the same data as the pages so it stays current.
 */
export function GET() {
  const usd = (n: number) => `$${n.toFixed(2)}`;
  const kits = KIT_PRODUCTS.map((kit) => {
    const s = kitStats(kit);
    return `- [${kit.name}](${absoluteUrl(`/kits/${kit.slug}`)}): ${kit.tagline} ${s.patterns} MIDI patterns (${s.parts.join(", ")}), ${s.minBpm}–${s.maxBpm} BPM. ${usd(kit.price)}.`;
  });

  const body = `# MidiRoad

> ${SITE_DESCRIPTION}

MidiRoad sells royalty-free MIDI drum kits made for trap, drill, dark trap and RnB. Each kit is a download of drag-and-drop MIDI drum patterns (hi-hats, snares, kicks and 808s) that work in FL Studio, Ableton Live, Logic Pro, Studio One, Reason, Cubase, Pro Tools and any DAW that opens MIDI. Everything is royalty-free for commercial releases.

## Products

- [${BUNDLE_NAME}](${absoluteUrl("/")}): every kit in one download, ${MIDI_PATTERN_COUNT} MIDI drum patterns and ${ONE_SHOT_COUNT} drum one-shots (WAV). ${usd(BUNDLE_PRICE)}, the best value.
${kits.join("\n")}

## Free tools

- [Free MIDI drum kit](${absoluteUrl(FREE_KIT_PATH)}): ${FREE_KIT_COUNT} royalty-free MIDI drum patterns (two each from trap, street trap, melodic trap, dark trap, drill and 808 bass, ${FREE_KIT_MIN_BPM}–${FREE_KIT_MAX_BPM} BPM), free for an email address. No account needed.
- [Free trap beat maker](${absoluteUrl("/beat-maker")}): generates a trap beat (hats, snare, kick, 808) in the browser, with tempo, key, sound picks and mutes. Export the whole beat or a single track as MIDI.
- [Free chord progression maker](${absoluteUrl("/chord-maker")}): builds a four-bar chord progression in any major or minor key, editable on a piano roll, with rhythm, sound and bass options. Playing is free; the MIDI download is for subscribers.
- [MIDI pattern pages](${absoluteUrl("/midi")}): one public page per pattern, with a browser preview. The MIDI file stays a paid download (buy the kit, or unlock one file with 1 credit).
${GENRES.map((genre) => `- [${genre.name} MIDI patterns](${absoluteUrl(genrePath(genre))})`).join("\n")}
- [Patterns by tempo](${absoluteUrl("/midi/bpm")})
- [Pricing](${absoluteUrl("/pricing")}): monthly MIDI credit plans for the library and the beat maker. New accounts get free credits.

## Guides

- [All guides](${absoluteUrl("/guides")})
${GUIDES.map((guide) => `- [${guide.title}](${absoluteUrl(guidePath(guide))}): ${guide.summary}`).join("\n")}

## FAQ

${FAQS.map((f) => `- ${f.q} ${f.a}`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
