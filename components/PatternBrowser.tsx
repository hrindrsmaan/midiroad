"use client";

import Link from "next/link";
import { PauseIcon, PlayIcon } from "@/components/AudioPreviews";
import { MidiLane } from "@/components/MidiLane";
import { useMidiPlayer } from "@/components/useMidiPlayer";

export type PatternCard = {
  id: string;
  path: string;
  title: string;
  bpm: number;
  timeSignature: string | null;
  partLabel: string;
  duration: number;
  peaks: number[];
};

export type PatternGroup = { id: string; label: string; patterns: PatternCard[] };

/** Listing cards: a real link to the pattern page, plus the same in-browser preview. */
export function PatternBrowser({ groups }: { groups: PatternGroup[] }) {
  const { playingId, progress, toggle } = useMidiPlayer();

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`part-${group.id}`}>
          <h2 id={`part-${group.id}`} className="text-2xl md:text-[32px]">
            {group.label}
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.patterns.map((pattern) => {
              const active = playingId === pattern.id;
              return (
                <li
                  key={pattern.id}
                  className={`rounded-md border bg-card p-4 ${active ? "border-brand" : "border-line"}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => void toggle(pattern)}
                      aria-label={`${active ? "Stop" : "Play"} ${pattern.title}`}
                      aria-pressed={active}
                      className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors [&_svg]:h-4 [&_svg]:w-4 ${
                        active ? "bg-brand text-on-brand" : "bg-primary text-on-brand hover:bg-primary-hover"
                      }`}
                    >
                      {active ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <Link href={pattern.path} className="text-[15px] font-medium hover:underline">
                        {pattern.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        <span className="font-wide text-xs">{pattern.bpm} BPM</span>
                        {pattern.timeSignature ? ` · ${pattern.timeSignature}` : ""} · {pattern.partLabel}
                      </p>
                      <div className="mt-2">
                        <MidiLane pattern={pattern} progress={active ? progress : 0} active={active} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
