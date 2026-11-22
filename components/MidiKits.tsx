"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { SignInModal, type DownloadGate } from "@/components/auth/SignInModal";
import { Section, SectionHeader, type Tone } from "@/components/Section";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import { authClient } from "@/lib/auth-client";
import { event } from "@/lib/gtag";
import { MIDI_KITS, MIDI_PARTS, MIDI_PATTERN_COUNT, type MidiPattern, type PartPattern } from "@/lib/midi-kits";
import { paidDownload, type PaidDownload } from "@/lib/paid-download";
import { SIGNUP_CREDITS } from "@/lib/plans";
import { kitDisplayName } from "@/lib/products";

/** Patterns shown per part before "Show all". */
const VISIBLE = 12;
/** Below this a bucket is drawn as a rest dot, not a hit. */
const HIT_THRESHOLD = 0.08;
/** Query param that resumes a download after sign-in: ?download=<libraryId>. */
const RESUME_PARAM = "download";
/** One palette for every kit: slate at rest, play green while playing. */
const INK = "#64748b";
const BRAND = "#22c55e";

/**
 * A pattern drawn like a lane in a MIDI editor: hits as pills, faint bar
 * lines from the BPM, and a playhead while it plays.
 */
function MidiLane({
  pattern,
  progress,
  active,
}: {
  pattern: MidiPattern;
  progress: number;
  active: boolean;
}) {
  const barSeconds = (4 * 60) / pattern.bpm;
  const bars = Math.floor(pattern.duration / barSeconds);
  const played = progress * pattern.peaks.length;

  return (
    <div
      aria-hidden
      className="relative h-8 overflow-hidden rounded-[3px] border border-line/70 bg-canvas/60"
      style={active ? { boxShadow: `inset 0 0 0 1px ${BRAND}33, 0 0 18px -6px ${BRAND}` } : undefined}
    >
      {/* bar lines */}
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="absolute inset-y-1.5 w-px bg-ink/[0.07]"
          style={{ left: `${(((i + 1) * barSeconds) / pattern.duration) * 100}%` }}
        />
      ))}
      {/* centre line */}
      <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-ink/[0.06]" />

      <div className="absolute inset-x-1.5 inset-y-1 flex items-center">
        {pattern.peaks.map((peak, i) => {
          const isHit = peak >= HIT_THRESHOLD;
          const lit = !active || i < played;
          return (
            <span key={i} className="flex h-full flex-1 items-center justify-center">
              {isHit ? (
                <span
                  className="block w-[3px] rounded-[1px] transition-[opacity,box-shadow] duration-150 sm:w-1"
                  style={{
                    height: `${Math.max(28, peak * 100)}%`,
                    background: active && lit ? BRAND : INK,
                    opacity: lit ? 1 : 0.25,
                    boxShadow: active && lit ? `0 0 8px ${BRAND}99` : undefined,
                  }}
                />
              ) : (
                <span className="block h-[3px] w-[3px] rounded-key bg-ink/10" />
              )}
            </span>
          );
        })}
      </div>

      {active && (
        <span
          className="absolute inset-y-0 w-0.5 rounded-full"
          style={{
            left: `${progress * 100}%`,
            background: BRAND,
            boxShadow: `0 0 10px 1px ${BRAND}`,
          }}
        />
      )}
    </div>
  );
}

