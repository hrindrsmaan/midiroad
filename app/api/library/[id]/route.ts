import { spendCredit } from "@/lib/credits";
import { libraryItem, readLibraryFile } from "@/lib/library";
import { creditError, currentUser, midiResponse } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Downloads one library MIDI file for 1 credit (free if already unlocked). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = libraryItem(id);
  if (!item) return new Response("Unknown file", { status: 404 });

  const user = await currentUser();
  if (!user) return creditError(401);

  const spent = await spendCredit(user.id, `lib:${item.id}`);
  if (!spent.ok) return creditError(402, spent.credits);

  const bytes = await readLibraryFile(item.id);
  if (!bytes) return new Response("File missing", { status: 500 });
  return midiResponse(bytes, item.name, spent.credits, spent.charged);
}
