import Link from "next/link";
import { buyerProse } from "@/components/buyer/BuyerShell";
import { KitPicks } from "@/components/buyer/KitPicks";
import { ONE_SHOT_COUNT } from "@/lib/bundle";
import {
  ALTERNATIVES_HUB,
  BEST_PATH,
  COMPARE_HUB,
  DRILL_BUY_PATH,
  TRAP_BUY_PATH,
  alternativePath,
  comparePath,
  type DawPage,
} from "@/lib/buyer-intent";
import { BUNDLE_NAME } from "@/lib/products";
import { genreForKit, genrePath } from "@/lib/patterns";

const prose = `${buyerProse} mt-12`;

export function DawBody({ daw }: { daw: DawPage }) {
  if (daw.slug === "fl-studio") return <FlBody />;
  if (daw.slug === "ableton") return <AbletonBody />;
  return <LogicBody />;
}

function SharedClose() {
  return (
    <p>
      The <Link href={TRAP_BUY_PATH}>trap buying guide</Link> and the{" "}
      <Link href={DRILL_BUY_PATH}>drill buying guide</Link> pick the kits apart.{" "}
      <Link href={BEST_PATH}>Best MIDI drum kits for 2026</Link> puts them next to Unison, Ghosthack,
      Toontrack, Splice and Cymatics. License details are in{" "}
      <Link href="/guides/royalty-free-midi-explained">royalty-free MIDI, explained</Link>.
    </p>
  );
}

function FlBody() {
  return (
    <>
      <div className={prose}>
        <h2>What to buy, not how to import it</h2>
        <p>
          The <Link href="/guides/how-to-use-midi-drums-in-fl-studio">FL Studio guide</Link> is the
          step-by-step: Channel Rack versus Piano Roll, mapping notes to C5, and leaving the project tempo
          alone. This page is the purchase. Every kit below is standard .mid, so FL Studio 20, 21 and 2024
          open them the same way.
        </p>
        <p>
          {`Separate files are the part that matters in FL. A hat pattern, a snare, a kick and an 808 each land on their own Sampler channel. You don't split a mixed clip, and you don't fight the step sequencer, which can't show 1/32 rolls. The guide says to use the Piano Roll for hats and 808s. The files are already one part each, which is why that workflow stays short.`}
        </p>
        <h2>Kits that match how FL trap sessions actually start</h2>
        <p>
          Essentials Vault is the trap set. Black Market Heist is the harder street-trap set. Decoy Protocol
          is drill. Focus 808 Lab is only 808s, which is what you drop under a melody you already wrote.
          {` ${BUNDLE_NAME} adds the rest of the catalog and ${ONE_SHOT_COUNT} one-shots, so the Sampler channels have sounds if you don't have a favorite hat yet.`}
        </p>
      </div>
      <KitPicks ids={["essentials", "black-market", "decoy", "focus"]} bundle />
      <div className={prose}>
        <h2>Try one file in the Channel Rack first</h2>
        <p>
          Preview a pattern on the <Link href="/midi/trap">trap hub</Link> or take the free kit and drag a
          single .mid onto a Sampler channel. The <Link href="/beat-maker">beat maker</Link> will also export
          a whole trap beat, or one track, as MIDI for the same rack. If the notes come out pitched, the
          guide&apos;s mapping section is the fix. It isn&apos;t a different file format.
        </p>
        <SharedClose />
      </div>
    </>
  );
}

function AbletonBody() {
  return (
    <>
      <div className={prose}>
        <h2>Clips for a Drum Rack</h2>
        <p>
          Live doesn&apos;t keep the tempo baked into a .mid file. Drop it on a MIDI track and the clip plays
          at the set&apos;s tempo. The <Link href="/guides/how-to-use-midi-drums-in-ableton">Ableton guide</Link>{" "}
          covers the part that actually takes time: building a Drum Rack, moving notes onto the pads that have
          samples, and adding swing from the Groove Pool. Live 11 and 12, Standard and Suite, use the same
          files.
        </p>
        <p>
          A silent clip is almost always an empty pad, not a bad MIDI file. Hats, snares, kicks and 808s ship
          as separate files so each one can be its own rack or its own chain. That&apos;s easier to map than a
          single clip with four drums stacked on one piano roll.
        </p>
        <h2>Which kit to put on the rack</h2>
        <p>
          Use Essentials Vault for trap, Midnight Odyssey when the beat is melodic, Psycho Ward for dark trap,
          and Decoy Protocol for drill. Focus 808 Lab is the low end on its own clip, with glide turned on in
          Simpler or Sampler if you want the slides the pattern was written for.
        </p>
      </div>
      <KitPicks ids={["essentials", "odyssey", "psycho", "decoy", "focus"]} bundle />
      <div className={prose}>
        <h2>Preview, then drag into Session View</h2>
        <p>
          Every pattern page has a player. The <Link href="/midi/drill">drill hub</Link> and the{" "}
          <Link href="/midi/dark-trap">dark trap hub</Link> are the shortlists. The free kit is enough to test
          mapping before you buy a full kit. Nothing here requires a subscription. Kits are one-time. Credit
          plans on <Link href="/pricing">pricing</Link> are only if you want single files later.
        </p>
        <SharedClose />
      </div>
    </>
  );
}

