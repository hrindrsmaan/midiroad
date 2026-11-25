import Link from "next/link";
import { TrackTable } from "@/components/catalog/TrackTable";
import { listingHref, SORTS, type ListingQuery, type ListingView } from "@/lib/listing";
import { BPM_RANGES, GENRES, PART_ORDER, bpmPath, genrePath, type PublicPattern } from "@/lib/patterns";
import type { CatalogTrack } from "@/lib/tracks";

const PART_LABEL: Record<string, string> = {
  hihat: "Hi-hats",
  "open-hat": "Open hats",
  snare: "Snares",
  kick: "Kicks",
  "808": "808s",
};

function Chip({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        current
          ? "border-foreground bg-foreground text-background"
          : "border-line text-muted hover:border-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">{children}</div>
    </div>
  );
}

export function CatalogListing({
  path,
  query,
  view,
  tracks,
  showKit = true,
  downloads = false,
  google = false,
  label = "Patterns",
}: {
  path: string;
  query: ListingQuery;
  view: ListingView<PublicPattern>;
  tracks: CatalogTrack[];
  showKit?: boolean;
  downloads?: boolean;
  google?: boolean;
  label?: string;
}) {
  const onMidi = path === "/midi" || path.startsWith("/midi/");
  const pages = view.pages;

  return (
    <div id="patterns" className="mt-10">
      <div className="space-y-2.5">
        {onMidi && (
          <ChipRow label="Style">
            <Chip href="/midi" current={path === "/midi"}>
              All
            </Chip>
            {GENRES.map((genre) => (
              <Chip key={genre.slug} href={genrePath(genre)} current={path === genrePath(genre)}>
                {genre.name}
              </Chip>
            ))}
          </ChipRow>
        )}
        {onMidi && (
          <ChipRow label="BPM">
            <Chip href="/midi/bpm" current={path === "/midi/bpm"}>
              All tempos
            </Chip>
            {BPM_RANGES.map((range) => (
              <Chip key={range.slug} href={bpmPath(range)} current={path === bpmPath(range)}>
                {range.label}
              </Chip>
            ))}
          </ChipRow>
        )}
        <ChipRow label="Part">
          <Chip href={listingHref(path, { page: 1, part: null }, query)} current={!query.part}>
            All
          </Chip>
          {PART_ORDER.map((id) => (
            <Chip key={id} href={listingHref(path, { page: 1, part: id }, query)} current={query.part === id}>
              {PART_LABEL[id]}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Sort">
          {SORTS.map((sort) => (
            <Chip
              key={sort.id}
              href={listingHref(path, { page: 1, sort: sort.id }, query)}
              current={query.sort === sort.id && (sort.id !== "default" || !query.faceted || query.part !== null)}
            >
              {sort.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <p className="mb-3 mt-6 text-xs text-muted">
        <span className="font-wide text-xs text-ink">{view.total}</span>
        {query.part ? ` ${PART_LABEL[query.part] ?? query.part}` : ""} patterns
        {pages > 1 ? ` · page ${view.page} of ${pages}` : ""}
      </p>

      <TrackTable tracks={tracks} showKit={showKit} downloads={downloads} google={google} label={label} />

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center gap-1.5">
          {view.page > 1 ? (
            <Link
              href={listingHref(path, { page: view.page - 1 }, query)}
              rel="prev"
              className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-strong"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-full border border-line px-3 py-1.5 text-xs text-muted/50">Previous</span>
          )}
          {Array.from({ length: pages }, (_, index) => {
            const number = index + 1;
            const href = listingHref(path, { page: number }, query);
            if (number === view.page) {
              return (
                <span
                  key={number}
                  aria-current="page"
                  className="grid h-8 min-w-8 place-items-center rounded-full bg-foreground px-2 text-xs font-semibold text-background"
                >
                  {number}
                </span>
              );
            }
            return (
              <Link
                key={number}
                href={href}
                className="grid h-8 min-w-8 place-items-center rounded-full border border-line px-2 text-xs text-muted hover:border-strong hover:text-ink"
              >
                {number}
              </Link>
            );
          })}
          {view.page < pages ? (
            <Link
              href={listingHref(path, { page: view.page + 1 }, query)}
              rel="next"
              className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-strong"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-full border border-line px-3 py-1.5 text-xs text-muted/50">Next</span>
          )}
        </nav>
      )}
    </div>
  );
}
