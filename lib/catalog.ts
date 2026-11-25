import type { PublicPattern } from "@/lib/patterns";
import { WAVE_BARS, waveCode, type CatalogTrack } from "@/lib/tracks";

export function toCatalogTrack(pattern: PublicPattern, bars = WAVE_BARS): CatalogTrack {
  return {
    id: pattern.id,
    libraryId: pattern.libraryId,
    title: pattern.title,
    bpm: pattern.bpm,
    duration: pattern.duration,
    path: pattern.path,
    kitName: pattern.kitName,
    kitSlug: pattern.kitSlug,
    partId: pattern.partId,
    partLabel: pattern.partLabel,
    wave: waveCode(pattern.peaks, bars),
  };
}

/** One hi-hat (or the first pattern) from each style, for the homepage row. */
export function featuredTracks(patterns: readonly PublicPattern[], genres: readonly { slug: string }[]): CatalogTrack[] {
  const picked: PublicPattern[] = [];
  for (const genre of genres) {
    const hats = patterns.find((pattern) => pattern.genreSlug === genre.slug && pattern.partId === "hihat");
    const any = patterns.find((pattern) => pattern.genreSlug === genre.slug);
    const hit = hats ?? any;
    if (hit) picked.push(hit);
  }
  return picked.map((pattern) => toCatalogTrack(pattern));
}
