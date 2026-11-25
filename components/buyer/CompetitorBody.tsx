import Link from "next/link";
import { CompareTable } from "@/components/buyer/CompareTable";
import { ChooseColumns, buyerProse } from "@/components/buyer/BuyerShell";
import { KitPicks } from "@/components/buyer/KitPicks";
import {
  CHECKED,
  HIGHEST_KIT_PRICE,
  LOWEST_KIT_PRICE,
  comparisonRows,
  type Competitor,
} from "@/lib/buyer-intent";
import { BUNDLE_NAME, BUNDLE_PRICE, kitById, kitStats } from "@/lib/products";
import { formatUSD } from "@/lib/pricing";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";

const prose = `${buyerProse} mt-12`;

function Table({ competitor, caption }: { competitor: Competitor; caption: string }) {
  return (
    <CompareTable
      caption={caption}
      theirsLabel={competitor.product}
      rows={comparisonRows(competitor)}
    />
  );
}

function EndLinks() {
  return (
    <p>
      Preview files on the <Link href="/midi/trap">trap</Link> and <Link href="/midi/drill">drill</Link> hubs,
      or read <Link href="/guides/royalty-free-midi-explained">what royalty-free MIDI allows</Link> before you
      release anything. Import steps live in the{" "}
      <Link href="/guides/how-to-use-midi-drums-in-fl-studio">FL Studio</Link> and{" "}
      <Link href="/guides/how-to-use-midi-drums-in-ableton">Ableton</Link> guides. Prices below for MidiRoad are
      the ones charged here. Theirs are from {CHECKED}.
    </p>
  );
}

export function AlternativeBody({ competitor }: { competitor: Competitor }) {
  switch (competitor.slug) {
    case "unison":
      return <UnisonAlternative competitor={competitor} />;
    case "splice":
      return <SpliceAlternative competitor={competitor} />;
    case "cymatics":
      return <CymaticsAlternative competitor={competitor} />;
    case "ghosthack":
      return <GhosthackAlternative competitor={competitor} />;
    case "toontrack":
      return <ToontrackAlternative competitor={competitor} />;
  }
}

export function CompareBody({ competitor }: { competitor: Competitor }) {
  switch (competitor.slug) {
    case "unison":
      return <UnisonCompare competitor={competitor} />;
    case "splice":
      return <SpliceCompare competitor={competitor} />;
    case "cymatics":
      return <CymaticsCompare competitor={competitor} />;
    case "ghosthack":
      return <GhosthackCompare competitor={competitor} />;
    case "toontrack":
      return <ToontrackCompare competitor={competitor} />;
  }
}

function UnisonAlternative({ competitor }: { competitor: Competitor }) {
  const essentials = kitById("essentials");
  const essentialsCount = essentials ? kitStats(essentials).patterns : 0;
  return (
    <>
      <div className={prose}>
        <h2>What the Unison trap collection is</h2>
        <p>
          {`Unison sells MIDI drum collections one genre at a time. The trap page says you get 50 MIDI drum kits and 250+ patterns, drag-and-drop, with no plugin to install. The FAQ lists FL Studio, Ableton, Logic Pro, Studio One, Pro Tools, Cubase, Reason, Reaper, GarageBand, Cakewalk, Mixcraft and other DAWs. It also says the files are royalty-free for beats you sell and for releases on Spotify, YouTube and iTunes, and that you can email them within 60 days for a refund.`}
        </p>
        <p>
          {`The same shape of product exists for other genres, sold separately. The hip-hop and rap collection and the future bass and melodic trap collection are each described as 250+ patterns too. Buying "trap drums from Unison" is one pack, not their whole drum catalog. The page we loaded listed the trap collection at $17. Unison discounts packs, so the number you see can be lower.`}
        </p>
        <p>
          {`The page describes MIDI, used with your own drum samples. It doesn't list a folder of one-shots inside this collection. That's the same idea as a MidiRoad kit: the rhythm is the file, the sound is whatever you load.`}
        </p>
      </div>
      <Table competitor={competitor} caption="MidiRoad compared with the Unison Trap MIDI Drum Collection" />
      <div className={prose}>
        <h2>The pattern counts are not the same unit</h2>
        <p>
          {`Unison's 250+ is a bigger trap folder than we sell. Essentials Vault, our trap kit, is ${essentialsCount} patterns. The whole MidiRoad catalog is ${MIDI_PATTERN_COUNT} patterns across six kits. If you want the largest advertised pile of trap drum MIDI, their page is ahead, and this page shouldn't talk you out of that.`}
        </p>
        <p>
          {`What the number doesn't say is how the files are cut. MidiRoad splits hi-hats, snares, kicks, open hats and 808s into separate files, and each one has a page that plays in the browser. Unison describes 50 kits inside the 250+. We didn't find a per-file player on their trap page, so you hear a pattern after it is in the DAW.`}
        </p>
        <p>
          {`${BUNDLE_NAME} is ${formatUSD(BUNDLE_PRICE)} and adds drill plus ${ONE_SHOT_COUNT} one-shots. That is a different purchase from a single-genre MIDI folder. Pick the folder if count is the point. Pick the catalog if you want to audition parts, then buy the kit that fits.`}
        </p>
      </div>
      <ChooseColumns themLabel="Unison" them={competitor.chooseThem} us={competitor.chooseUs} />
      <div className={prose}>
        <h2>MidiRoad kits that cover the same job</h2>
        <p>
          Start with the trap kit if their collection is what you were about to buy. Add a flavor kit only if
          the tagline matches the beat. Every price is a one-time download.
        </p>
      </div>
      <KitPicks ids={["essentials", "black-market", "odyssey", "psycho", "decoy", "focus"]} bundle />
      <div className={prose}>
        <h2>Hear a pattern before you buy either folder</h2>
        <EndLinks />
        <p>
          Unison also sells a MIDI Chord Pack. That is a different product from this drum collection. The{" "}
          <Link href="/chord-maker">chord maker</Link> comparison on the homepage is about chords, not drums.
        </p>
      </div>
    </>
  );
}

