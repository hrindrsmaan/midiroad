"use client";

import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { WaveformSvg, usePlayer } from "@/components/player/Player";
import type { CatalogTrack } from "@/lib/tracks";

/** Large preview on a pattern page. Transport also drives the bottom mini-player. */
export function PatternStage({
  track,
  queue,
  detailWave,
}: {
  track: CatalogTrack;
  queue: CatalogTrack[];
  detailWave: string;
}) {
  const player = usePlayer();
  const playing = player.playingId === track.id;
  return (
    <div className={`rounded-md border bg-card p-4 md:p-6 ${playing ? "border-brand" : "border-line"}`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => player.play(track, queue)}
          aria-label={`${playing ? "Stop" : "Play"} ${track.title}`}
          aria-pressed={playing}
          className={`grid h-14 w-14 shrink-0 cursor-pointer place-items-center rounded-full [&_svg]:h-5 [&_svg]:w-5 ${
            playing ? "bg-brand text-on-brand" : "bg-foreground text-background"
          }`}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Preview</p>
          <p className="text-xs text-muted">Played with the kit drum samples. The MIDI file is a separate download.</p>
        </div>
      </div>
      <div className="mt-4">
        <WaveformSvg code={detailWave} active={playing} className="h-16 w-full md:h-24" />
      </div>
    </div>
  );
}
