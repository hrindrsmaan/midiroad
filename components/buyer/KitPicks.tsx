import Link from "next/link";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { genrePath, genreForKit } from "@/lib/patterns";
import { BUNDLE_NAME, BUNDLE_PRICE, KIT_PRODUCTS, kitById, kitStats } from "@/lib/products";
import { formatUSD } from "@/lib/pricing";

/** Kit cards with live prices and pattern counts, for the buying pages. */
export function KitPicks({ ids, bundle = false }: { ids: string[]; bundle?: boolean }) {
  const kits = ids.map((id) => kitById(id)).filter((kit) => kit !== undefined);

  return (
    <ul className="mt-6 grid gap-3">
      {kits.map((kit) => {
        const stats = kitStats(kit);
        const genre = genreForKit(kit.id);
        return (
          <li key={kit.id} className="rounded-md border border-line bg-card px-4 py-4 md:px-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <Link href={`/kits/${kit.slug}`} className="text-lg font-semibold text-ink underline-offset-4 hover:text-brand hover:underline">
                {kit.name}
              </Link>
              <span className="font-wide text-brand">{formatUSD(kit.price)}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {kit.vibe}. {stats.patterns} patterns, {stats.minBpm}–{stats.maxBpm} BPM. {kit.tagline}
            </p>
            {genre && (
              <p className="mt-2 text-sm">
                <Link href={genrePath(genre)} className="font-medium text-ink underline underline-offset-4 hover:text-brand">
                  Preview {genre.name.toLowerCase()} patterns
                </Link>
              </p>
            )}
          </li>
        );
      })}
      {bundle && (
        <li className="rounded-md border border-brand/40 bg-card px-4 py-4 md:px-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <Link href="/kits" className="text-lg font-semibold text-ink underline-offset-4 hover:text-brand hover:underline">
              {BUNDLE_NAME}
            </Link>
            <span className="font-wide text-brand">{formatUSD(BUNDLE_PRICE)}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            All {KIT_PRODUCTS.length} kits in one download: {MIDI_PATTERN_COUNT} MIDI patterns and {ONE_SHOT_COUNT}{" "}
            one-shots.
          </p>
        </li>
      )}
    </ul>
  );
}
