import { spendCredit } from "@/lib/credits";
import { midiFileName, patternToMidi } from "@/lib/midi-file";
import { VIBE_IDS, generatePattern, type GenKind, type Vibe } from "@/lib/midi-generator";
import { creditError, currentUser, midiResponse } from "@/lib/session";

export const dynamic = "force-dynamic";

const KINDS: GenKind[] = ["hihat", "808", "kick", "beat"];
const int = (v: unknown, min: number, max: number) =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : null;

/**
 * Exports a beat maker pattern for 1 credit. The pattern is rebuilt here from
 * its seed (generation is deterministic), so the file can't be had without
 * paying by editing the request.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const kind = KINDS.find((k) => k === body?.kind);
  const vibe = VIBE_IDS.find((v) => v === body?.vibe) as Vibe | undefined;
  const bpm = int(body?.bpm, 60, 200);
  const key = int(body?.key, 0, 11);
  const seed = int(body?.seed, 0, 2 ** 31);
  const hatBase = body?.hatBase === 0.25 || body?.hatBase === 0.5 ? body.hatBase : null;
  const index = int(body?.index, 0, 99) ?? 0;
  if (!kind || !vibe || bpm === null || key === null || seed === null || hatBase === null) {
    return new Response("Invalid pattern", { status: 400 });
  }

  const user = await currentUser();
  if (!user) return creditError(401);

  const pattern = generatePattern(kind, bpm, key, seed, hatBase, vibe);
  // Muted parts are left out of the file; the credit covers the whole pattern.
  const parts: unknown = body?.parts;
  const kept = Array.isArray(parts)
    ? { ...pattern, tracks: pattern.tracks.filter((t) => parts.includes(t.part)) }
    : pattern;
  if (!kept.tracks.length) return new Response("No parts to export", { status: 400 });

  const spent = await spendCredit(user.id, `gen:${pattern.id}`);
  if (!spent.ok) return creditError(402, spent.credits);

  return midiResponse(patternToMidi(kept), midiFileName(pattern, index), spent.credits, spent.charged);
}
