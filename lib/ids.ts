import { randomInt } from "node:crypto";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** A random base62 id (8 characters is about 47 bits): short enough for a URL, too many to guess. */
export function randomId(length = 8) {
  let id = "";
  for (let i = 0; i < length; i++) id += ALPHABET[randomInt(ALPHABET.length)];
  return id;
}

export const isRandomId = (value: unknown, length = 8): value is string =>
  typeof value === "string" && value.length === length && /^[0-9A-Za-z]+$/.test(value);