function LogicBody() {
  const drill = genreForKit("decoy");
  return (
    <>
      <div className={prose}>
        <h2>Drop a .mid file on a software instrument</h2>
        <p>
          {`There isn't a separate Logic guide on this site, because the import is short. Drag the .mid file from Finder onto a software instrument track in the Tracks area. Logic also imports MIDI from the File menu. Set the project tempo to the BPM on the pattern page. The file follows that tempo.`}
        </p>
        <p>
          Drum Machine Designer, Quick Sampler, Sampler, or any third-party instrument will play it. You
          don&apos;t need Drum Machine Designer. You do need the notes on the pads or keys that hold your
          samples. If a hat plays as a tom, select the notes and move them. That&apos;s the same mapping step
          as in the <Link href="/guides/how-to-use-midi-drums-in-fl-studio">FL Studio</Link> and{" "}
          <Link href="/guides/how-to-use-midi-drums-in-ableton">Ableton</Link> guides.
        </p>
        <p>
          808 files are notes. Sliding lines need glide or portamento on the instrument, with the notes long
          enough to overlap. The pattern doesn&apos;t replace Logic&apos;s glide setting.
        </p>
        <h2>Same kits as every other DAW</h2>
        <p>
          Nothing in the zip is Logic-specific, which is the point. Essentials Vault is the trap kit. Decoy
          Protocol is drill
          {drill ? (
            <>
              {" "}
              (<Link href={genrePath(drill)}>preview the drill files</Link>)
            </>
          ) : null}
          . {BUNDLE_NAME} is every kit plus {ONE_SHOT_COUNT} one-shots if you want sounds and patterns in one
          download.
        </p>
      </div>
      <KitPicks ids={["essentials", "decoy", "black-market", "focus"]} bundle />
      <div className={prose}>
        <h2>Check the groove before it hits the Tracks area</h2>
        <p>
          Use the pattern pages or the free kit. The <Link href="/beat-maker">beat maker</Link> exports MIDI
          you can drag into Logic the same way. <Link href="/tools/bpm-key-finder">The BPM and key finder</Link>{" "}
          stays in the browser if you need the tempo of a reference track before you set Logic&apos;s LCD.
        </p>
        <SharedClose />
      </div>
    </>
  );
}

export function TrapBuyBody() {
  return (
    <>
      <div className={prose}>
        <h2>This is the buying page. The hub is the browser.</h2>
        <p>
          <Link href="/midi/trap">Trap MIDI patterns</Link> lists 98 files with a player on each one. Street
          trap, melodic trap and dark trap have their own hubs. This page is which product those files belong
          to, and which other trap packs are actually drum MIDI.
        </p>
        <p>
          The programming guide, if you want the grid itself, is{" "}
          <Link href="/guides/how-to-make-trap-drums">how to make trap drums</Link>: tempo, the snare on beat
          3, hat rolls, and the 808 with the kick. The kits below are that grid, already written, ready to
          edit.
        </p>
        <h2>MidiRoad kits, by the beat you&apos;re making</h2>
        <p>
          Essentials Vault is the broad trap kit and the one to open first. Black Market Heist is street trap.
          Midnight Odyssey is melodic. Psycho Ward is dark. Focus 808 Lab is 808s only, from 110 to 170 BPM,
          for when the drums exist and the low end doesn&apos;t. Decoy Protocol is drill, linked from the drill
          guide, not a trap kit. {BUNDLE_NAME} is all six, plus {ONE_SHOT_COUNT} one-shots.
        </p>
      </div>
      <KitPicks ids={["essentials", "black-market", "odyssey", "psycho", "focus"]} bundle />
      <div className={prose}>
        <h2>Other trap MIDI worth a look</h2>
        <p>
          {`Unison's Trap MIDI Drum Collection is the large MIDI-only folder: they describe 250+ patterns in 50 kits, listed at $17 when we checked, royalty-free, any DAW. That's more trap files than Essentials Vault. There's no per-pattern player on the page we read. The full table is MidiRoad vs Unison.`}
        </p>
        <p>
          Ghosthack Trap Drums is the pack to buy if you want loops, stems and one-shots with MIDI attached:
          215 MIDI files, 40 kits, 120 to 160 BPM, listed at €37 including VAT. Buy it for the audio. The
          comparison is <Link href={comparePath("ghosthack")}>MidiRoad vs Ghosthack</Link>.
        </p>
        <p>
          Splice is a subscription, not a kit. Cymatics APEX trap MIDI is chords and top lines, not drums.
          Toontrack&apos;s hip-hop grooves are a session drummer at 73 to 125 BPM, for EZdrummer. Those three
          are on the <Link href={BEST_PATH}>best-of list</Link> so the differences stay in one place.
        </p>
        <h2>License and the DAW</h2>
        <p>
          Everything we sell is royalty-free for your songs and beats, including beats you sell. You can&apos;t
          resell the raw files. FL Studio and Ableton each have an import guide. Logic is covered on the{" "}
          <Link href="/midi-drums-for/logic">Logic page</Link>. The files are the same .mid in all three.
        </p>
      </div>
    </>
  );
}

