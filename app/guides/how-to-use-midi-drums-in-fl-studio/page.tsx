import Link from "next/link";
import { GuideArticle } from "@/components/GuideArticle";
import { PatternLink } from "@/components/PatternLink";
import { guideMetadata } from "@/lib/guides";

const SLUG = "how-to-use-midi-drums-in-fl-studio";

export const metadata = guideMetadata(SLUG);

export default function Page() {
  return (
    <GuideArticle slug={SLUG}>
      <p>
        FL Studio opens standard .mid files, so any MIDI drum pattern can go straight into a beat. The only
        part that trips people up is mapping: making sure each note triggers the drum you expect. This guide
        walks through importing a pattern, mapping it to your kit, and then adding swing and velocity so it
        grooves. The steps are written for FL Studio 20 and 21 and work the same in FL Studio 2024 and later.
      </p>

      <h2>Before you start</h2>
      <ul>
        <li>
          <strong>Set the tempo first.</strong> Each MidiRoad pattern page lists the BPM it was written for.
          Type that into the tempo display at the top of FL Studio. Trap patterns usually sit between 130 and
          160 BPM.
        </li>
        <li>
          <strong>Work one part per channel.</strong> MidiRoad patterns come as separate files for hi-hats,
          snares, kicks, open hats and 808s. Giving each part its own Sampler channel is the simplest way to get
          the right sound on every note.
        </li>
        <li>
          <strong>Have your sounds ready.</strong> Load the one-shots you want (a hat, a snare, a kick, an 808)
          into the Channel Rack first, or use the WAVs that come with The Complete Vault bundle.
        </li>
      </ul>

      <h2>Step 1: Load a sound into the Channel Rack</h2>
      <ol>
        <li>Open the Channel Rack (F6).</li>
        <li>
          Drag a hi-hat sample from the Browser or Finder/Explorer into the Channel Rack. FL creates a Sampler
          channel for it.
        </li>
        <li>Repeat for the snare, kick and 808, so each part has its own channel.</li>
      </ol>

      <h2>Step 2: Import the MIDI pattern</h2>
      <p>There are two ways to bring a pattern in. Both end up as notes in that channel&apos;s Piano Roll.</p>
      <h3>Option A: drag onto the channel</h3>
      <p>
        Drag the .mid file from the Browser or your file manager and drop it on the channel&apos;s name in the
        Channel Rack. FL Studio writes the notes into the current pattern for that channel. This is the quickest
        method and works well when each file holds one part.
      </p>
      <h3>Option B: import inside the Piano Roll</h3>
      <ol>
        <li>Right-click the channel and choose Piano roll (or select it and press F7).</li>
        <li>Open the Piano Roll menu (the arrow at the top left) and choose File, then Import MIDI file.</li>
        <li>Pick the .mid file. If an import dialog appears, leave tempo changes unticked to keep your project tempo.</li>
      </ol>
      <p>
        Use the Piano Roll for hi-hat rolls and 808s. The Channel Rack&apos;s step sequencer only shows a 1/16
        grid, so it can&apos;t display 1/32 rolls, triplets or long 808 notes. FL switches the channel to Piano
        Roll view automatically once a pattern has notes the steps can&apos;t show.
      </p>

      <h2>Step 3: Map the notes to your kit</h2>
      <p>
        A Sampler channel plays its sample at the original pitch on its root note, C5 by default. Notes on other
        keys play the sample higher or lower. That&apos;s exactly what you want for an 808, and exactly what you
        don&apos;t want for a hi-hat.
      </p>
      <ul>
        <li>
          <strong>Hats, snares, kicks:</strong> if the pattern sounds pitched up or down, open the Piano Roll,
          press Ctrl+A to select every note, and drag them (or use Ctrl+Up/Down to move by octaves) so they sit
          on C5. Every hit now plays the sample as recorded.
        </li>
        <li>
          <strong>808s:</strong> keep the notes where they are. The pitches are the bassline. Instead, make sure
          the Sampler knows the 808&apos;s real pitch: if your 808 sample is tuned to, say, A, right-click the
          A key on the channel&apos;s keyboard and set it as the root note. The pattern then plays in tune.
        </li>
        <li>
          <strong>FPC or a drum plugin with pads:</strong> each pad listens on a fixed key. Open the plugin to
          see which key the hat pad uses, then move the pattern&apos;s notes to that key.
        </li>
      </ul>
      <p>
        For 808s, open the channel settings and turn on Cut itself in the Miscellaneous functions tab so each
        new note stops the previous one. Without it, long 808 notes overlap and the low end turns to mud. If the
        pattern uses slides, they show as slide notes in the Piano Roll and glide into the next pitch.
      </p>

      <h2>Step 4: Add swing</h2>
      <p>
        Straight 1/16 hats can feel stiff. Swing pushes every second 1/16 slightly late, which gives the groove
        bounce.
      </p>
      <ul>
        <li>
          <strong>Step sequencer patterns:</strong> turn up the Swing knob at the top of the Channel Rack. Start
          around 15–30% and listen. It only affects notes entered in the step sequencer.
        </li>
        <li>
          <strong>Piano Roll patterns:</strong> the Swing knob doesn&apos;t move Piano Roll notes. Select the off-beat
          1/16 hats and nudge them right with snap set to (none) or a fine grid, or use Tools, then Quantize
          (Alt+Q), which can apply a groove template at a partial strength.
        </li>
      </ul>
      <p>
        Trap usually wants a little swing on the hats and none on the kick, snare and 808, so the low end stays
        locked to the grid. Drill hats often have more swing, which is part of their skippy feel.
      </p>

      <h2>Step 5: Shape velocity</h2>
      <p>
        Velocity is what makes a hat pattern sound played rather than pasted. In the Piano Roll, the bottom
        panel (the event editor) shows each note&apos;s velocity as a bar.
      </p>
      <ul>
        <li>Draw velocity by hand: lower the off-beats a little so the downbeats stand out.</li>
        <li>For rolls, draw a ramp, quiet to loud into the snare, or loud to quiet out of it.</li>
        <li>
          For subtle variation, select the hats and use Tools, then Randomize (Alt+R), with only velocity
          enabled and a small range.
        </li>
        <li>
          Check that the Sampler responds: in channel settings, velocity should be mapped to volume, which is
          the default.
        </li>
      </ul>

      <h2>Step 6: Arrange it in the Playlist</h2>
      <p>
        Once the pattern sounds right, place it in the Playlist and build your song around it. Make variations
        by cloning the pattern (right-click, Make unique), then removing hats in the intro, adding a roll before
        the hook, or muting the 808 for a drop. Small changes every four or eight bars keep the beat moving.
      </p>

      <h2>Try it with a pattern</h2>
      <p>
        Good starting points: a{" "}
        <PatternLink path="/midi/trap/bodiene-hi-hat-trap-89-bpm">trap hi-hat pattern</PatternLink>, a{" "}
        <PatternLink path="/midi/trap/sliding-808-trap-110-bpm">sliding 808 line</PatternLink> to practise root
        notes and Cut itself, and a{" "}
        <PatternLink path="/midi/drill/rolling-hi-hat-drill-132-bpm">rolling drill hat</PatternLink> to hear
        what swing does. Browse more by style on the <Link href="/midi/trap">trap</Link>,{" "}
        <Link href="/midi/drill">drill</Link> and <Link href="/midi/808-bass">808 bass</Link> pages. To build
        a full trap beat in the browser and export it as MIDI for FL Studio, use the{" "}
        <Link href="/beat-maker">free beat maker</Link>.
      </p>
      <p>
        New to programming trap? Read <Link href="/guides/how-to-make-trap-drums">how to make trap drums</Link>{" "}
        next.
      </p>
    </GuideArticle>
  );
}
