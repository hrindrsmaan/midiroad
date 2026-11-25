"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { SignInModal, type DownloadGate } from "@/components/auth/SignInModal";
import { WaveformSvg, usePlayer } from "@/components/player/Player";
import { authClient } from "@/lib/auth-client";
import { event } from "@/lib/gtag";
import { paidDownload, type PaidDownload } from "@/lib/paid-download";
import { SIGNUP_CREDITS } from "@/lib/plans";
import type { CatalogTrack } from "@/lib/tracks";

const RESUME_PARAM = "download";

function LazyWave({ code, active }: { code: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-7 min-w-[5.5rem] flex-1">
      {visible ? <WaveformSvg code={code} active={active} className="h-7 w-full" /> : null}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
    </svg>
  );
}

/**
 * Compact catalog rows: play, title, kit, BPM, part, lazy waveform.
 * `downloads` keeps the 1-credit unlock that the kit player used.
 */
export function TrackTable({
  tracks,
  queue,
  showKit = true,
  downloads = false,
  google = false,
  label = "Patterns",
  creditNote,
}: {
  tracks: CatalogTrack[];
  /** Prev/next list. Defaults to `tracks`. */
  queue?: CatalogTrack[];
  showKit?: boolean;
  downloads?: boolean;
  google?: boolean;
  label?: string;
  /**
   * Replaces the default credit line. Used where the patterns are already
   * part of something the visitor has bought, so the "1 credit" wording
   * would read as a second charge for the same files.
   */
  creditNote?: React.ReactNode;
}) {
  const player = usePlayer();
  const list = queue ?? tracks;
  const { data: session, isPending } = authClient.useSession();
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const [notice, setNotice] = useState<PaidDownload | null>(null);
  const [gate, setGate] = useState<{ reason: DownloadGate; track: CatalogTrack } | null>(null);
  const resumed = useRef(false);

  const download = useCallback(async (track: CatalogTrack) => {
    setBusy(track.id);
    const result = await paidDownload(`/api/library/${track.libraryId}`);
    setBusy(null);
    if (result.ok) {
      setSaved((current) => new Set(current).add(track.id));
      setNotice(result);
      event({ action: "download_kit_midi", category: "midi_kits", label: track.id });
    } else if (result.error === "failed") {
      setNotice(result);
    } else {
      setGate({ reason: result.error, track });
      event({ action: "download_blocked", category: "midi_kits", label: result.error });
    }
  }, []);

  useEffect(() => {
    if (!downloads || resumed.current || isPending) return;
    const url = new URL(window.location.href);
    const id = url.searchParams.get(RESUME_PARAM);
    if (!id) return;
    resumed.current = true;
    url.searchParams.delete(RESUME_PARAM);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    const track = list.find((item) => item.libraryId === id);
    if (!track || !session) return;
    // Resume a download the visitor started before signing in.
    /* eslint-disable react-hooks/set-state-in-effect */
    void download(track);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [downloads, isPending, session, list, download]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const resumeURL = (track: CatalogTrack) => {
    if (typeof window === "undefined") return "/";
    const url = new URL(window.location.href);
    url.searchParams.set(RESUME_PARAM, track.libraryId);
    return url.pathname + url.search + url.hash;
  };

  if (tracks.length === 0) {
    return <p className="py-8 text-sm text-muted">No patterns in this view.</p>;
  }

  return (
    <div>
      <ul aria-label={label} className="divide-y divide-line border-y border-line">
        {tracks.map((track) => {
          const playing = player.playingId === track.id;
          return (
            <li
              key={track.id}
              className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-1 py-2 md:grid-cols-[auto_minmax(0,1.5fr)_minmax(0,0.9fr)_4.5rem_6.5rem_minmax(7rem,1fr)_auto] ${
                playing ? "bg-white/[0.03]" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => player.play(track, list)}
                aria-label={`${playing ? "Stop" : "Play"} ${track.title}`}
                aria-pressed={playing}
                className={`grid h-9 w-9 cursor-pointer place-items-center rounded-full [&_svg]:h-3.5 [&_svg]:w-3.5 ${
                  playing ? "bg-brand text-on-brand" : "bg-white/10 text-ink hover:bg-white/15"
                }`}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <div className="min-w-0">
                <Link href={track.path} className="block truncate text-sm font-medium hover:underline">
                  {track.title}
                </Link>
                <p className="truncate text-xs text-muted md:hidden">
                  {showKit ? `${track.kitName} · ` : ""}
                  <span className="font-wide text-xs">{track.bpm} BPM</span>
                  {` · ${track.partLabel}`}
                </p>
              </div>
              {showKit ? (
                <Link href={`/kits/${track.kitSlug}`} className="hidden truncate text-xs text-muted hover:text-ink md:block">
                  {track.kitName}
                </Link>
              ) : (
                <span className="hidden md:block" />
              )}
              <span className="hidden text-xs tabular-nums text-muted md:block">
                <span className="font-wide text-xs">{track.bpm}</span>
              </span>
              <span className="hidden truncate text-xs text-muted md:block">{track.partLabel}</span>
              <div className="col-span-2 col-start-2 md:col-span-1 md:col-start-auto">
                <LazyWave code={track.wave} active={playing} />
              </div>
              {downloads ? (
                <button
                  type="button"
                  onClick={() => {
                    event({ action: "click_download_kit_midi", category: "midi_kits", label: track.id });
                    if (!isPending && !session) setGate({ reason: "sign_in", track });
                    else void download(track);
                  }}
                  disabled={busy !== null}
                  aria-label={`Download ${track.title} MIDI, 1 credit`}
                  className={`grid h-9 w-9 cursor-pointer place-items-center rounded-full border [&_svg]:h-4 [&_svg]:w-4 ${
                    saved.has(track.id)
                      ? "border-brand/40 text-brand"
                      : "border-line text-ink hover:border-strong disabled:opacity-50"
                  }`}
                >
                  {busy === track.id ? <span className="text-[10px]">…</span> : saved.has(track.id) ? <span aria-hidden>✓</span> : <DownloadIcon />}
                </button>
              ) : (
                <span className="hidden md:block" />
              )}
            </li>
          );
        })}
      </ul>
      {downloads && (
        <p className="mt-3 text-xs text-muted">
          {creditNote ?? (
            <>
              Every pattern downloads as a MIDI file for 1 credit.
              {!isPending && !session ? ` New accounts get ${SIGNUP_CREDITS} free credits.` : ""}
            </>
          )}
        </p>
      )}
      {notice && (
        <div role="status" className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm rounded-md border border-line bg-card px-4 py-3 text-center text-sm shadow-2xl">
          {notice.ok ? (
            <>
              <span className="font-semibold">Saved {notice.filename}</span>
              <span className="text-muted">
                {" "}
                · {notice.charged ? "1 credit used" : "already yours, free"} · {notice.credits} left
              </span>
            </>
          ) : (
            notice.message
          )}
        </div>
      )}
      {downloads && (
        <SignInModal
          reason={gate?.reason ?? null}
          fileName={gate?.track.title}
          google={google}
          callbackURL={gate ? resumeURL(gate.track) : "/"}
          onClose={() => setGate(null)}
        />
      )}
    </div>
  );
}
