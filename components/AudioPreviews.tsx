"use client";

import { useEffect, useRef, useState } from "react";
import {
  MIDI_PREVIEWS,
  ONE_SHOT_PREVIEWS,
  previewPeaks,
  previewSrc,
  type Preview,
} from "@/lib/previews";

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
};

export function Waveform({
  peaks,
  progress,
  height = WAVE_HEIGHT,
}: WaveformProps) {
  const width = peaks.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
  const played = progress * peaks.length;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="shrink-0"
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
            fill={i < played ? "#2bd96b" : "#9ca3af"}
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

export function AudioPreviews() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number>(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const stop = () => {
    cancelAnimationFrame(frameRef.current);
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingId(null);
    setProgress(0);
  };

  // Only one player on the page sounds at a time.
  useStopOnOtherPlayback(audioRef, stop);

  // Stop playback if the section unmounts mid-sample.
  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
      audioRef.current?.pause();
    },
    [],
  );

  const toggle = (preview: Preview) => {
    const wasPlaying = playingId === preview.id;
    stop();
    if (wasPlaying) return;
    claimPlayback(audioRef);

    const audio = new Audio(previewSrc(preview.id));
    audioRef.current = audio;
    setPlayingId(preview.id);

    const tick = () => {
      if (audioRef.current !== audio) return;
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
      frameRef.current = requestAnimationFrame(tick);
    };
    audio.onended = () => {
      if (audioRef.current === audio) stop();
    };
    audio.play().then(tick, () => {
      if (audioRef.current === audio) stop();
    });
  };

  const renderGroup = (title: string, previews: Preview[]) => (
    <div>
      <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-gray-500">
        {title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        {previews.map((preview) => {
          const active = playingId === preview.id;
          return (
            <div key={preview.id} className="min-w-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggle(preview)}
                  aria-label={`${active ? "Stop" : "Play"} ${preview.label}`}
                  aria-pressed={active}
                  className={`shrink-0 transition-colors cursor-pointer hover:text-[#2bd96b] ${active ? "text-[#2bd96b]" : "text-white"}`}
                >
                  {active ? <PauseIcon /> : <PlayIcon />}
                </button>
                <Waveform
                  peaks={previewPeaks(preview.id)}
                  progress={active ? progress : 0}
                />
              </div>
              <p className="mt-2 pl-10 text-sm font-light tracking-wider text-gray-300">
                {preview.label}
                {preview.detail && (
                  <span className="block text-xs text-gray-500">
                    {preview.detail}
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderGroup("Full MIDI groove — played with the kit's drums", MIDI_PREVIEWS)}
      {renderGroup("One-shot samples", ONE_SHOT_PREVIEWS)}
    </div>
  );
}

export default AudioPreviews;
