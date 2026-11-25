import { Eyebrow } from "@/components/Section";
import { TrackedLink } from "@/components/TrackedLink";

/**
 * The chord maker next to a ready-made chord pack (Unison's MIDI Chord Pack).
 * Keep every claim about Unison to what its own sales page says: 1,200+
 * ready-made MIDI files in folders by key, royalty free, drag and drop into
 * any DAW. No prices (theirs change with sales).
 */
const ROWS: { feature: string; ours: string; pack: string }[] = [
  {
    feature: "Progressions",
    ours: "New ones on every click, plus presets for trap, drill, lo-fi, pop, RnB and more",
    pack: "1,200+ ready-made files, the same set for everyone",
  },
  {
    feature: "Changing a chord",
    ours: "Swap any chord, make it a 7th, add9 or sus, or draw notes on the piano roll, right in the browser",
    pack: "Edit the notes yourself in your DAW after you drag the file in",
  },
  {
    feature: "Key",
    ours: "Any of 12 keys, major or minor, in one click. Your edits move with it",
    pack: "Pick the file from the folder for your key",
  },
  {
    feature: "Voicing",
    ours: "Each chord takes the inversion closest to the last, so it moves smoothly",
    pack: "As written in each file",
  },
  {
    feature: "Rhythm and bass",
    ours: "Whole notes, pulses, stabs or arpeggios, with an optional bass track",
    pack: "As written in each file",
  },
  {
    feature: "Hear it first",
    ours: "Plays in the browser with keys, pad or pluck before you download",
    pack: "Load it on an instrument in your DAW",
  },
  {
    feature: "Royalty free",
    ours: "Yes",
    pack: "Yes",
  },
];

export function ChordPackCompare() {
  return (
    <section aria-labelledby="chord-pack-compare" className="bg-background px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Eyebrow className="mb-3">Chord maker vs. chord packs</Eyebrow>
        <h2 id="chord-pack-compare" className="max-w-3xl text-[28px] leading-[1.05] md:text-[40px]">
          Why settle for a folder of chord files?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Packs like the Unison MIDI Chord Pack give you a big folder of fixed progressions to dig through. The chord
          maker writes the progression with you: hear it, change any chord, then take exactly that into your DAW.
        </p>

        <div className="mt-8 overflow-hidden rounded-md border border-line bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">MidiRoad chord maker compared with the Unison MIDI Chord Pack</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="hidden w-[22%] px-4 py-3 font-semibold text-muted md:table-cell md:px-5" />
                <th scope="col" className="px-4 py-3 font-semibold text-brand md:px-5">MidiRoad chord maker</th>
                <th scope="col" className="px-4 py-3 font-semibold text-muted md:px-5">Unison MIDI Chord Pack</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-line align-top last:border-b-0">
                  <th scope="row" className="hidden px-4 py-3.5 font-semibold text-ink md:table-cell md:px-5">
                    {row.feature}
                  </th>
                  <td className="px-4 py-3.5 leading-relaxed text-ink md:px-5">
                    <span className="mb-1 block text-xs font-semibold text-muted md:hidden">{row.feature}</span>
                    {row.ours}
                  </td>
                  <td className="px-4 py-3.5 leading-relaxed text-muted md:px-5">
                    <span className="mb-1 block text-xs font-semibold md:hidden">&nbsp;</span>
                    {row.pack}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <TrackedLink
            href="/pricing"
            track={{ action: "click_pricing", category: "navigation", label: "chord_pack_compare" }}
            className="inline-flex h-12 items-center rounded-key bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Get chord MIDI downloads
          </TrackedLink>
          <p className="text-sm text-muted">Playing is free. Downloads come with every plan.</p>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
          Unison and Unison MIDI Chord Pack belong to their owner. MidiRoad isn&apos;t affiliated with or endorsed by
          Unison. Pack details are from Unison&apos;s own product page and may have changed since.
        </p>
      </div>
    </section>
  );
}
