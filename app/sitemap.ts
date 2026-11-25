import { BPM_KEY_PATH } from "@/lib/bpm-key/content";
import type { MetadataRoute } from "next";
import { BPM_RANGES, GENRES, PATTERNS, bpmPath, genrePath, patternPath, patternsInGenre, patternsInRange } from "@/lib/patterns";
import { GUIDES, guidePath } from "@/lib/guides";
import { KIT_PRODUCTS } from "@/lib/products";
import { PAGE_SIZE } from "@/lib/listing";
import { absoluteUrl } from "@/lib/site";

/**
 * Public pages for search engines. Account, checkout, and sign-in pages are
 * left out, and so is /library (noindex: the pattern pages cover its files), and so are shared beats (/b/<id>, noindex). Pattern pages and style/tempo hubs are included.
 * Every URL uses the apex host with no trailing slash, matching the canonical tag.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const extra = (path: string, count: number): MetadataRoute.Sitemap => {
    const pages = Math.ceil(count / PAGE_SIZE);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, index) => ({
      url: absoluteUrl(`${path}?page=${index + 2}`),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  };

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/beat-maker"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/free-midi-kit"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/kits"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/chord-maker"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(BPM_KEY_PATH), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/midi"), changeFrequency: "weekly", priority: 0.9 },
    ...extra("/midi", PATTERNS.length),
    ...GENRES.flatMap((genre) => [
      {
        url: absoluteUrl(genrePath(genre)),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      ...extra(genrePath(genre), patternsInGenre(genre.slug).length),
    ]),
    { url: absoluteUrl("/midi/bpm"), changeFrequency: "monthly", priority: 0.7 },
    ...BPM_RANGES.flatMap((range) => [
      {
        url: absoluteUrl(bpmPath(range)),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      ...extra(bpmPath(range), patternsInRange(range).length),
    ]),
    ...PATTERNS.map((pattern) => ({
      url: absoluteUrl(patternPath(pattern)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...KIT_PRODUCTS.flatMap((kit) => {
      const count = PATTERNS.filter((pattern) => pattern.kitId === kit.id).length;
      return [
        {
          url: absoluteUrl(`/kits/${kit.slug}`),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
        ...extra(`/kits/${kit.slug}`, count),
      ];
    }),
    { url: absoluteUrl("/guides"), changeFrequency: "monthly", priority: 0.7 },
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(guidePath(guide)),
      lastModified: guide.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.5 },
  ];
}
