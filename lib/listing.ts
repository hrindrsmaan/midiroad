/** Rows on the first paint of a catalog page. Keeps the HTML small and the pages crawlable. */
export const PAGE_SIZE = 32;

export const SORTS = [
  { id: "default", label: "Featured" },
  { id: "bpm-asc", label: "BPM" },
  { id: "title", label: "Title" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export type ListingSearch = Record<string, string | string[] | undefined>;

export type Listable = {
  id: string;
  partId: string;
  bpm: number;
  title: string;
};

export type ListingQuery = {
  page: number;
  part: string | null;
  sort: SortId;
  /** `?page=1` duplicates the clean URL. */
  redirectPageOne: boolean;
  /** Part or sort query. Indexed pages are only the clean URL and `?page=`. */
  faceted: boolean;
};

export type ListingView<T> = {
  total: number;
  pages: number;
  page: number;
  rows: T[];
};

export type ListingMeta = {
  indexable: boolean;
  /** Path (and query, for page 2+) used as the self-canonical. */
  canonicalPath: string;
  prev: string | null;
  next: string | null;
};

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export function parseListingQuery(searchParams: ListingSearch | undefined): ListingQuery {
  const pageRaw = one(searchParams?.page);
  const partRaw = one(searchParams?.part);
  const sortRaw = one(searchParams?.sort);
  const pageNum = pageRaw === undefined ? 1 : /^\d+$/.test(pageRaw) ? Number(pageRaw) : Number.NaN;
  const known = SORTS.find((sort) => sort.id === sortRaw);
  const hasPart = partRaw !== undefined && partRaw !== "";
  const hasSort = sortRaw !== undefined && sortRaw !== "";
  return {
    page: pageNum >= 1 ? pageNum : Number.NaN,
    part: hasPart && partRaw !== "all" ? partRaw : null,
    sort: known?.id ?? "default",
    redirectPageOne: pageRaw === "1",
    faceted: hasPart || hasSort,
  };
}

export function arrangeListing<T extends Listable>(items: readonly T[], query: ListingQuery, pageSize = PAGE_SIZE): ListingView<T> {
  let rows = items.filter((item) => (query.part ? item.partId === query.part : true));
  if (query.sort === "bpm-asc") {
    rows = [...rows].sort((a, b) => a.bpm - b.bpm || a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  } else if (query.sort === "title") {
    rows = [...rows].sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  }
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = query.page;
  const start = (page - 1) * pageSize;
  const slice = Number.isFinite(page) && page >= 1 && page <= pages ? rows.slice(start, start + pageSize) : [];
  return { total, pages, page, rows: slice };
}

/** Link to this listing with one piece of the query changed. Page 1 omits `page`. */
export function listingHref(
  path: string,
  patch: { page?: number; part?: string | null; sort?: SortId },
  current: ListingQuery,
): string {
  const page = patch.page ?? current.page;
  const part = patch.part === undefined ? current.part : patch.part;
  const sort = patch.sort ?? current.sort;
  const params = new URLSearchParams();
  if (part) params.set("part", part);
  if (sort !== "default") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function listingMeta(path: string, query: ListingQuery, pages: number): ListingMeta {
  const indexable = !query.faceted && Number.isFinite(query.page) && query.page >= 1 && query.page <= pages;
  return {
    indexable,
    canonicalPath: indexable && query.page > 1 ? `${path}?page=${query.page}` : path,
    prev: query.page > 1 ? listingHref(path, { page: query.page - 1 }, query) : null,
    next: query.page < pages ? listingHref(path, { page: query.page + 1 }, query) : null,
  };
}

export type PreparedListing<T> =
  | { status: "redirect"; href: string }
  | { status: "not-found" }
  | { status: "ok"; query: ListingQuery; view: ListingView<T>; meta: ListingMeta };

/** What a catalog URL should render. Faceted URLs stay out of the index. */
export function prepareListing<T extends Listable>(
  items: readonly T[],
  searchParams: ListingSearch | undefined,
  path: string,
): PreparedListing<T> {
  const query = parseListingQuery(searchParams);
  if (query.redirectPageOne) return { status: "redirect", href: listingHref(path, { page: 1 }, query) };
  if (!Number.isFinite(query.page)) return { status: "not-found" };
  const view = arrangeListing(items, query);
  if (query.page > view.pages) return { status: "not-found" };
  return { status: "ok", query, view, meta: listingMeta(path, query, view.pages) };
}
