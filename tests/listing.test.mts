import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { arrangeListing, PAGE_SIZE, parseListingQuery, prepareListing } from "../lib/listing.ts";
import { waveCode, WAVE_BARS } from "../lib/tracks.ts";

const catalog = JSON.parse(readFileSync(new URL("../lib/pattern-catalog.json", import.meta.url), "utf8")) as {
  patterns: { id: string; genreSlug: string; partId: string; bpm: number; title: string }[];
};

const trap = catalog.patterns.filter((pattern) => pattern.genreSlug === "trap");
const fast = catalog.patterns.filter((pattern) => pattern.bpm >= 140 && pattern.bpm <= 159);

test("a catalog page renders one slice, not the whole list", () => {
  const prepared = prepareListing(trap, {}, "/midi/trap");
  assert.equal(prepared.status, "ok");
  if (prepared.status !== "ok") return;
  assert.equal(prepared.view.rows.length, PAGE_SIZE);
  assert.ok(prepared.view.rows.length < trap.length);
  assert.equal(prepared.view.total, trap.length);
  assert.equal(prepared.meta.canonicalPath, "/midi/trap");
  assert.equal(prepared.meta.indexable, true);

  const fastPage = prepareListing(fast, {}, "/midi/bpm/140-159");
  assert.equal(fastPage.status, "ok");
  if (fastPage.status !== "ok") return;
  assert.equal(fastPage.view.rows.length, PAGE_SIZE);
  assert.ok(fastPage.view.rows.length < fast.length);
});

test("pagination walks every pattern once and keeps a stable page size", () => {
  const seen = new Set<string>();
  const first = prepareListing(trap, {}, "/midi/trap");
  assert.equal(first.status, "ok");
  if (first.status !== "ok") return;
  for (let page = 1; page <= first.view.pages; page++) {
    const prepared = prepareListing(trap, page === 1 ? {} : { page: String(page) }, "/midi/trap");
    assert.equal(prepared.status, "ok");
    if (prepared.status !== "ok") return;
    assert.ok(prepared.view.rows.length > 0);
    assert.ok(prepared.view.rows.length <= PAGE_SIZE);
    if (page < first.view.pages) assert.equal(prepared.view.rows.length, PAGE_SIZE);
    for (const row of prepared.view.rows) {
      assert.equal(seen.has(row.id), false);
      seen.add(row.id);
    }
    if (page > 1) {
      assert.equal(prepared.meta.canonicalPath, `/midi/trap?page=${page}`);
      assert.equal(prepared.meta.indexable, true);
      assert.equal(prepared.meta.prev, page === 2 ? "/midi/trap" : `/midi/trap?page=${page - 1}`);
    }
  }
  assert.equal(seen.size, trap.length);
});

test("page 1 with a query redirects, and out-of-range pages do not render", () => {
  const redirect = prepareListing(trap, { page: "1" }, "/midi/trap");
  assert.deepEqual(redirect, { status: "redirect", href: "/midi/trap" });
  const missing = prepareListing(trap, { page: "99" }, "/midi/trap");
  assert.equal(missing.status, "not-found");
  const junk = prepareListing(trap, { page: "0" }, "/midi/trap");
  assert.equal(junk.status, "not-found");
});

test("part and sort filters are not indexable duplicates", () => {
  const filtered = prepareListing(trap, { part: "kick" }, "/midi/trap");
  assert.equal(filtered.status, "ok");
  if (filtered.status !== "ok") return;
  assert.equal(filtered.meta.indexable, false);
  assert.equal(filtered.meta.canonicalPath, "/midi/trap");
  assert.ok(filtered.view.rows.length > 0);
  assert.ok(filtered.view.rows.length <= PAGE_SIZE);
  assert.ok(filtered.view.rows.every((row) => row.partId === "kick"));
  assert.ok(filtered.view.total < trap.length);

  const sorted = parseListingQuery({ sort: "title" });
  assert.equal(sorted.faceted, true);
  const arranged = arrangeListing(trap, { ...sorted, page: 1 });
  const titles = arranged.rows.map((row) => row.title);
  const ordered = [...titles].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(titles, ordered);
});

test("listing pages no longer inline a waveform node per peak", () => {
  const peaks = Array.from({ length: 44 }, (_, index) => (index % 5) / 5);
  const code = waveCode(peaks);
  assert.equal(code.length, WAVE_BARS);
  assert.notEqual(code.length, peaks.length);
  const genre = readFileSync(new URL("../app/midi/[genre]/page.tsx", import.meta.url), "utf8");
  const tempo = readFileSync(new URL("../app/midi/bpm/[range]/page.tsx", import.meta.url), "utf8");
  const kit = readFileSync(new URL("../app/kits/[slug]/page.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const source of [genre, tempo]) {
    assert.match(source, /prepareListing/);
    assert.doesNotMatch(source, /PatternBrowser/);
  }
  assert.match(kit, /prepareListing/);
  assert.doesNotMatch(kit, /MidiKits/);
  assert.doesNotMatch(home, /MidiKits/);
});
