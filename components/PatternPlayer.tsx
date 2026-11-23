"use client";

import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { MidiLane } from "@/components/MidiLane";
import { useMidiPlayer } from "@/components/useMidiPlayer";

type PlayablePattern = {
  id: string;
  title: string;
  bpm: number;
  duration: number;
  peaks: number[];
};

/** In-browser preview. The MIDI file itself stays behind the credit download. */
export function PatternPlayer({ pattern }: { pattern: PlayablePattern }) {
  const { playingId, progress, toggle } = useMidiPlayer();
  const active = playingId === pattern.id;

  return (
    <div className={`rounded-md border bg-card p-4 ${active ? "border-brand" : "border-line"}`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => void toggle(pattern)}
          aria-label={`${active ? "Stop" : "Play"} ${pattern.title}`}
          aria-pressed={active}
          className={`grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full transition-colors [&_svg]:h-5 [&_svg]:w-5 ${
            active ? "bg-brand text-on-brand" : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          {active ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Preview</p>
          <p className="text-xs text-muted">Played with the kit drum samples. The MIDI file is a separate download.</p>
          <div className="mt-2">
            <MidiLane pattern={pattern} progress={active ? progress : 0} active={active} />
          </div>
        </div>
      </div>
    </div>
  );
}
