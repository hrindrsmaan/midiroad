import { readFile } from "node:fs/promises";
import path from "node:path";
import { unzipSync } from "fflate";
import items from "./library.json";

/**
 * Every MIDI file a credit can unlock, one at a time.
 * Built by scripts/build-library.mjs from private/midiroad.zip.
 */
export type LibraryItem = { id: string; folder: string; name: string };

export const LIBRARY: LibraryItem[] = items;

export const libraryItem = (id: string) => LIBRARY.find((i) => i.id === id);

/** Folders in listing order, with their files. */
export const LIBRARY_FOLDERS = LIBRARY.reduce<{ folder: string; items: LibraryItem[] }[]>((acc, item) => {
  const group = acc.find((g) => g.folder === item.folder);
  if (group) group.items.push(item);
  else acc.push({ folder: item.folder, items: [item] });
  return acc;
}, []);

/** One file's bytes, read out of private/library.zip (about 50 KB). */
export async function readLibraryFile(id: string): Promise<Uint8Array | null> {
  const zip = await readFile(path.join(process.cwd(), "private", "library.zip"));
  const name = `${id}.mid`;
  return unzipSync(new Uint8Array(zip), { filter: (f) => f.name === name })[name] ?? null;
}
