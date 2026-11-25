"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { useMidiPlayer } from "@/components/useMidiPlayer";
import { wavePath, type CatalogTrack } from "@/lib/tracks";

type PlayerApi = {
  currentId: string | null;
  playingId: string | null;
  queue: CatalogTrack[];
  play: (track: CatalogTrack, queue?: CatalogTrack[]) => void;
  next: () => void;
  prev: () => void;
};

const PlayerContext = createContext<PlayerApi | null>(null);

const progressListeners = new Set<(value: number) => void>();

export function subscribeProgress(listener: (value: number) => void) {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

export function usePlayer() {
  const api = useContext(PlayerContext);
  if (!api) throw new Error("usePlayer must be used inside PlayerProvider");
  return api;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const midi = useMidiPlayer();
  const toggleRef = useRef(midi.toggle);
  const progressRef = useRef(0);
  useEffect(() => {
    toggleRef.current = midi.toggle;
    progressRef.current = midi.progress;
  });

  const queueRef = useRef<CatalogTrack[]>([]);
  const currentRef = useRef<string | null>(null);
  const [queue, setQueue] = useState<CatalogTrack[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const play = useCallback((track: CatalogTrack, nextQueue?: CatalogTrack[]) => {
    const list = nextQueue ?? queueRef.current;
    queueRef.current = list;
    currentRef.current = track.id;
    setQueue(list);
    setCurrentId(track.id);
    void toggleRef.current(track);
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    const list = queueRef.current;
    const index = list.findIndex((track) => track.id === currentRef.current);
    const track = list[index + direction];
    if (!track) return;
    currentRef.current = track.id;
    setCurrentId(track.id);
    void toggleRef.current(track);
  }, []);

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  useEffect(() => {
    document.documentElement.dataset.player = currentId ? "open" : "closed";
    return () => {
      delete document.documentElement.dataset.player;
    };
  }, [currentId]);

  useEffect(() => {
    if (!midi.playingId) {
      progressListeners.forEach((listener) => listener(0));
      return;
    }
    let frame = 0;
    const tick = () => {
      progressListeners.forEach((listener) => listener(progressRef.current));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [midi.playingId]);

  const api = useMemo<PlayerApi>(
    () => ({ currentId, playingId: midi.playingId, queue, play, next, prev }),
    [currentId, midi.playingId, queue, play, next, prev],
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}

export function WaveformSvg({
  code,
  active,
  className = "",
}: {
  code: string;
  active: boolean;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!active) return;
    const unsubscribe = subscribeProgress(setProgress);
    return () => {
      unsubscribe();
    };
  }, [active]);
  const path = wavePath(code);
  const played = active ? progress : 0;
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden className={className}>
      <path d={path} className="text-chart-rest" fill="currentColor" />
      <g style={{ clipPath: `inset(0 ${((1 - played) * 100).toFixed(2)}% 0 0)` }}>
        <path d={path} className="text-brand" fill="currentColor" />
      </g>
    </svg>
  );
}

function TransportButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-white/10 disabled:cursor-default disabled:text-muted/40 [&_svg]:h-4 [&_svg]:w-4"
    >
      {children}
    </button>
  );
}

export function MiniPlayer() {
  const { currentId, playingId, queue, play, next, prev } = usePlayer();
  const track = queue.find((item) => item.id === currentId);
  if (!track) return null;
  const playing = playingId === track.id;
  const index = queue.findIndex((item) => item.id === track.id);

  return (
    <div className="mini-player fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#0b1222]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 md:gap-3 md:px-5">
        <TransportButton label="Previous pattern" disabled={index <= 0} onClick={prev}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 5h2v14H6zM19 6.5 9 12l10 5.5z" />
          </svg>
        </TransportButton>
        <button
          type="button"
          onClick={() => play(track)}
          aria-label={`${playing ? "Stop" : "Play"} ${track.title}`}
          aria-pressed={playing}
          className={`grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full [&_svg]:h-4 [&_svg]:w-4 ${
            playing ? "bg-brand text-on-brand" : "bg-foreground text-background"
          }`}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <TransportButton label="Next pattern" disabled={index < 0 || index >= queue.length - 1} onClick={next}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16 5h2v14h-2zM5 6.5 15 12 5 17.5z" />
          </svg>
        </TransportButton>
        <div className="min-w-0 flex-1">
          <Link href={track.path} className="block truncate text-sm font-medium hover:underline">
            {track.title}
          </Link>
          <p className="truncate text-xs text-muted">
            <span className="font-wide text-xs">{track.bpm} BPM</span>
            <span> · {track.kitName}</span>
          </p>
        </div>
        <div className="hidden w-40 sm:block md:w-56">
          <WaveformSvg code={track.wave} active={playing} className="h-7 w-full" />
        </div>
      </div>
    </div>
  );
}
