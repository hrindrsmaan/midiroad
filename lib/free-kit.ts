import { readFile } from "node:fs/promises";
import path from "node:path";
import kit from "./free-kit.json";
import { patternById, type PublicPattern } from "@/lib/patterns";

/**
 * The free starter kit given for an email. The list is lib/free-kit.json;
 * the zip (private/free-kit.zip) is built from it by scripts/build-free-kit.py.
 */
export const FREE_KIT_NAME = kit.name;
export const FREE_KIT_PATH = "/free-midi-kit";
export const FREE_KIT_FILENAME = `${kit.slug}.zip`;

export const FREE_KIT_PATTERNS: PublicPattern[] = kit.patterns.map((id) => {
  const pattern = patternById(id);
  if (!pattern) throw new Error(`lib/free-kit.json lists unknown pattern ${id}`);
  return pattern;
});

export const FREE_KIT_COUNT = FREE_KIT_PATTERNS.length;

const bpms = FREE_KIT_PATTERNS.map((p) => p.bpm);
export const FREE_KIT_MIN_BPM = Math.min(...bpms);
export const FREE_KIT_MAX_BPM = Math.max(...bpms);

export const readFreeKitZip = () => readFile(path.join(process.cwd(), "private", "free-kit.zip"));