export function DrillBuyBody() {
  return (
    <>
      <div className={prose}>
        <h2>Decoy Protocol is the drill kit</h2>
        <p>
          It&apos;s a small kit on purpose: snares, hi-hats and 808s, 130 to 170 BPM. The{" "}
          <Link href="/midi/drill">drill hub</Link> plays every file. Buy the kit after you&apos;ve heard the
          hats, not before. Eighteen patterns is enough to start a beat (one hat, one snare, one 808) and not
          enough to pretend it&apos;s a 200-file library.
        </p>
        <p>
          If the hat pocket is too small, Essentials Vault has a much larger hat folder in trap tempos that
          overlap drill. Focus 808 Lab is extra 808 lines. Those are separate kits. The bundle is how you get
          them without three checkouts. They aren&apos;t labeled drill, and the hub copy for drill stays on
          the hub so this page doesn&apos;t repeat it.
        </p>
      </div>
      <KitPicks ids={["decoy", "essentials", "focus"]} bundle />
      <div className={prose}>
        <h2>What other &ldquo;drill MIDI&rdquo; products actually are</h2>
        <p>
          Cymatics APEX includes a drill library. On their page it&apos;s melody MIDI: progressions to put
          over drill drums, not the drums. The <Link href={comparePath("cymatics")}>Cymatics comparison</Link>{" "}
          keeps that distinction, with the source link.
        </p>
        <p>
          {`Ghosthack's UK Drill Essentials is a sample pack. The contents list 20 MIDI files and five construction kits at 140 to 160 BPM, plus drums, 808s, loops and one-shots. The page we loaded had it on sale. That's the right buy if you want their sounds. It isn't a pattern-by-pattern drum library. Trap Drums, their other pack, isn't a drill product.`}
        </p>
        <p>
          Unison&apos;s public drum collections we checked include trap, and future bass with melodic trap.
          We didn&apos;t find a separate drill drum collection on those pages, so we aren&apos;t describing
          one. Their trap folder is covered on the <Link href={alternativePath("unison")}>Unison alternative</Link>.
        </p>
        <h2>Using the files</h2>
        <p>
          Same royalty-free terms as the trap kits: your releases, not the raw files. The{" "}
          <Link href="/guides/how-to-use-midi-drums-in-fl-studio">FL Studio</Link> and{" "}
          <Link href="/guides/how-to-use-midi-drums-in-ableton">Ableton</Link> guides both use a drill hat as
          one of the examples. Logic is the <Link href="/midi-drums-for/logic">Logic buying page</Link>.
        </p>
      </div>
    </>
  );
}

