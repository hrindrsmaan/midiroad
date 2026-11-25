import type { Metadata } from "next";
import { fitMetaDescription } from "@/lib/meta-text";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * Title, description, self-referencing canonical, and Open Graph for one page.
 *
 * The root layout's canonical and og:url are the homepage. A page that does
 * not replace them inherits the homepage URL, which is how Search Console
 * ended up with duplicates (pricing's share URL was the homepage, and sign-in
 * canonicalized to it). Pass `index: false` for account, checkout, and sign-in.
 * Pass `follow: true` with it for a page that should stay out of results but
 * whose links should still be crawled (the credit library).
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
  follow = false,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  /** Path on the apex host, e.g. "/pricing". */
  path: string;
  index?: boolean;
  /** Only read when `index` is false. */
  follow?: boolean;
  /** Share image path; the site-wide card by default. */
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const summary = fitMetaDescription(description);
  return {
    title,
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: summary,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: image,
    },
    ...(index
      ? {}
      : { robots: { index: false, follow, googleBot: { index: false, follow } } }),
  };
}
