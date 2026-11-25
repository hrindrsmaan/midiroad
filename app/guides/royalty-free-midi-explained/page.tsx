import Link from "next/link";
import { GuideArticle } from "@/components/GuideArticle";
import { guideMetadata } from "@/lib/guides";

const SLUG = "royalty-free-midi-explained";

export const metadata = guideMetadata(SLUG);

export default function Page() {
  return (
    <GuideArticle slug={SLUG}>
      <p>
        &ldquo;Royalty-free&rdquo; is on almost every sample pack and MIDI kit, and it&apos;s easy to read more
        or less into it than it says. This page explains what the term usually means, then spells out exactly
        what you can and can&apos;t do with MidiRoad&apos;s MIDI drum patterns and one-shots.
      </p>

      <h2>MidiRoad&apos;s terms in short</h2>
      <ul>
        <li>
          <strong>Use it in your music:</strong> everything is royalty-free for your own songs and beats.
        </li>
        <li>
          <strong>Release it commercially:</strong> that includes commercial releases on Spotify, Apple Music
          and YouTube.
        </li>
        <li>
          <strong>No credit needed:</strong> you don&apos;t have to name MidiRoad anywhere.
        </li>
        <li>
          <strong>No reselling or sharing the raw files:</strong> you can&apos;t resell or share the MIDI or WAV
          files themselves.
        </li>
        <li>
          <strong>Refunds:</strong> if a kit isn&apos;t for you, email support@inbox.midiroad.com within 30 days
          of purchase for a full refund.
        </li>
      </ul>

      <h2>What &ldquo;royalty-free&rdquo; means</h2>
      <p>
        A royalty is a fee paid every time something is used or earns money: per stream, per sale, per
        broadcast. Royalty-free means you pay once, when you buy the kit, and never again. No percentage of your
        streaming income, no per-copy fee, no reporting how many times your song was played.
      </p>
      <p>
        It does <em>not</em> mean the files are free of charge, and it doesn&apos;t mean they&apos;re in the
        public domain. It&apos;s a license: permission to use the material in a defined way. The interesting
        part of any royalty-free license is what that defined way covers.
      </p>

      <h3>Royalty-free vs. copyright-free</h3>
      <p>
        People often use the two interchangeably, but they&apos;re different. Copyright-free (or public domain)
        material has no owner, and anyone can do anything with it. Royalty-free material still has an owner who
        grants you specific rights. That&apos;s why a royalty-free kit can let you release songs made with it
        and still stop you from re-selling the kit.
      </p>

      <h2>What you can do</h2>
      <h3>Make and release music</h3>
      <p>
        Drag the patterns into your DAW, edit them as much or as little as you like, play them through any
        sounds, and release the result as your own song or beat. Commercial releases on Spotify, Apple Music and YouTube are covered
        explicitly, and royalty-free means no further payment to MidiRoad however well the track does.
      </p>
      <h3>Skip the credit</h3>
      <p>
        No credit is needed. You don&apos;t have to put &ldquo;drums from MidiRoad&rdquo; in a title, a
        description or your release metadata.
      </p>

      <h2>What you can&apos;t do</h2>
      <p>
        The one restriction: <strong>you can&apos;t resell or share the raw files</strong>. In practice that
        means:
      </p>
      <ul>
        <li>Don&apos;t upload the MIDI or WAV files for others to download, free or paid.</li>
        <li>Don&apos;t put them, renamed or not, into a sample pack, MIDI kit or drum kit of your own.</li>
        <li>Don&apos;t share your download link or the zip file with other producers.</li>
      </ul>
      <p>
        The line is between <strong>music made with the files</strong>, which is yours to release, and{" "}
        <strong>the files themselves</strong>, which stay with the person who bought them.
      </p>

      <h2>Why MIDI is easier to license than loops</h2>
      <p>
        A MIDI pattern contains no audio. When you play one through your own drum sounds, the recording that
        ends up in your song is yours. With a pre-recorded drum loop, everyone who buys the same pack has the
        same audio, which is how two unrelated songs end up with an identical drum break. With MIDI, the rhythm
        might be shared but the sound is your kit, mixed your way, and usually edited too.
      </p>
      <p>
        That&apos;s also why the license treats MIDI and one-shots the same way: they&apos;re building blocks
        for your track, not finished pieces of someone else&apos;s.
      </p>

      <h2>Things to check with any kit, not just ours</h2>
      <ul>
        <li>Does the license cover commercial releases, or only non-commercial use?</li>
        <li>Is credit required? Some &ldquo;free&rdquo; packs need it.</li>
        <li>Are there limits on streams, sales or sync placements (film, TV, ads)?</li>
        <li>Can you use the material in beats you sell or lease to artists?</li>
        <li>Where is the license written down? It should be on the product page or in the download.</li>
      </ul>
      <p>
        If a pack doesn&apos;t answer these clearly, ask the seller before you release anything made with it.
        For MidiRoad, the terms above and on the <Link href="/#faq">homepage FAQ</Link> are the full picture. If
        something isn&apos;t covered, email support@inbox.midiroad.com before you release.
      </p>

      <h2>Browse royalty-free MIDI drums</h2>
      <p>
        Every pattern has a free preview page. Start with <Link href="/midi/trap">trap</Link>,{" "}
        <Link href="/midi/drill">drill</Link>, <Link href="/midi/dark-trap">dark trap</Link>,{" "}
        <Link href="/midi/melodic-trap">melodic trap</Link>, <Link href="/midi/street-trap">street trap</Link>{" "}
        or <Link href="/midi/808-bass">808 bass</Link>,         or try the{" "}
        <Link href="/beat-maker">free trap beat maker</Link>. How a few other MIDI packs describe their own
        licenses is on the <Link href="/compare">comparison pages</Link>. New to MIDI? Start with{" "}
        <Link href="/guides/what-are-midi-drum-patterns">what MIDI drum patterns are</Link>.
      </p>
    </GuideArticle>
  );
}
