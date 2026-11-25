import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { prepareListing, type Listable, type ListingSearch } from "@/lib/listing";

/** Titles, self-canonicals and rel=prev/next for a paginated catalog URL. */
export function catalogMetadata({
  title,
  description,
  path,
  items,
  searchParams,
}: {
  title: string;
  description: string;
  path: string;
  items: readonly Listable[];
  searchParams: ListingSearch | undefined;
}): Metadata {
  const prepared = prepareListing(items, searchParams, path);
  if (prepared.status !== "ok") return pageMetadata({ title, description, path });
  const pageTitle =
    prepared.meta.indexable && prepared.query.page > 1 ? `${title} (page ${prepared.query.page})` : title;
  return {
    ...pageMetadata({
      title: pageTitle,
      description,
      path: prepared.meta.canonicalPath,
      index: prepared.meta.indexable,
      follow: true,
    }),
    pagination: {
      previous: prepared.meta.prev ? absoluteUrl(prepared.meta.prev) : null,
      next: prepared.meta.next ? absoluteUrl(prepared.meta.next) : null,
    },
  };
}
