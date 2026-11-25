"use client";

import { useEffect, useRef } from "react";

const BAR_WIDTH = 2;
const BAR_GAP = 2;
const WAVE_HEIGHT = 28;
const PLAY_EVENT = "midiroad:play";

/** Announces that `owner` started playing, so every other player stops. */
export function claimPlayback(owner: object) {
  window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: owner }));
}

/** Calls `stop` whenever a player other than `owner` starts. */
export function useStopOnOtherPlayback(owner: object, stop: () => void) {
  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  });
  useEffect(() => {
    const onPlay = (e: Event) => {
      if ((e as CustomEvent).detail !== owner) stopRef.current();
    };
    window.addEventListener(PLAY_EVENT, onPlay);
    return () => window.removeEventListener(PLAY_EVENT, onPlay);
  }, [owner]);
}

export type WaveformProps = {
  peaks: number[];
  /** Playback position, 0–1. Bars before it are highlighted. */
  progress: number;
  /** Height in px. Defaults to WAVE_HEIGHT. */
  height?: number;
  /** Stretch to the container's width instead of a fixed bar width. */
  fluid?: boolean;
  /** Bar colors, unplayed and played. */
  color?: string;
  playedColor?: string;
};

export function Waveform({
  peaks,
  progress,
  height = WAVE_HEIGHT,
  fluid = false,
  color = "#6b6b76",
  playedColor = "#c6ff3d",
}: WaveformProps) {
  const width = peaks.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
  const played = progress * peaks.length;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={fluid ? "100%" : width}
      height={height}
      preserveAspectRatio={fluid ? "none" : undefined}
      className={fluid ? "min-w-0 flex-1" : "shrink-0"}
    >
      {peaks.map((peak, i) => {
        const h = Math.max(1, peak * height);
        return (
          <rect
            key={i}
            x={i * (BAR_WIDTH + BAR_GAP)}
            y={(height - h) / 2}
            width={BAR_WIDTH}
            height={h}
            rx={1}
            fill={i < played ? playedColor : color}
          />
        );
      })}
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden>
      <path d="M6 3.5v17l14-8.5L6 3.5Z" />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden>
      <path d="M6 4h4v16H6V4Zm8 0h4v16h-4V4Z" />
    </svg>
  );
}