export function BestBody() {
  return (
    <>
      <div className={prose}>
        <h2>How this list was chosen</h2>
        <p>
          {`It's a shortlist for trap and drill producers shopping in ${"2026"}, not a ranked chart and not a paid placement. We included products whose public pages actually sell MIDI, then wrote down what those pages say. MidiRoad is ours. The others are here because they're the packs people compare us with. Nobody paid for a slot. Prices were checked in November 2026 and move when a sale starts.`}
        </p>
        <p>
          A &ldquo;best drum kit&rdquo; that is really a melody pack, or a live-drummer library, or a sample
          loop with MIDI attached, will waste the money if you needed hat patterns. The job is named under
          each entry.
        </p>
        <h2>Programmed trap and drill drums you can preview</h2>
        <p>
          {`MidiRoad. Six kits, ${BUNDLE_NAME} if you want all of them plus ${ONE_SHOT_COUNT} one-shots. Every pattern plays in the browser. The license is royalty-free for your songs and beats, and it doesn't let you resell the files. Essentials Vault is the trap kit. Decoy Protocol is the drill kit, and it's a small one: 18 patterns. Unison's trap folder advertises more files than our whole catalog. We'd rather say that here than imply a trophy.`}
        </p>
      </div>
      <KitPicks ids={["essentials", "decoy", "black-market", "focus"]} bundle />
      <div className={prose}>
        <h2>The biggest trap MIDI folder on this list</h2>
        <p>
          Unison&apos;s Trap MIDI Drum Collection. Their page says 50 kits and 250+ drag-and-drop patterns,
          royalty-free, any DAW, no plugin, listed at $17, with a 60-day refund. You bring your own samples.
          We didn&apos;t find a per-file player. Read{" "}
          <Link href={comparePath("unison")}>MidiRoad vs Unison</Link> before you pick on count alone, because
          the files are cut differently.
        </p>
        <h2>Trap audio, with MIDI that matches it</h2>
        <p>
          Ghosthack Trap Drums. Forty kits of loops, stems and one-shots from 120 to 160 BPM, plus 215 MIDI
          files, royalty-free, listed at €37 including VAT. This is the best option on the list when you want
          the sound of the pack, not a silent pattern. Their UK Drill Essentials is a separate, mostly-audio
          drill pack with 20 MIDI files. Details are on{" "}
          <Link href={comparePath("ghosthack")}>MidiRoad vs Ghosthack</Link>.
        </p>
        <h2>A drummer&apos;s hip-hop grooves</h2>
        <p>
          Toontrack Hip-Hop Grooves MIDI. About 70 tracks with variations, played by a session drummer, boom
          bap through trap, 73 to 125 BPM, listed at $29, no sounds in the pack. It&apos;s built for
          EZdrummer and Superior Drummer. The page doesn&apos;t state a royalty-free license, so we
          don&apos;t claim one. It&apos;s the right buy for played hip-hop inside their software, and the
          wrong buy for programmed 808 rolls.{" "}
          <Link href={comparePath("toontrack")}>MidiRoad vs Toontrack</Link>.
        </p>
        <h2>A subscription, when MIDI is only part of the month</h2>
        <p>
          Splice. Credits, not a kit. Sounds was $12.99 a month when we checked. MIDI is up to 3 credits, and
          their help center describes it as basslines, melodies and chord progressions, with drum MIDI inside
          some packs rather than one trap collection. Previews play in the browser. The license on downloads
          survives cancellation. <Link href={comparePath("splice")}>MidiRoad vs Splice</Link>.
        </p>
        <h2>Trap and drill melodies, not drums</h2>
        <p>
          Cymatics APEX MIDI. The page says 2,600+ royalty-free MIDI files across 12 genres. Trap and drill
          are chord progressions and top lines meant to sit over drums. Genre collections were listed at $20.
          Buy it when the drums exist and the harmony doesn&apos;t.{" "}
          <Link href={comparePath("cymatics")}>MidiRoad vs Cymatics</Link>.
        </p>
        <h2>A way to choose without rereading all of that</h2>
        <ul>
          <li>You want to hear every drum pattern in the browser, then own the files: MidiRoad.</li>
          <li>You want the largest trap MIDI folder these pages found: Unison.</li>
          <li>You want loops and one-shots with the MIDI: Ghosthack.</li>
          <li>You want a session drummer in EZdrummer: Toontrack.</li>
          <li>You already live in a sample subscription: Splice.</li>
          <li>You need chords and top lines: Cymatics, and a drum kit from someone else.</li>
        </ul>
        <p>
          The <Link href={COMPARE_HUB}>comparison hub</Link> links every table. The{" "}
          <Link href={ALTERNATIVES_HUB}>alternatives index</Link> is the shorter version of each one. Pattern
          hubs under <Link href="/midi">/midi</Link> are where you audition our files, and the{" "}
          <Link href="/guides">guides</Link> are the import steps.
        </p>
      </div>
    </>
  );
}
