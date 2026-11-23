import type { MetadataRoute } from "next";
import { KIT_PRODUCTS } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

/**
 * Public pages for search engines. Account, checkout, and sign-in pages are
 * left out. Pattern and hub URLs are added beside these once they exist;
 * every URL uses the apex host with no trailing slash, matching the canonical tag.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/beat-maker"), changeFrequency: "monthly", priority: 0.9 },
    ...KIT_PRODUCTS.map((kit) => ({
      url: absoluteUrl(`/kits/${kit.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/library"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.5 },
  ];
}
