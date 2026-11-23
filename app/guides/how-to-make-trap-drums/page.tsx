import Link from "next/link";
import { GuideArticle } from "@/components/GuideArticle";
import { PatternLink } from "@/components/PatternLink";
import { guideMetadata } from "@/lib/guides";

const SLUG = "how-to-make-trap-drums";

export const metadata = guideMetadata(SLUG);

export default function Page() {
  return (
    <GuideArticle slug={SLUG}>
      <p>
        Trap drums are built from a short list of parts, each with a clear job: a slow, heavy snare, a kick that
        bounces around it, fast hi-hats that carry the energy, and an 808 that is both the bass and the low end
        of the kick. Get those four right and the beat works. This guide goes through them in the order most
        producers program them.
      </p>

      <h2>1. Pick the tempo: 130–160 BPM in half time</h2>
      <p>
        Most trap is programmed between <strong>130 and 160 BPM</strong>, with 140 a common default. The trick
        is that the drums are written in half time: the snare lands once per bar instead of twice, so a 140 BPM
        beat feels like 70. That&apos;s why trap can feel slow and heavy while the hi-hats race along.
      </p>
      <ul>
        <li>
          <strong>130–145 BPM:</strong> the classic range. Room for hat rolls without sounding frantic.
        </li>
        <li>
          <strong>145–160 BPM:</strong> faster, more aggressive, common in dark trap and rage-style beats.
        </li>
        <li>
          <strong>Below 130:</strong> often melodic trap, where the drums sit back behind a vocal.
        </li>
      </ul>
      <p>
        Some producers set the project to 70–80 BPM and program the hats in 1/32s instead. The result sounds the
        same; it&apos;s just a different grid. You can{" "}
        <Link href="/midi/bpm">browse MidiRoad patterns by tempo</Link> to hear the difference.
      </p>

      <h2>2. Place the snare (or clap)</h2>
      <p>
        In half time, the snare goes on <strong>beat 3 of every bar</strong>. Count &ldquo;1, 2, 3, 4&rdquo; and
        it hits on the 3. Everything else is arranged around this one hit, so put it in first.
      </p>
      <ul>
        <li>Layer a clap on the same hit for width, or use a clap alone.</li>
        <li>
          Add the odd ghost snare, a quiet hit one 1/16 before the main snare or at the end of a bar, to lead
          into the next phrase.
        </li>
        <li>Keep it on the grid. A late snare in trap sounds like a mistake, not a feel.</li>
      </ul>
      <p>
        Hear it in context with an{" "}
        <PatternLink path="/midi/trap/offbeat-snare-trap-93-bpm">offbeat trap snare pattern</PatternLink>, which
        adds extra hits around the backbeat.
      </p>

      <h2>3. Program the kick</h2>
      <p>
        The kick starts on beat 1 and then dodges around the snare. Common spots are the &ldquo;and&rdquo; of 2,
        just after beat 3, and a pickup near the end of the bar. Avoid stacking a kick directly on the snare;
        the two fight for the same moment.
      </p>
      <p>
        In a lot of trap the kick is short and clicky, because the 808 underneath it supplies the weight. Write a
        kick pattern with space in it: two to four hits per bar is plenty. See a{" "}
        <PatternLink path="/midi/trap/downbeat-kick-trap-133-bpm">downbeat trap kick</PatternLink> or a{" "}
        <PatternLink path="/midi/street-trap/syncopated-kick-street-trap-110-bpm">syncopated street trap kick</PatternLink>{" "}
        for two different approaches.
      </p>

      <h2>4. Write the hi-hats, then the rolls</h2>
      <p>
        Hi-hats are where trap gets its identity. Start simple and add detail:
      </p>
      <ol>
        <li>
          <strong>Base rhythm.</strong> Fill the bar with straight 1/8 or 1/16 hats. This is your foundation.
        </li>
        <li>
          <strong>Rolls.</strong> Replace a few of those hits with fast bursts: two or four 1/32 notes, or a run
          of 1/64s for a buzz. Put them where they lead somewhere: just before the snare, at the end of a bar,
          or at the end of every fourth bar.
        </li>
        <li>
          <strong>Triplets.</strong> Switch a beat or two to 1/16 or 1/8 triplets. Three hits in the space of
          two give the groove a rolling, off-kilter feel. Drill leans on triplets heavily.
        </li>
        <li>
          <strong>Gaps.</strong> Take hats out. A half-bar of silence before the hook makes the hook hit
          harder.
        </li>
        <li>
          <strong>Velocity.</strong> Ramp the velocity across each roll (quiet to loud into the snare works
          well), and lower the off-beats slightly so the main beats stay clear.
        </li>
        <li>
          <strong>Pitch.</strong> For a signature trap move, pitch the notes inside a roll up or down a few
          semitones so it sweeps.
        </li>
      </ol>
      <p>
        Add an <strong>open hat</strong> on a few off-beats for air, and choke it with the closed hat so it
        doesn&apos;t ring over everything. Compare a{" "}
        <PatternLink path="/midi/street-trap/rolling-hi-hat-street-trap-110-bpm">rolling street trap hat</PatternLink>{" "}
        with a{" "}
        <PatternLink path="/midi/dark-trap/rolling-hi-hat-dark-trap-130-bpm">rolling dark trap hat</PatternLink>{" "}
        to hear how much the roll placement changes the feel.
      </p>

      <h2>5. Place the 808</h2>
      <p>
        The 808 is a long, tuned bass drum. In trap it does two jobs: it&apos;s the bassline, and it&apos;s the
        body of the kick. That makes placement simple to start with:
      </p>
      <ul>
        <li>
          <strong>Start the 808 on the kick.</strong> Put an 808 note on every kick, or on most of them. They
          hit together and sound like one big drum.
        </li>
        <li>
          <strong>Follow the song&apos;s key.</strong> The 808 notes should come from the key of the melody.
          The root note on beat 1 is a safe default; move to other chord tones as the progression changes.
        </li>
        <li>
          <strong>Mind the length.</strong> Long 808s fill the space between kicks; short ones leave room for a
          bouncier groove. Cut each note before the next one starts, or set your sampler to mono so they
          can&apos;t overlap.
        </li>
        <li>
          <strong>Slides.</strong> Overlap two notes with glide on and the 808 bends from one pitch to the next.
          Use it at the end of a phrase rather than everywhere.
        </li>
        <li>
          <strong>Kick vs. 808.</strong> If they clash, either drop the kick where the 808 already hits or
          sidechain the 808 to the kick so the kick&apos;s click comes through.
        </li>
      </ul>
      <p>
        Listen to a{" "}
        <PatternLink path="/midi/trap/sliding-808-trap-110-bpm">sliding 808 trap line</PatternLink> and a{" "}
        <PatternLink path="/midi/drill/sustained-808-drill-130-bpm">sustained drill 808</PatternLink>, or the
        whole <Link href="/midi/808-bass">808 bass collection</Link>.
      </p>

      <h2>6. Arrange and vary</h2>
      <p>
        A four-bar loop gets old quickly. Change something every four or eight bars: switch the hat pattern
        for the hook, drop the 808 for a bar before the chorus, mute everything but the hats for an intro,
        add a crash or reversed cymbal into the drop. Small edits keep a listener paying attention.
      </p>

      <h2>Trap styles at a glance</h2>
      <ul>
        <li>
          <Link href="/midi/trap">Trap</Link>: the core style, bouncing kicks, rolling hats, heavy 808s.
        </li>
        <li>
          <Link href="/midi/street-trap">Street trap</Link>: harder, punchier kicks and gritty hats.
        </li>
        <li>
          <Link href="/midi/melodic-trap">Melodic trap</Link>: lighter drums that leave room for vocals and
          gliding 808s.
        </li>
        <li>
          <Link href="/midi/dark-trap">Dark trap</Link>: faster, eerier, more aggressive patterns.
        </li>
        <li>
          <Link href="/midi/drill">Drill</Link>: skippy, triplet-heavy hats and sliding 808s, close to 140 BPM.
        </li>
      </ul>

      <h2>Skip the blank page</h2>
      <p>
        The <Link href="/beat-maker">free trap beat maker</Link> generates hats, snare, kick and 808 in one
        click. Change the tempo and key, mute parts, then export the MIDI to your DAW and edit it with the
        steps above. For the DAW side, see the{" "}
        <Link href="/guides/how-to-use-midi-drums-in-fl-studio">FL Studio</Link> and{" "}
        <Link href="/guides/how-to-use-midi-drums-in-ableton">Ableton</Link> guides.
      </p>
    </GuideArticle>
  );
}
