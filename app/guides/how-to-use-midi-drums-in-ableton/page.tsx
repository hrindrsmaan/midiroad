import Link from "next/link";
import { GuideArticle } from "@/components/GuideArticle";
import { PatternLink } from "@/components/PatternLink";
import { guideMetadata } from "@/lib/guides";

const SLUG = "how-to-use-midi-drums-in-ableton";

export const metadata = guideMetadata(SLUG);

export default function Page() {
  return (
    <GuideArticle slug={SLUG}>
      <p>
        Ableton Live turns any .mid file into a MIDI clip you can loop, edit and warp with a groove. For drums,
        everything goes through the <strong>Drum Rack</strong>, so most of the work is making sure the
        pattern&apos;s notes land on the pads that hold your sounds. This guide covers setting up a Drum Rack,
        bringing a MIDI drum clip in, fixing the mapping, and using the Groove Pool to add swing. It applies to
        Live 11 and 12, Standard and Suite.
      </p>

      <h2>Step 1: Set the tempo</h2>
      <p>
        Double-click the tempo field at the top left and type the BPM from the pattern page. MIDI clips always
        follow the Live set&apos;s tempo, so the pattern feels as written only if the set matches. Trap patterns
        are usually 130–160 BPM, drill around 140.
      </p>

      <h2>Step 2: Build a Drum Rack</h2>
      <ol>
        <li>Create a MIDI track (Cmd/Ctrl+Shift+T).</li>
        <li>
          In the Browser, open Drums and drag a Drum Rack preset onto the track, or open Instruments and drag
          an empty Drum Rack.
        </li>
        <li>
          Drop your own samples onto the pads: kick, snare or clap, closed hat, open hat. Each pad becomes a
          Simpler playing that sample.
        </li>
      </ol>
      <p>
        By default the bottom-left pad is C1 (the kick in most kits), with the next pads running up from there.
        Hover over a pad to see its note name. You&apos;ll need it in step 4.
      </p>
      <p>
        <strong>808s are better on their own track.</strong> Drag an 808 one-shot onto a new MIDI track to
        create a Simpler. In Simpler, set Voices to 1 so notes don&apos;t stack, and turn on Glide if you want
        overlapping notes to slide in pitch. Simpler plays the sample at its recorded pitch on C3, so if your
        808 isn&apos;t tuned to C, use the Transpose control to bring it in tune.
      </p>

      <h2>Step 3: Drag the MIDI clip in</h2>
      <p>You can bring a .mid file in from two places:</p>
      <ul>
        <li>
          <strong>From Finder or Explorer:</strong> drag the file onto an empty clip slot in Session View or onto
          the track in Arrangement View.
        </li>
        <li>
          <strong>From Live&apos;s Browser:</strong> add the folder with your MIDI kits under Places (click Add
          Folder), then drag files straight from the Browser. You can preview MIDI files there with the
          track&apos;s instrument by turning on preview.
        </li>
      </ul>
      <p>
        Live creates a MIDI clip with the pattern&apos;s notes. Double-click it to open the clip in the editor at
        the bottom. Turn on Loop in the clip settings if it isn&apos;t already, and set the loop length to the
        pattern&apos;s bar count.
      </p>

      <h2>Step 4: Match the notes to your pads</h2>
      <p>
        If the clip plays the wrong drum, or nothing at all, its notes are on keys that don&apos;t match your
        pads. Two ways to fix it:
      </p>
      <ol>
        <li>
          <strong>Move the notes.</strong> In the MIDI editor, click Fold (or press F) so only rows with notes
          show. Select all the notes on one row and drag them up or down to the row of the pad you want. With a
          Drum Rack, the editor rows are labelled with the pad names, which makes this easy.
        </li>
        <li>
          <strong>Move the sound.</strong> Scroll the Drum Rack&apos;s pad overview to the note the clip uses and
          drop your sample on that pad instead.
        </li>
      </ol>
      <p>
        Because MidiRoad patterns come as one part per file, you can keep things simple: put each part on its
        own track with a single Simpler, and every note plays the right sound. Use a Drum Rack when you want
        all the parts in one clip.
      </p>
      <p>
        <strong>Choke the open hat.</strong> In the Drum Rack, show the chain list and set the closed hat and
        open hat to the same Choke group. A closed hat then cuts off a ringing open hat, as it would on a real
        kit.
      </p>

      <h2>Step 5: Add swing with the Groove Pool</h2>
      <p>
        Grooves shift timing and velocity toward a template without you editing every note. They&apos;re the
        fastest way to add bounce to hi-hats.
      </p>
      <ol>
        <li>
          In the Browser, open Grooves (in Live 12, look under Grooves in the Browser&apos;s sidebar, or search
          for &ldquo;swing&rdquo;).
        </li>
        <li>Drag a groove such as Swing 16-55 onto the hi-hat clip. It appears in the Groove Pool.</li>
        <li>
          Open the Groove Pool (the wavy-line button at the bottom of the Browser) and adjust Timing, Random and
          Velocity. The global Amount slider scales every groove at once.
        </li>
        <li>
          When you&apos;re happy, click Commit in the clip&apos;s Groove settings to write the new timing into
          the notes, so you can edit them further.
        </li>
      </ol>
      <p>
        Keep the kick, snare and 808 straight so the low end stays tight, and put the groove on hats only. A
        Random value of a few percent humanizes the timing without sounding sloppy.
      </p>

      <h2>Step 6: Shape velocity</h2>
      <ul>
        <li>
          Open the velocity lane under the MIDI editor and drag notes up or down. Lower the off-beat hats a
          little and ramp velocity up through rolls into the snare.
        </li>
        <li>
          Select notes and use the velocity range or randomize controls in the clip&apos;s note settings to add
          small variations.
        </li>
        <li>
          Set Chance on a few hats below 100% so they don&apos;t always play. It adds variation across repeats
          without making the clip longer.
        </li>
      </ul>

      <h2>Step 7: Arrange and vary</h2>
      <p>
        Duplicate the clip (Cmd/Ctrl+D) to make variations: strip the hats back for the intro, add a 1/32 roll
        before the hook, or drop the kick for a bar before the chorus. Record clips into Arrangement View, or
        drag them there directly, once the structure is set.
      </p>

      <h2>Patterns to try</h2>
      <p>
        Practise the Drum Rack mapping with a{" "}
        <PatternLink path="/midi/dark-trap/downbeat-kick-dark-trap-133-bpm">dark trap kick</PatternLink> and{" "}
        <PatternLink path="/midi/dark-trap/offbeat-snare-dark-trap-133-bpm">snare</PatternLink> at the same
        tempo, test grooves on a{" "}
        <PatternLink path="/midi/melodic-trap/rolling-hi-hat-melodic-trap-89-bpm">melodic trap hi-hat</PatternLink>,
        and set up Simpler&apos;s glide with a{" "}
        <PatternLink path="/midi/808-bass/sliding-808-bass-110-bpm">sliding 808 bass</PatternLink>. There are
        more on the <Link href="/midi/dark-trap">dark trap</Link>,{" "}
        <Link href="/midi/melodic-trap">melodic trap</Link> and <Link href="/midi/808-bass">808 bass</Link>{" "}
        pages, or <Link href="/midi/bpm">browse by tempo</Link>. The{" "}
        <Link href="/beat-maker">free beat maker</Link> exports a whole trap beat, or one track at a time, as
        MIDI you can drag into Live.
      </p>
      <p>
        Using FL Studio as well? See{" "}
        <Link href="/guides/how-to-use-midi-drums-in-fl-studio">how to use MIDI drums in FL Studio</Link>. The
        buying page, separate from these steps, is{" "}
        <Link href="/midi-drums-for/ableton">MIDI drum kits for Ableton Live</Link>.
      </p>
    </GuideArticle>
  );
}