function SpliceAlternative({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <div className={prose}>
        <h2>Splice sells access, not a kit</h2>
        <p>
          {`A Splice plan gives you credits. When we checked, Sounds was $12.99 a month and Creator was $19.99 a month, with a $4.99 Creator trial on the plans page. Samples cost 1 credit. MIDI files and presets cost up to 3. Unused credits roll over while the subscription stays on. Their help center says a MIDI file is a note sequence, often a bassline, melody or chord progression, and that the audio you preview is an example instrument, not audio inside the file.`}
        </p>
        <p>
          {`There is no Splice product called a trap drum kit with a pattern count we can quote. Drum MIDI shows up inside some packs, next to loops and one-shots. If your Splice habit is "download a hat MIDI, a loop and a Serum preset," a drum-kit store doesn't replace that. If the habit is "I need trap drums and I'm tired of credits," it does.`}
        </p>
      </div>
      <Table competitor={competitor} caption="MidiRoad compared with Splice Sounds MIDI" />
      <div className={prose}>
        <h2>What you keep if you cancel</h2>
        <p>
          {`Splice's license FAQ says sounds you downloaded stay licensed for commercial use after you cancel, and that you can't redistribute those files on their own or inside a new sample pack. The plans FAQ says leftover credits expire 28 days after the last billing period unless you resubscribe, and that you can put a plan on hold. Their plans page also says you own what you make. The license FAQ is more precise: you own the new recording, not the sounds inside it.`}
        </p>
        <p>
          {`A MidiRoad kit is one charge. The download link comes back by email. There's nothing to cancel, and the raw files aren't yours to resell. Both licenses allow a song on Spotify. They don't allow the same thing if your plan is to republish the source files.`}
        </p>
        <p>
          Splice also lists in-DAW tools on the plans page: Bridge, plus integrations for recent Pro Tools,
          Studio One and Ableton Live. MidiRoad is the file itself. Any DAW that opens .mid can use it, with
          no plugin.
        </p>
      </div>
      <ChooseColumns themLabel="Splice" them={competitor.chooseThem} us={competitor.chooseUs} />
      <div className={prose}>
        <h2>The kit you would buy instead of another month</h2>
        <p>
          {`One month of Sounds, at the price we saw, costs more than several of these kits and less than a year of digging. Buy the kit that matches the beat. You can still keep Splice for samples. They solve different weeks.`}
        </p>
      </div>
      <KitPicks ids={["essentials", "decoy", "black-market", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
        <p>
          Single files, if you want them without a kit, are the{" "}
          <Link href="/pricing">credit plans</Link>. One credit is one MIDI file. That is optional. The kits
          don&apos;t require it.
        </p>
      </div>
    </>
  );
}

function CymaticsAlternative({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <div className={prose}>
        <h2>APEX MIDI is a melody library</h2>
        <p>
          {`The Cymatics APEX page describes 2,600+ MIDI files across 12 genres, handcrafted as progressions. Trap is in there, described as dark chord progressions and top lines for heavy drums and 808s. Drill is in there too, described as melodies and phrasing to layer over drill drums. Individual genre collections were listed at $20 each on that overview. We aren't quoting their bundle price, because the offer on the page moves.`}
        </p>
        <p>
          {`That is a useful product. It is not hi-hat rolls, snares and kicks. Searching "Cymatics alternative" from a drum session and landing on another melody pack would miss the point. A drum kit is the alternative only when the missing part is the rhythm. If the missing part is the chords, stay with Cymatics, or use a chord tool, and buy drums separately.`}
        </p>
        <p>
          {`Their page says those melodies are royalty-free for your own sample packs, beat sales, placements and sync. That's broader wording than MidiRoad's drum license, which is for your songs and beats and not for reselling the raw files. Read both terms before you put someone else's MIDI into a pack you sell.`}
        </p>
      </div>
      <Table competitor={competitor} caption="MidiRoad drum kits compared with Cymatics APEX MIDI" />
      <ChooseColumns themLabel="Cymatics" them={competitor.chooseThem} us={competitor.chooseUs} />
      <div className={prose}>
        <h2>Drums to put under a Cymatics progression</h2>
        <p>
          If you already own their trap or drill MIDI, these are the kits that supply the rhythm those
          melodies are written to sit on. The chord maker is a different, smaller tool: four bars, in the
          browser, free to play, with the download on a plan. It is not a 2,600-file library.
        </p>
      </div>
      <KitPicks ids={["essentials", "decoy", "odyssey", "psycho", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
        <p>
          <Link href="/chord-maker">Open the chord maker</Link> if you want to hear a progression before you
          commit to a melody pack.
        </p>
      </div>
    </>
  );
}

function GhosthackAlternative({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <div className={prose}>
        <h2>Trap Drums is a sample pack with MIDI in it</h2>
        <p>
          {`Ghosthack's Trap Drums page lists 40 drum kits from 120 to 160 BPM, each with a full mix, stems and one-shots, plus 215 MIDI files. The one-shot list includes claps, hats, kicks, snares, crashes and 20 808s. The file list also counts 256 stem loops. The whole pack was listed at €37 including VAT when we loaded it. They discount packs, and the currency on the page can depend on where the store thinks you are.`}
        </p>
        <p>
          {`The license on that page is the straightforward commercial one: royalty-free, Spotify, YouTube, Apple Music, film, games, videos and podcasts, and you keep the royalties. Refunds are 30 days. WAV files drag into any DAW. The MIDI is there so you can keep their groove and change the sound.`}
        </p>
        <p>
          {`MidiRoad doesn't replace that if what you wanted was their loops. A MIDI pattern is silent. Their loop is already a beat. The alternative is for the producer who has drums and wanted the rhythms, or who wants to preview every part before paying €37 for a gigabyte of audio.`}
        </p>
      </div>
      <Table competitor={competitor} caption="MidiRoad compared with Ghosthack Trap Drums" />
      <div className={prose}>
        <h2>Their drill pack is a different product</h2>
        <p>
          {`Trap Drums isn't labeled as drill. UK Drill Essentials is the drill release: drums, 808s, loops and one-shots, 20 MIDI files, and five construction kits at 140 to 160 BPM. The page we loaded showed it on sale. Treat that as a sample pack with a little MIDI, not as a drum-pattern library. Decoy Protocol is MidiRoad's drill kit, and you can preview all of it on the drill hub.`}
        </p>
      </div>
      <ChooseColumns themLabel="Ghosthack" them={competitor.chooseThem} us={competitor.chooseUs} />
      <div className={prose}>
        <h2>Patterns, if the loops aren&apos;t what you needed</h2>
      </div>
      <KitPicks ids={["essentials", "black-market", "decoy", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
      </div>
    </>
  );
}

function ToontrackAlternative({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <div className={prose}>
        <h2>Hip-Hop Grooves is a drummer, not a trap kit</h2>
        <p>
          {`Toontrack's Hip-Hop Grooves MIDI page says a session drummer played grooves from about 70 tracks, with variations. The styles named on the page are boom bap, Detroit offbeat, old-school rap, G-funk, new jack swing and trap. Tempos run from 73 to 125 BPM, in straight, swing or halftime. The pack was listed at $29. The page says it contains no sounds, and that the demos are the MIDI played through EZdrummer or Superior Drummer.`}
        </p>
        <p>
          {`The installer is built for those instruments. Toontrack's FAQ says it needs EZdrummer 2 or 3, or Superior Drummer 2 or 3, and that without them you open the download and pull the .mid files out yourself. That works. It is an extra step, and you still have to map the notes to a drum plugin.`}
        </p>
        <p>
          {`The product page does not say the pack is royalty-free. We won't fill that in. If you release commercially, read their license. MidiRoad's license is written on the site: your songs and beats, including commercial releases, and no resale of the raw files.`}
        </p>
      </div>
      <Table competitor={competitor} caption="MidiRoad compared with Toontrack Hip-Hop Grooves MIDI" />
      <div className={prose}>
        <h2>When a programmed kit is the wrong alternative</h2>
        <p>
          {`If the record needs a person playing boom bap or G-funk inside EZdrummer, MidiRoad is not the substitute. We don't sell that. The overlap is the word "trap" on both pages, and even there the tempos differ: their pack stops at 125 BPM, and a lot of programmed trap sits higher, felt in half time.`}
        </p>
      </div>
      <ChooseColumns themLabel="Toontrack" them={competitor.chooseThem} us={competitor.chooseUs} />
      <div className={prose}>
        <h2>Programmed trap and drill, if that&apos;s the beat</h2>
      </div>
      <KitPicks ids={["essentials", "decoy", "psycho", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
      </div>
    </>
  );
}

function UnisonCompare({ competitor }: { competitor: Competitor }) {
  const essentials = kitById("essentials");
  const stats = essentials ? kitStats(essentials) : undefined;
  return (
    <>
      <Table competitor={competitor} caption="Feature comparison of MidiRoad and the Unison Trap MIDI Drum Collection" />
      <div className={prose}>
        <h2>What each number is counting</h2>
        <p>
          {`Unison's trap page says 250+ patterns across 50 kits. ${stats ? `Essentials Vault is ${stats.patterns} files from ${stats.minBpm} to ${stats.maxBpm} BPM. ` : ""}The full MidiRoad catalog is ${MIDI_PATTERN_COUNT} files. Their folder is bigger. Ours is split by drum part, and it isn't all trap: street trap, melodic trap, dark trap, drill and 808s are separate kits you can skip.`}
        </p>
        <p>
          {`A "kit" on their page is a group of MIDI patterns. A kit on this site is a product with a price and a zip. Comparing "50 kits" with "6 kits" without that sentence makes us look smaller than the file counts do, and makes them look larger than a single purchase is. One Unison genre is one checkout. Their other genres are more checkouts.`}
        </p>
        <h2>Hearing the part</h2>
        <p>
          {`Every MidiRoad pattern has a URL and a player. You can decide the hat roll is wrong before you pay. The Unison trap page we read is a sales page: you buy, then open the MIDI. That's fine if you trust the folder. It's a weak way to shop if you write slowly and only need eight patterns.`}
        </p>
        <h2>Money and the refund</h2>
        <p>
          {`Their trap collection was listed at $17. ${BUNDLE_NAME} is ${formatUSD(BUNDLE_PRICE)} for every MidiRoad kit. A single kit here is ${formatUSD(LOWEST_KIT_PRICE)} to ${formatUSD(HIGHEST_KIT_PRICE)}. Their 60-day email refund is longer than our 30 days. If the return window is the deciding fact, theirs is the more generous one on the pages we checked.`}
        </p>
        <h2>License, in one paragraph</h2>
        <p>
          {`Both pages say royalty-free for music you release, including commercial use. Unison's FAQ names beats you sell and Spotify, YouTube and iTunes. MidiRoad names your songs and beats, and then says you can't resell the raw files. This isn't legal advice. The license in the download is the one that counts.`}
        </p>
        <p>
          Chords are not in either drum product. Unison&apos;s chord pack is a separate folder of fixed
          progressions. The <Link href="/chord-maker">chord maker</Link> writes one progression at a time.
        </p>
      </div>
      <ChooseColumns themLabel="the Unison folder" them={competitor.decideThem} us={competitor.decideUs} />
      <div className={prose}>
        <h2>Shop the smaller catalog on purpose</h2>
      </div>
      <KitPicks ids={["essentials", "decoy", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
      </div>
    </>
  );
}

function SpliceCompare({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <Table competitor={competitor} caption="Feature comparison of MidiRoad and Splice Sounds" />
      <div className={prose}>
        <h2>A worked price, without pretending we know your credit spend</h2>
        <p>
          {`Sounds was $12.99 a month on the plans page we checked. A MidiRoad kit is ${formatUSD(LOWEST_KIT_PRICE)} to ${formatUSD(HIGHEST_KIT_PRICE)} once, and ${BUNDLE_NAME} is ${formatUSD(BUNDLE_PRICE)}. Splice MIDI is up to 3 credits a file, samples are 1, and we can't tell you how many credits a trap beat will cost because that depends on which packs you open. If the month is drums only, the kit is the smaller bill. If the month is drums plus loops plus presets, the subscription is the tool that was priced for that.`}
        </p>
        <h2>The preview is not the same promise</h2>
        <p>
          Both sites play audio before you download. Splice says the MIDI preview is an example of an
          instrument you might use, so the file will not sound like the website when it hits your sampler.
          MidiRoad&apos;s player is the pattern on our one-shots. Your drum kit will still change the tone.
          The rhythm is what you heard.
        </p>
        <h2>After the subscription ends</h2>
        <p>
          {`Downloaded Splice sounds stay licensed. Credits you didn't spend expire on the schedule in their plans FAQ, 28 days after the last bill, unless you come back or had the plan on hold. A kit has no bill after checkout. The limit on our side is the catalog: ${MIDI_PATTERN_COUNT} drum patterns, not a marketplace that adds packs every week.`}
        </p>
        <p>
          Their license FAQ also says many distributors still want third-party material disclosed, and that
          Splice can generate a certified license for a download. We don&apos;t offer that document. If your
          distributor asks for one, that&apos;s a real reason to keep the Splice file and use our drums only
          where a written royalty-free term is enough.
        </p>
      </div>
      <ChooseColumns themLabel="Splice" them={competitor.decideThem} us={competitor.decideUs} />
      <div className={prose}>
        <h2>A drum kit, if the credits were for drums</h2>
      </div>
      <KitPicks ids={["essentials", "decoy", "black-market"]} bundle />
      <div className={prose}>
        <EndLinks />
        <p>
          The optional way to buy one MidiRoad file at a time is <Link href="/pricing">pricing</Link>, not a
          Splice-style catalog.
        </p>
      </div>
    </>
  );
}

function CymaticsCompare({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <Table competitor={competitor} caption="Feature comparison of MidiRoad drum kits and Cymatics APEX MIDI" />
      <div className={prose}>
        <h2>Read the product name before the genre name</h2>
        <p>
          {`Both pages say trap and drill. Cymatics is describing melodies in those styles: chords and top lines, written to go over drums. MidiRoad is describing the drums. Putting the 2,600+ MIDI figure next to our ${MIDI_PATTERN_COUNT} patterns makes a leaderboard that isn't real. One number counts progressions. The other counts hat, snare, kick and 808 files.`}
        </p>
        <p>
          {`Genre collections on their overview were listed at $20. A MidiRoad kit is ${formatUSD(LOWEST_KIT_PRICE)} to ${formatUSD(HIGHEST_KIT_PRICE)}. You might buy one of each. Nothing on this page says you shouldn't. The mistake is buying APEX because a thumbnail called it a drum pack, then wondering where the hats are.`}
        </p>
        <h2>License wording differs on purpose</h2>
        <p>
          {`Cymatics' APEX page says the melodies can go in your own sample packs, beat sales, placements and sync. MidiRoad's drums can go in your songs and beats, not back out into a pack of raw files. If you're compiling a sample pack, their sentence is the one to verify with their terms. If you're finishing a song, either license is aimed at you. Not legal advice.`}
        </p>
        <h2>What you can audition</h2>
        <p>
          APEX plays named melody demos on the sales page and lists the key. We play every drum pattern on
          its own page. Neither player is the other&apos;s content. Use theirs to judge a progression and ours
          to judge a groove.
        </p>
      </div>
      <ChooseColumns themLabel="Cymatics" them={competitor.decideThem} us={competitor.decideUs} />
      <div className={prose}>
        <h2>Drum kits for the rhythms APEX doesn&apos;t include</h2>
      </div>
      <KitPicks ids={["decoy", "essentials", "odyssey", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
      </div>
    </>
  );
}

function GhosthackCompare({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <Table competitor={competitor} caption="Feature comparison of MidiRoad and Ghosthack Trap Drums" />
      <div className={prose}>
        <h2>Open the zip in your head before you compare the price</h2>
        <p>
          {`€37 including VAT, on the page we loaded, buys 40 trap kits of audio from 120 to 160 BPM, hundreds of stems and one-shots, and 215 MIDI files that match that audio. ${formatUSD(BUNDLE_PRICE)} here buys ${MIDI_PATTERN_COUNT} MIDI patterns and 77 one-shots, and no loop library. The cheaper product is smaller. That's the comparison. It isn't a discount on the same box.`}
        </p>
        <p>
          Their MIDI is valuable because it is tied to those kits: change a snare, keep the pattern they
          wrote against it. Our MIDI is valuable because it isn&apos;t tied to a loop. You drop a hat file on
          any hat sample. If you don&apos;t like their drum tone, you paid for audio you won&apos;t use.
        </p>
        <h2>Demos versus a pattern page</h2>
        <p>
          Ghosthack plays kit demos on the product page, which is the right way to sell loops. We play each
          MIDI part on its own, which is the right way to sell patterns. Listen to theirs if you are buying
          the sound. Listen to ours if you are buying the grid.
        </p>
        <h2>Drill is not in Trap Drums</h2>
        <p>
          {`The pack is trap and hip-hop. For drill they sell UK Drill Essentials: a sample pack with 20 MIDI files and five construction kits at 140 to 160 BPM, shown on sale when we checked. Decoy Protocol is 18 MIDI patterns from 130 to 170 BPM, previewed one by one. Different contents, similar honesty problem if a title says drill and you needed the other half.`}
        </p>
      </div>
      <ChooseColumns themLabel="Ghosthack" them={competitor.decideThem} us={competitor.decideUs} />
      <div className={prose}>
        <h2>The MIDI side, priced as MIDI</h2>
      </div>
      <KitPicks ids={["essentials", "decoy", "black-market", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
      </div>
    </>
  );
}

function ToontrackCompare({ competitor }: { competitor: Competitor }) {
  const decoy = kitById("decoy");
  const decoyStats = decoy ? kitStats(decoy) : undefined;
  return (
    <>
      <Table competitor={competitor} caption="Feature comparison of MidiRoad and Toontrack Hip-Hop Grooves MIDI" />
      <div className={prose}>
        <h2>Tempo, feel, and the instrument in front of the MIDI</h2>
        <p>
          {`Hip-Hop Grooves runs from 73 to 125 BPM and was played by a session drummer. ${decoyStats ? `Decoy Protocol, our drill kit, runs from ${decoyStats.minBpm} to ${decoyStats.maxBpm} BPM and is programmed.` : ""} Trap on their page is one style in a hip-hop survey. Trap on ours is hat patterns, snares and 808 lines written for that grid. A live kit groove at 90 BPM will not become a sliding 808 roll because both products contain the word trap.`}
        </p>
        <p>
          {`Their $29 pack has no sounds in it. Playback is meant to be EZdrummer or Superior Drummer, sold separately. The FAQ says you can extract .mid files if you don't own the installer. ${BUNDLE_NAME} is ${formatUSD(BUNDLE_PRICE)} and includes 77 one-shots so a pattern isn't silent, and the files are already .mid.`}
        </p>
        <h2>The license we are not going to invent</h2>
        <p>
          {`Nothing on the Hip-Hop Grooves page we read says "royalty-free." Other companies on this site do say it, in different words. Toontrack may allow commercial release and simply explain it somewhere else. Until you read that page, don't treat the pack like a sample-library license. MidiRoad's terms are on the royalty-free guide: your releases, not the raw files.`}
        </p>
        <h2>Boom bap is their lane</h2>
        <p>
          We don&apos;t have a boom bap, G-funk or new jack kit. If that&apos;s the record, stop here and buy
          the Toontrack pack, assuming you have the drum software it was played for. The list below is for
          programmed trap and drill only.
        </p>
      </div>
      <ChooseColumns themLabel="Toontrack" them={competitor.decideThem} us={competitor.decideUs} />
      <KitPicks ids={["essentials", "decoy", "psycho", "focus"]} bundle />
      <div className={prose}>
        <EndLinks />
      </div>
    </>
  );
}
