"use client";

import Link from "next/link";
import { useState } from "react";
import type { LibraryItem } from "@/lib/library";
import { paidDownload, type PaidDownload } from "@/lib/paid-download";

type ListedItem = LibraryItem & { href?: string; title?: string };
type Folder = { folder: string; items: ListedItem[] };

/** Folders of MIDI files, each downloadable for 1 credit (free once unlocked). */
export function LibraryList({
  folders,
  owned: initialOwned,
  credits: initialCredits,
  signedIn,
}: {
  folders: Folder[];
  owned: string[];
  credits: number;
  signedIn: boolean;
}) {
  const [owned, setOwned] = useState(() => new Set(initialOwned));
  const [credits, setCredits] = useState(initialCredits);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<PaidDownload | null>(null);

  async function download(item: LibraryItem) {
    setBusy(item.id);
    const result = await paidDownload(`/api/library/${item.id}`);
    setBusy(null);
    setNotice(result);
    if (result.ok) {
      setCredits(result.credits);
      setOwned((s) => new Set(s).add(item.id));
    }
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-card/95 px-4 py-3 text-sm backdrop-blur">
        {signedIn ? (
          <span>
            <strong>{credits}</strong> credits left · {owned.size} files unlocked
          </span>
        ) : (
          <span>
            <a href="/login?next=/library" className="font-semibold text-brand hover:underline">
              Sign in
            </a>{" "}
            to download. New accounts get free credits.
          </span>
        )}
        <Notice notice={notice} />
      </div>

      {folders.map(({ folder, items }) => (
        <details key={folder} className="group rounded-md border border-line bg-card" open={folders.length < 4}>
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold">
            {folder}
            <span className="text-sm font-normal text-muted">
              {items.filter((i) => owned.has(i.id)).length}/{items.length} unlocked
              <span className="ml-2 inline-block transition-transform group-open:rotate-180">▾</span>
            </span>
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {items.map((item) => {
              const have = owned.has(item.id);
              return (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                  <div className="min-w-0">
                    {item.href && item.title ? (
                      <Link href={item.href} className="block truncate font-medium hover:underline">
                        {item.title}
                      </Link>
                    ) : null}
                    <span className={`block truncate ${item.title ? "text-xs text-muted" : ""}`}>
                      {item.name.replace(/\.mid$/i, "")}
                    </span>
                  </div>
                  <button
                    onClick={() => download(item)}
                    disabled={busy !== null}
                    className={`h-8 shrink-0 rounded-key px-4 text-xs font-semibold transition-colors disabled:opacity-60 ${
                      have ? "border border-line hover:bg-foreground/[0.03]" : "bg-primary text-on-brand hover:bg-primary-hover"
                    }`}
                  >
                    {busy === item.id ? "…" : have ? "Download" : "1 credit"}
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </div>
  );
}

function Notice({ notice }: { notice: PaidDownload | null }) {
  if (!notice) return null;
  if (notice.ok) return <span className="text-muted">Saved {notice.filename}</span>;
  if (notice.error === "sign_in")
    return (
      <a href="/login?next=/library" className="font-semibold text-brand hover:underline">
        Sign in to download
      </a>
    );
  if (notice.error === "no_credits")
    return (
      <a href="/pricing" className="font-semibold text-brand hover:underline">
        Out of credits. Get a plan →
      </a>
    );
  return <span className="text-brand">{notice.message}</span>;
}
