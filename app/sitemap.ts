import type { MetadataRoute } from "next";
import { BPM_RANGES, GENRES, PATTERNS, bpmPath, genrePath, patternPath } from "@/lib/patterns";
import { GUIDES, guidePath } from "@/lib/guides";
import { KIT_PRODUCTS } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

/**
 * Public pages for search engines. Account, checkout, and sign-in pages are
 * left out, and so is /library (noindex: the pattern pages cover its files). Pattern pages and style/tempo hubs are included.
 * Every URL uses the apex host with no trailing slash, matching the canonical tag.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/beat-maker"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/chord-maker"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/midi"), changeFrequency: "weekly", priority: 0.9 },
    ...GENRES.map((genre) => ({
      url: absoluteUrl(genrePath(genre)),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/midi/bpm"), changeFrequency: "monthly", priority: 0.7 },
    ...BPM_RANGES.map((range) => ({
      url: absoluteUrl(bpmPath(range)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...PATTERNS.map((pattern) => ({
      url: absoluteUrl(patternPath(pattern)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...KIT_PRODUCTS.map((kit) => ({
      url: absoluteUrl(`/kits/${kit.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
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
