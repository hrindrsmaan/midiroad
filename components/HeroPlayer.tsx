"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import type { FeaturedBeat } from "@/lib/featured-beat";
import { FEATURED_BARS, FEATURED_STEPS } from "@/lib/featured-beat";

type Props = {
  beat: FeaturedBeat;
  /** The kit's cover, rendered on the server. */
  cover: ReactNode;
};

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function SpinnerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-7 w-7 motion-safe:animate-spin" aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
    </svg>
  );
}

function RetryGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-6 w-6" aria-hidden>
      <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The home hero's player: one big Play for a full beat (four real kit
 * patterns layered), beside the kit's cover and a step grid whose notes
 * light as they sound. Starting it stops any other player on the page.
 */
export function HeroPlayer({ beat, cover }: Props) {
  const midi = useMidiPlayer();
  const [failed, setFailed] = useState(false);

  const playing = midi.playingId === beat.id;
  const loading = playing && midi.progress === 0;
  const step = playing && !loading ? Math.floor(midi.progress * FEATURED_STEPS) % FEATURED_STEPS : -1;
  const bar = step < 0 ? 1 : Math.floor(step / 16) + 1;

  const toggle = async () => {
    setFailed(false);
    const layers = beat.lanes.map((lane) => ({ sample: lane.sample, hits: lane.hits }));
    const ok = await midi.toggle({ id: beat.id, duration: beat.loop }, layers, beat.loop);
    if (!ok) setFailed(true);
  };

  const status = failed
    ? "Couldn’t load the sounds"
    : loading
      ? "Loading the drums…"
      : playing
        ? "Playing"
        : "Play the beat";
  const detail = failed
    ? "Check your connection and try again"
    : playing && !loading
      ? `Bar ${bar} of ${FEATURED_BARS}`
      : `${beat.bpm} BPM · ${FEATURED_BARS} bars, looped`;
  const buttonLabel = failed
    ? "Try playing the featured beat again"
    : playing
      ? "Pause the featured beat"
      : "Play the featured beat";

  return (
    <div className="min-w-0 rounded-md border border-line bg-card p-4 md:p-7">
      <div className="flex items-center gap-3.5 md:items-stretch md:gap-6">
        <div className="w-[72px] shrink-0 overflow-hidden rounded-[5px] md:w-[168px] md:rounded-md">{cover}</div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-2.5">
          <p className="text-xs font-semibold text-muted md:text-[13px]">Featured beat · {beat.kitName}</p>
          <h2 className="text-balance text-base font-bold leading-tight tracking-[-0.02em] md:text-2xl">
            <span className="md:hidden">Four patterns, played together</span>
            <span className="hidden md:inline">Four patterns from one kit, played together</span>
          </h2>
          <p className="hidden text-pretty text-sm leading-relaxed text-muted md:block">
            {beat.lanes.map((lane) => lane.title.replace(/ trap$/, "")).join(", ").replace(/, ([^,]*)$/, " and $1")}, at{" "}
            {beat.bpm} BPM with the bundle&apos;s own one-shots.
          </p>
          <div className="mt-auto hidden items-center gap-4 md:flex">
            <PlayButton playing={playing} loading={loading} failed={failed} label={buttonLabel} onClick={toggle} />
            <Status status={status} detail={detail} failed={failed} />
          </div>
          <p className="text-xs tabular-nums text-muted md:hidden" aria-hidden>
            {detail}
          </p>
        </div>
        <div className="md:hidden">
          <PlayButton playing={playing} loading={loading} failed={failed} label={buttonLabel} onClick={toggle} />
        </div>
      </div>

      <div
        role="img"
        aria-label={`Step grid of the featured beat: ${beat.lanes.map((lane) => lane.label).join(", ")} over ${FEATURED_BARS} bars`}
        className="mt-3.5 flex flex-col gap-1.5 md:mt-6 md:gap-2"
      >
        {beat.lanes.map((lane) => (
          <div key={lane.label} className="grid grid-cols-[38px_minmax(0,1fr)] items-center gap-2 md:grid-cols-[52px_minmax(0,1fr)] md:gap-3">
            <span className="text-xs font-semibold text-ink md:text-[13px]">{lane.label}</span>
            <div className="grid grid-cols-[repeat(32,minmax(0,1fr))] gap-0.5 md:gap-[3px]">
              {Array.from({ length: FEATURED_STEPS }, (_, i) => {
                const on = lane.steps.includes(i);
                const here = i === step;
                return (
                  <span
                    key={i}
                    className={`block h-4 rounded-[2px] transition-transform duration-75 md:h-[22px] md:rounded-[3px] ${
                      i === 16 ? "ml-[3px] md:ml-1" : ""
                    } ${
                      on && here
                        ? "motion-safe:scale-y-[1.15] motion-safe:shadow-[0_0_0_2px_var(--color-card),0_0_12px_var(--lane)]"
                        : ""
                    } ${
                      on ? "" : here ? "bg-[#d9ccb6]" : i % 4 === 0 ? "bg-[#e9dfcf]" : "bg-canvas"
                    } ${failed && on ? "opacity-40" : ""}`}
                    style={on ? ({ background: lane.color, "--lane": lane.color } as CSSProperties) : undefined}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="hidden grid-cols-[52px_minmax(0,1fr)] gap-3 md:grid" aria-hidden>
          <span />
          <div className="grid grid-cols-2 text-xs text-muted">
            <span>Bar 1</span>
            <span>Bar 2</span>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status">
        {failed ? status : loading ? status : playing ? "Playing the featured beat" : ""}
      </p>
      {failed && (
        <div className="mt-3 md:hidden">
          <Status status={status} detail="" failed compact />
        </div>
      )}
    </div>
  );
}

function PlayButton({
  playing,
  loading,
  failed,
  label,
  onClick,
}: {
  playing: boolean;
  loading: boolean;
  failed: boolean;
  label: string;
  onClick: () => void;
}) {
  const tone = failed ? "bg-destructive" : loading ? "bg-muted" : "bg-ink hover:bg-ink/85";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={playing && !failed}
      aria-label={label}
      className={`inline-flex h-[60px] w-[60px] shrink-0 cursor-pointer items-center justify-center rounded-full text-card transition-colors md:h-16 md:w-16 ${tone}`}
    >
      {failed ? <RetryGlyph /> : loading ? <SpinnerGlyph /> : playing ? <PauseGlyph /> : <PlayGlyph />}
    </button>
  );
}

function Status({ status, detail, failed, compact }: { status: string; detail: string; failed: boolean; compact?: boolean }) {
  if (compact && !failed) return null;
  return (
    <div className="flex flex-col gap-0.5" aria-hidden>
      <span className={`font-bold ${compact ? "text-sm" : "text-base"} ${failed ? "text-destructive" : "text-ink"}`}>{status}</span>
      {detail && <span className="text-[13px] tabular-nums text-muted">{detail}</span>}
    </div>
  );
}
