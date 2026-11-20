#!/usr/bin/env node
/**
 * Builds the credit library from the full bundle (private/midiroad.zip):
 *   - private/library.zip   every MIDI file, stored by id (small, served one at a time)
 *   - lib/library.json      the listing: id, folder, file name
 *
 * Ids are a short hash of the path inside the bundle, so they stay stable when
 * the bundle is rebuilt and a user's past unlocks keep pointing at the same file.
 * Re-run whenever the bundle zip changes:  node scripts/build-library.mjs
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { unzipSync, zipSync } from "fflate";

const ROOT = "MIDIROAD/MIDI KITS/";
const bundle = unzipSync(readFileSync("private/midiroad.zip"), {
  filter: (f) => f.name.startsWith(ROOT) && f.name.endsWith(".mid") && !f.name.includes("__MACOSX"),
});

const files = {};
const items = Object.keys(bundle)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path) => {
    const id = createHash("sha256").update(path).digest("hex").slice(0, 12);
    const [folder, ...rest] = path.slice(ROOT.length).split("/");
    files[`${id}.mid`] = bundle[path];
    return { id, folder, name: rest.at(-1) };
  });

writeFileSync("private/library.zip", zipSync(files, { level: 9 }));
writeFileSync("lib/library.json", JSON.stringify(items, null, 1) + "\n");
console.log(`${items.length} MIDI files in ${new Set(items.map((i) => i.folder)).size} folders`);
