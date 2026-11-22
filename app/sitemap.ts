import type { MetadataRoute } from "next";
import { KIT_PRODUCTS } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

/** Public pages for search engines; account, checkout and sign-in pages are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...KIT_PRODUCTS.map((kit) => ({
      url: absoluteUrl(`/kits/${kit.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/library"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.5 },
  ];
}
