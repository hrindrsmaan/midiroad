import { chordFileName, chordsToMidi, parseChordSpec, specNumerals } from "@/lib/chord-midi";
import { progressionNotes } from "@/lib/chords";
import { currentUser } from "@/lib/session";
import { activeSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

/**
 * Exports a chord maker progression as MIDI, for subscribers only. The file
 * is built here from the progression, so it can't be had without an active
 * (or trialing) plan. Downloads don't use credits.
 */
export async function POST(req: Request) {
  const spec = parseChordSpec(await req.json().catch(() => null));
  if (!spec) return new Response("Invalid progression", { status: 400 });

  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "sign_in", message: "Sign in to download chord MIDI." }, { status: 401 });
  }
  if (!(await activeSubscription())) {
    return Response.json(
      { error: "no_subscription", message: "Chord MIDI downloads are for subscribers." },
      { status: 403 },
    );
  }

  const notes = progressionNotes(spec.key, spec.mode, spec.slots, spec.rhythm, spec.bass);
  if (!notes.chords.length) return new Response("No notes to export", { status: 400 });
  const filename = chordFileName(spec.key, spec.mode, spec.bpm, specNumerals(spec));
  return new Response(new Uint8Array(chordsToMidi(notes, spec.bpm)), {
    headers: {
      "Content-Type": "audio/midi",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
