#!/usr/bin/env node
/**
 * Cleans the product zips and ships the license inside them.
 *
 *   - private/midiroad.zip     the bundle: 210 MIDI + 77 one-shot WAV
 *   - private/kits/<id>.zip    one zip per kit
 *
 * Two problems it fixes:
 *   1. The bundle was zipped on macOS, so it carried ~350 __MACOSX resource
 *      forks and .DS_Store files. A customer downloading a $14.99 product
 *      should not unpack junk folders.
 *   2. Neither zip contained a license, while the site sells the files as
 *      royalty-free. The license is the thing the buyer needs to prove what
 *      they may do with the files, so it travels with the files.
 *
 * The license text lives in content/license.txt, shared with /license.
 *
 * Run:  node scripts/clean-zips.mjs
 * Verify after running: the file counts printed must still match what the
 * site advertises (210 MIDI + 77 one-shots in the bundle, and the kit's
 * pattern count in each kit zip).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { unzipSync, zipSync } from "fflate";

const LICENSE = readFileSync("content/license.txt");
const LICENSE_NAME = "LICENSE.txt";

/** macOS resource forks, Finder metadata and the __MACOSX shadow tree. */
function isJunk(path) {
  return (
    path.startsWith("__MACOSX/") ||
    path.endsWith(".DS_Store") ||
    path.split("/").some((part) => part.startsWith("._"))
  );
}

function cleanZip(file, { addLicense = true } = {}) {
  const original = unzipSync(readFileSync(file));
  const kept = {};
  let dropped = 0;

  for (const [path, bytes] of Object.entries(original)) {
    if (isJunk(path)) {
      dropped += 1;
      continue;
    }
    kept[path] = bytes;
  }

  if (addLicense) {
    // Put the license at the top level of the archive, next to the folders.
    const root = Object.keys(kept).find((p) => p.includes("/"));
    const dir = root ? root.slice(0, root.indexOf("/")) : "";
    kept[dir ? `${dir}/${LICENSE_NAME}` : LICENSE_NAME] = LICENSE;
  }

  writeFileSync(file, zipSync(kept, { level: 9 }));
  return { dropped, total: Object.keys(kept).length };
}

const bundle = cleanZip("private/midiroad.zip");
console.log(
  `private/midiroad.zip: dropped ${bundle.dropped} junk entries, ${bundle.total} files left ` +
    `(${(readFileSync("private/midiroad.zip").length / 1024 / 1024).toFixed(1)} MB)`,
);

for (const id of ["essentials", "black-market", "odyssey", "psycho", "decoy", "focus"]) {
  const file = `private/kits/${id}.zip`;
  const result = cleanZip(file);
  console.log(`${file}: dropped ${result.dropped} junk entries, ${result.total} files left`);
}
