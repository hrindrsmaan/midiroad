import Link from "next/link";
import { GuideArticle } from "@/components/GuideArticle";
import { PatternLink } from "@/components/PatternLink";
import { guideMetadata } from "@/lib/guides";

const SLUG = "what-are-midi-drum-patterns";

export const metadata = guideMetadata(SLUG);

export default function Page() {
  return (
    <GuideArticle slug={SLUG}>
      <p>
        A <strong>MIDI drum pattern</strong> is a short file of drum notes: which drum plays, exactly when it
        plays, and how hard it&apos;s hit. It has no sound of its own. You drop it into your DAW, point it at a
        drum kit or sampler, and the kit plays the rhythm. Producers use them to start a beat fast, to learn how
        a style is programmed, or to borrow a hi-hat or 808 groove they can then rewrite.
      </p>

      <h2>What&apos;s inside a MIDI file</h2>
      <p>
        MIDI (Musical Instrument Digital Interface) stores instructions, not audio. For drums, each note in a
        .mid file carries a few pieces of information:
      </p>
      <ul>
        <li>
          <strong>Pitch</strong>: the key the note is on. In a drum kit that picks the sound (kick, snare, hat).
          On an 808 or other pitched sample it sets the note you hear.
        </li>
        <li>
          <strong>Start time</strong>: where the hit lands, measured in beats rather than seconds, so it follows
          your project tempo.
        </li>
        <li>
          <strong>Length</strong>: how long the note is held. It barely matters for a one-shot hat, but it
          decides how long an 808 rings.
        </li>
        <li>
          <strong>Velocity</strong>: how hard the note is hit, from 1 to 127. Most samplers turn this into
          volume, and some also change the tone.
        </li>
      </ul>
      <p>
        A pattern is usually one to eight bars long and loops cleanly. Many packs, MidiRoad&apos;s included,
        split a groove into separate files per part (hi-hats, snares, kicks, open hats and 808s) so you can mix
        and match them or replace just one layer of your beat.
      </p>

      <h2>MIDI patterns vs. drum loops vs. one-shots</h2>
      <p>The three get mixed up, but they do different jobs:</p>
      <ul>
        <li>
          <strong>One-shots</strong> are single audio hits: one kick, one snare, one 808. They are the sounds.
        </li>
        <li>
          <strong>Drum loops</strong> are recorded audio of a whole groove. The rhythm and the sounds are baked
          together, and changing the tempo means time-stretching.
        </li>
        <li>
          <strong>MIDI patterns</strong> are the rhythm on its own. They need sounds to play, but every hit stays
          editable.
        </li>
      </ul>
      <p>
        That last point is the reason producers reach for MIDI. With a loop you get what was recorded. With a
        MIDI pattern you can move a single snare, delete half the hats, turn a 1/16 run into a 1/32 roll, swap
        the kick sample, or transpose an 808 line into your song&apos;s key in a couple of clicks. Tempo changes
        are free, because the notes sit on the beat grid and simply play faster or slower.
      </p>

      <h2>Why producers use MIDI drum patterns</h2>
      <h3>Speed</h3>
      <p>
        Programming convincing trap hats from scratch takes time: the rolls, the triplets, the velocity ramps.
        Starting from a pattern gets a working groove under a melody in seconds, so you spend your time on the
        parts that make the beat yours.
      </p>
      <h3>Learning</h3>
      <p>
        Open a pattern in the piano roll and you can see how it&apos;s built: where the rolls fall, how often
        the hats change rhythm, how the 808 lines up with the kick. Copying a structure a few times is one of the
        quickest ways to learn a genre. Compare a{" "}
        <PatternLink path="/midi/trap/bodiene-hi-hat-trap-89-bpm">trap hi-hat pattern</PatternLink> with a{" "}
        <PatternLink path="/midi/drill/rolling-hi-hat-drill-132-bpm">drill hi-hat pattern</PatternLink> and the
        difference in feel is obvious on screen before you even press play.
      </p>
      <h3>Your sound, not someone else&apos;s</h3>
      <p>
        Because the file has no audio, the beat sounds like your drum kit. Two producers can use the same MIDI
        pattern and end up with tracks that sound nothing alike. That isn&apos;t true of a shared drum loop.
      </p>

      <h2>How to use one in your DAW</h2>
      <p>The basic workflow is the same everywhere:</p>
      <ol>
        <li>Set your project tempo. The pattern page lists the BPM it was written for, which is a good start.</li>
        <li>Create an instrument track and load a drum sampler, or a single sample for one part.</li>
        <li>Drag the .mid file onto the track. It becomes a clip or pattern you can loop.</li>
        <li>
          Check that the notes trigger the right sounds. If a hat pattern plays the kick, the notes are on a
          different key from your hat pad: move them, or move the sample.
        </li>
        <li>Edit: change velocities, add swing, cut or add hits, and arrange it across your song.</li>
      </ol>
      <p>
        There are step-by-step walkthroughs for{" "}
        <Link href="/guides/how-to-use-midi-drums-in-fl-studio">FL Studio</Link> and{" "}
        <Link href="/guides/how-to-use-midi-drums-in-ableton">Ableton Live</Link>. Logic Pro, Studio One,
        Reason, Cubase and Pro Tools all accept the same .mid files, and the steps are close to identical.
      </p>

      <h2>What makes a good drum pattern</h2>
      <ul>
        <li>
          <strong>Velocity variation.</strong> Every hit at 127 sounds robotic. Good hats rise and fall in
          volume, especially through a roll.
        </li>
        <li>
          <strong>Variation across bars.</strong> A one-bar loop gets stale. Better patterns change something at
          the end of every second or fourth bar, a roll, a gap or an extra kick, to lead into the next phrase.
        </li>
        <li>
          <strong>Space.</strong> Drums have to leave room for the vocal and the melody. Busy isn&apos;t the
          same as good.
        </li>
        <li>
          <strong>A clear tempo and style.</strong> A pattern written for 140 BPM trap won&apos;t feel right at
          95 BPM, even though MIDI will play it there.
        </li>
      </ul>

      <h2>Where to find MIDI drum patterns</h2>
      <p>
        MidiRoad has a public page for every pattern, with an in-browser preview, grouped by style:{" "}
        <Link href="/midi/trap">trap</Link>, <Link href="/midi/street-trap">street trap</Link>,{" "}
        <Link href="/midi/melodic-trap">melodic trap</Link>, <Link href="/midi/dark-trap">dark trap</Link>,{" "}
        <Link href="/midi/drill">drill</Link> and <Link href="/midi/808-bass">808 bass</Link>. You can also{" "}
        <Link href="/midi/bpm">browse by tempo</Link>. Each kit is a paid download, or you can unlock a single
        file with a credit. All of it is royalty-free for your releases; the{" "}
        <Link href="/guides/royalty-free-midi-explained">royalty-free guide</Link> explains what that covers.
      </p>
      <p>
        If you just want to hear how a trap beat fits together, the{" "}
        <Link href="/beat-maker">free trap beat maker</Link> builds hats, snare, kick and 808 in one click and
        lets you export the result as MIDI.
      </p>
    </GuideArticle>
  );
}
