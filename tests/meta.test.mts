import assert from "node:assert/strict";
import test from "node:test";
import { fitMetaDescription, META_DESCRIPTION_LIMIT } from "../lib/meta-text.ts";

const HOME =
  "Royalty-free MIDI drum kits for trap, drill and RnB producers: 210 drag-and-drop MIDI drum patterns and 77 drum one-shots for FL Studio, Ableton, Logic and any DAW, plus a free trap beat maker.";

test("meta descriptions already within 160 characters stay exact", () => {
  const short = "Shop royalty-free MIDI drum kits for trap, drill, dark trap and 808s, or get every kit in The Complete Vault.";
  assert.ok(short.length <= META_DESCRIPTION_LIMIT);
  assert.equal(fitMetaDescription(short), short);
});

test("long meta descriptions are cut to 160 characters on a word boundary", () => {
  const fitted = fitMetaDescription(HOME);
  assert.ok(HOME.length > META_DESCRIPTION_LIMIT);
  assert.ok(fitted.length <= META_DESCRIPTION_LIMIT);
  assert.ok(HOME.startsWith(fitted));
  assert.equal(fitted.endsWith(" "), false);
});
