import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * Title, description, self-referencing canonical, and Open Graph for one page.
 *
 * The root layout's canonical and og:url are the homepage. A page that does
 * not replace them inherits the homepage URL, which is how Search Console
 * ended up with duplicates (pricing's share URL was the homepage, and sign-in
 * canonicalized to it). Pass `index: false` for account, checkout, and sign-in.
 */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  /** Path on the apex host, e.g. "/pricing". */
  path: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: "/opengraph-image",
    },
    ...(index
      ? {}
      : { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
  };
}