function Chip({
  selected,
  onClick,
  label,
  count,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`cursor-pointer rounded-key border px-4 py-2 text-[13px] font-medium transition-colors ${
        selected
          ? "border-primary bg-primary text-white"
          : "border-line bg-card text-ink hover:border-strong"
      }`}
    >
      {label}
      <span className={`ml-1.5 ${selected ? "text-white/85" : "text-muted"}`}>
        {count}
      </span>
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={2.5} />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

/**
 * Playable MIDI patterns. With `kitId`, shows only that kit (for its
 * product page); otherwise every kit with a kit filter.
 *
 * Each pattern downloads for 1 credit (it's the same file as in the library).
 * Signed out, the download button opens a sign-in modal; after sign-in the
 * page reloads with ?download=<libraryId> and the download picks up there.
 */
export function MidiKits({
  kitId: onlyKit,
  tone = "white",
  google = false,
}: { kitId?: string; tone?: Tone; google?: boolean } = {}) {
  const PARTS = useMemo(
    () =>
      onlyKit
        ? MIDI_PARTS.map((p) => ({ ...p, patterns: p.patterns.filter((x) => x.kitId === onlyKit) })).filter(
            (p) => p.patterns.length > 0,
          )
        : MIDI_PARTS,
    [onlyKit],
  );
  const total = PARTS.reduce((n, p) => n + p.patterns.length, 0);
  const { playingId, progress, toggle } = useMidiPlayer();

  const [partId, setPartId] = useState(PARTS[0].id);
  /** null shows the part from every kit. */
  const [kitId, setKitId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const [busy, setBusy] = useState<string | null>(null);
  /** Patterns downloaded this visit, shown with a check. */
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const [notice, setNotice] = useState<PaidDownload | null>(null);
  const [gate, setGate] = useState<{ reason: DownloadGate; pattern: PartPattern } | null>(null);
  const closeGate = useCallback(() => setGate(null), []);

  const download = useCallback(async (pattern: PartPattern) => {
    setBusy(pattern.id);
    const result = await paidDownload(`/api/library/${pattern.libraryId}`);
    setBusy(null);
    if (result.ok) {
      setSaved((s) => new Set(s).add(pattern.id));
      setNotice(result);
      event({ action: "download_kit_midi", category: "midi_kits", label: pattern.id });
    } else if (result.error === "failed") {
      setNotice(result);
    } else {
      setGate({ reason: result.error, pattern });
      event({ action: "download_blocked", category: "midi_kits", label: result.error });
    }
  }, []);

  const onDownload = (pattern: PartPattern) => {
    event({ action: "click_download_kit_midi", category: "midi_kits", label: pattern.id });
    // Known signed out: skip the round trip and ask straight away.
    if (!isPending && !session) setGate({ reason: "sign_in", pattern });
    else void download(pattern);
  };

  // Back from sign-in with ?download=<libraryId>: show that pattern and fetch it.
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current || isPending) return;
    const url = new URL(window.location.href);
    const id = url.searchParams.get(RESUME_PARAM);
    if (!id) return;
    resumed.current = true;
    url.searchParams.delete(RESUME_PARAM);
    window.history.replaceState(null, "", url.toString());
    const owner = PARTS.find((p) => p.patterns.some((x) => x.libraryId === id));
    const pattern = owner?.patterns.find((x) => x.libraryId === id);
    if (!owner || !pattern || !session) return;
    // One-off sync from the URL (an outside source) after sign-in, not a render loop.
    /* eslint-disable react-hooks/set-state-in-effect */
    setPartId(owner.id);
    setKitId(onlyKit ? null : pattern.kitId);
    setExpanded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    void download(pattern);
  }, [isPending, session, PARTS, onlyKit, download]);

  // Hide the "saved" toast after a few seconds.
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const resumeURL = (pattern: PartPattern) => {
    if (typeof window === "undefined") return "/";
    const url = new URL(window.location.href);
    url.searchParams.set(RESUME_PARAM, pattern.libraryId);
    url.hash = "midi-kits";
    return url.pathname + url.search + url.hash;
  };

  const part = PARTS.find((p) => p.id === partId) ?? PARTS[0];
  const partKits = MIDI_KITS.filter((k) => part.patterns.some((p) => p.kitId === k.id));
  const filtered = kitId
    ? part.patterns.filter((p) => p.kitId === kitId)
    : part.patterns;
  const patterns = expanded ? filtered : filtered.slice(0, VISIBLE);

  const selectPart = (id: string) => {
    setPartId(id);
    // Keep the kit filter when that kit has this part too.
    if (kitId && !PARTS.find((p) => p.id === id)!.patterns.some((p) => p.kitId === kitId)) {
      setKitId(null);
    }
    setExpanded(false);
  };

  const selectKit = (id: string | null) => {
    setKitId(id);
    setExpanded(false);
  };

  return (
    <Section id="midi-kits" tone={tone}>
      <SectionHeader
        eyebrow={
          onlyKit ? `${total} MIDI patterns` : `${MIDI_PATTERN_COUNT} MIDI patterns · ${MIDI_KITS.length} kits`
        }
        title={onlyKit ? "Hear every pattern" : "Hear every MIDI kit"}
        intro="Press play on any pattern. Each MIDI is played with drum samples from the bundle's one-shot kit."
      />

      <div role="tablist" aria-label="Drum parts" className={`flex flex-wrap gap-2 ${onlyKit ? "mb-10" : "mb-5"}`}>
        {PARTS.map((p) => (
          <Chip
            key={p.id}
            selected={p.id === part.id}
            onClick={() => selectPart(p.id)}
            label={p.label}
            count={p.patterns.length}
          />
        ))}
      </div>

      {!onlyKit && (
        <div
          role="tablist"
          aria-label={`${part.label} by kit`}
          className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-line"
        >
          {[{ id: null, name: "All kits" }, ...partKits].map((k) => {
            const selected = k.id === kitId;
            const count = k.id ? part.patterns.filter((p) => p.kitId === k.id).length : part.patterns.length;
            return (
              <button
                key={k.id ?? "all"}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectKit(k.id)}
                className={`-mb-px cursor-pointer border-b-2 py-2.5 text-[13px] font-medium transition-colors ${
                  selected ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {k.id ? kitDisplayName(k.id, k.name) : k.name} <span className="text-muted">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div role="tabpanel" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => {
          const active = playingId === pattern.id;
          return (
            <div
              key={pattern.id}
              className={`min-w-0 rounded-md border bg-card px-4 py-3.5 transition-colors ${active ? "border-brand" : "border-line"}`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void toggle(pattern)}
                  aria-label={`${active ? "Stop" : "Play"} ${kitDisplayName(pattern.kitId, pattern.kitName)} ${pattern.name}`}
                  aria-pressed={active}
                  className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors [&_svg]:h-4 [&_svg]:w-4 ${
                    active ? "bg-brand text-on-brand" : "bg-primary text-white hover:bg-primary-hover"
                  }`}
                >
                  {active ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline justify-between gap-2 text-sm font-medium">
                    <span className="truncate">{pattern.name}</span>
                    <span className="shrink-0 text-xs font-normal text-muted">{pattern.bpm} BPM</span>
                  </p>
                  {!onlyKit && (
                    <p className="truncate text-xs text-muted">{kitDisplayName(pattern.kitId, pattern.kitName)}</p>
                  )}
                  <div className="mt-2">
                    <MidiLane
                      pattern={pattern}
                      progress={active ? progress : 0}
                      active={active}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDownload(pattern)}
                  disabled={busy !== null}
                  aria-label={`Download ${kitDisplayName(pattern.kitId, pattern.kitName)} ${pattern.name} MIDI (1 credit)`}
                  title={saved.has(pattern.id) ? "Downloaded. Download again for free" : "Download MIDI · 1 credit"}
                  className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center self-start rounded-full border transition-colors disabled:cursor-default [&_svg]:h-4 [&_svg]:w-4 ${
                    saved.has(pattern.id)
                      ? "border-brand/30 bg-brand/5 text-brand"
                      : "border-line text-ink hover:border-strong hover:bg-white/10 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink"
                  }`}
                >
                  {busy === pattern.id ? <Spinner /> : saved.has(pattern.id) ? <CheckIcon /> : <DownloadIcon />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > VISIBLE && (
        <div className="mt-10">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="h-11 cursor-pointer rounded-key border border-strong px-6 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            {expanded ? "Show fewer" : `Show all ${filtered.length}`}
          </button>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Every pattern downloads as a MIDI file for 1 credit.{" "}
        {!isPending && !session && `New accounts get ${SIGNUP_CREDITS} free credits.`}
      </p>

      {notice && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm rounded-md border border-line bg-card px-4 py-3 text-center text-sm text-white shadow-2xl md:bottom-6"
        >
          {notice.ok ? (
            <>
              <span className="font-semibold">Saved {notice.filename}</span>
              <span className="text-white/60">
                {" "}
                · {notice.charged ? "1 credit used" : "already yours, free"} · {notice.credits} left
              </span>
            </>
          ) : (
            notice.message
          )}
        </div>
      )}

      <SignInModal
        reason={gate?.reason ?? null}
        fileName={gate ? `${kitDisplayName(gate.pattern.kitId, gate.pattern.kitName)} ${gate.pattern.name}` : undefined}
        google={google}
        callbackURL={gate ? resumeURL(gate.pattern) : "/"}
        onClose={closeGate}
      />
    </Section>
  );
}

export default MidiKits;
