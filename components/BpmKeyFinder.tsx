"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { TrackedLink } from "@/components/TrackedLink";
import type { AnalysisResult } from "@/lib/bpm-key/analyze";
import { MAX_DURATION_SECONDS, MAX_UPLOAD_BYTES, MIN_DURATION_SECONDS } from "@/lib/bpm-key/limits";
import { suggestFor } from "@/lib/bpm-key/suggest";
import { event } from "@/lib/gtag";

const AUDIO_NAME = /\.(mp3|wav|wave|ogg|oga|flac|aac|m4a|mp4|aiff|aif|webm|opus|caf)$/i;
const MIDI_NAME = /\.(mid|midi)$/i;

type Status =
  | { state: "idle" }
  | { state: "working"; ratio: number; stage: string; fileName: string }
  | { state: "done"; result: AnalysisResult; fileName: string }
  | { state: "error"; message: string; fileName: string };

function rejectReason(file: File): string | null {
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files need to be under 100 MB. Export a shorter clip and try again.";
  if (MIDI_NAME.test(file.name) || file.type === "audio/midi" || file.type === "audio/x-midi") {
    return "MIDI files have notes, not audio. Export MP3 or WAV from the DAW and drop that.";
  }
  if (file.type.startsWith("audio/") || AUDIO_NAME.test(file.name)) return null;
  if (!file.type || file.type === "application/octet-stream") return null;
  return "That isn't an audio file this page can read. Use MP3, WAV, FLAC, OGG, or M4A.";
}

function messageFor(err: unknown): string {
  const code = typeof err === "object" && err && "code" in err ? (err as { code: unknown }).code : null;
  if (code === "short") return "That clip is too short. Use at least a couple of seconds of music.";
  if (code === "silent") return "That file is silent, so there's nothing to measure.";
  if (err instanceof DOMException || (err instanceof Error && /decode|encoding/i.test(err.message))) {
    return "This file couldn't be decoded. Use MP3, WAV, FLAC, OGG, or M4A.";
  }
  return "Something went wrong while reading that file. Try MP3, WAV, FLAC, or M4A.";
}

function mixDown(buffer: AudioBuffer): Float32Array {
  const length = buffer.length;
  const channels = buffer.numberOfChannels;
  const mono = new Float32Array(length);
  for (let channel = 0; channel < channels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) mono[i] += data[i];
  }
  if (channels > 1) {
    const scale = 1 / channels;
    for (let i = 0; i < length; i++) mono[i] *= scale;
  }
  return mono;
}

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remain = total % 60;
  if (minutes === 0) return `${remain}s`;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8 text-muted">
      <path
        d="M12 16V5M8 8.5 12 4.5 16 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 16.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BpmKeyFinder() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const dragDepth = useRef(0);
  const [hot, setHot] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  useEffect(() => {
    const stop = (event: DragEvent) => event.preventDefault();
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
    };
  }, []);

  const analyze = async (file: File) => {
    const problem = rejectReason(file);
    if (problem) {
      setStatus({ state: "error", message: problem, fileName: file.name });
      return;
    }

    const id = ++request.current;
    setStatus({ state: "working", ratio: 0.04, stage: "Reading the file", fileName: file.name });

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      setStatus({
        state: "error",
        message: "This browser can't decode audio. Try Chrome, Firefox, or Safari.",
        fileName: file.name,
      });
      return;
    }

    const ctx = new AudioCtx();
    try {
      const raw = await file.arrayBuffer();
      if (request.current !== id) return;
      setStatus({ state: "working", ratio: 0.12, stage: "Decoding audio", fileName: file.name });
      const audio = await ctx.decodeAudioData(raw.slice(0));
      if (request.current !== id) return;
      if (audio.duration > MAX_DURATION_SECONDS) {
        setStatus({
          state: "error",
          message: "That file is longer than 8 minutes. Trim it to the section you care about and try again.",
          fileName: file.name,
        });
        return;
      }
      if (audio.duration < MIN_DURATION_SECONDS) {
        setStatus({
          state: "error",
          message: "That clip is too short. Use at least a couple of seconds of music.",
          fileName: file.name,
        });
        return;
      }

      const mono = mixDown(audio);
      const { analyzePcm } = await import("@/lib/bpm-key/analyze");
      if (request.current !== id) return;
      const result = await analyzePcm(mono, audio.sampleRate, (progress) => {
        if (request.current !== id) return;
        setStatus({
          state: "working",
          ratio: progress.ratio,
          stage: progress.stage === "tempo" ? "Finding the tempo" : "Finding the key",
          fileName: file.name,
        });
      });
      if (request.current !== id) return;
      setStatus({ state: "done", result, fileName: file.name });
      event({
        action: "analyze_bpm_key",
        category: "bpm_key_finder",
        label: `${Math.round(result.bpm)} ${result.key.name}`,
      });
    } catch (err) {
      if (request.current !== id) return;
      setStatus({ state: "error", message: messageFor(err), fileName: file.name });
    } finally {
      await ctx.close().catch(() => undefined);
    }
  };

  const takeFile = (file: File | undefined) => {
    if (inputRef.current) inputRef.current.value = "";
    if (file) void analyze(file);
  };

  const working = status.state === "working";
  const percent = working ? Math.max(4, Math.min(100, Math.round(status.ratio * 100))) : 0;

  return (
    <div className="mt-8">
      <div
        onDragEnter={(drag) => {
          drag.preventDefault();
          dragDepth.current += 1;
          setHot(true);
        }}
        onDragOver={(drag) => {
          drag.preventDefault();
          drag.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(drag) => {
          drag.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setHot(false);
          }
        }}
        onDrop={(drag) => {
          drag.preventDefault();
          dragDepth.current = 0;
          setHot(false);
          takeFile(drag.dataTransfer.files[0]);
        }}
        className={`rounded-md border bg-card px-5 py-8 transition-colors md:px-8 md:py-10 ${
          hot ? "border-primary bg-primary/10" : "border-line"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <UploadIcon />
          <p className="mt-4 text-lg font-semibold">
            {working ? status.stage : "Drop an audio file here"}
          </p>
          <p className="mt-1 max-w-md text-sm text-muted">
            {working
              ? status.fileName
              : "MP3, WAV, FLAC, OGG, or M4A. Analysis runs on this device. The file is never uploaded."}
          </p>

          {working && (
            <div className="mt-5 w-full max-w-md">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={status.stage}
                className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.06]"
              >
                <div
                  className="h-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold tabular-nums text-muted">{percent}%</p>
            </div>
          )}

          <label
            htmlFor={inputId}
            className={`mt-5 inline-flex h-11 cursor-pointer items-center rounded-key px-4 text-sm font-semibold ${
              working
                ? "pointer-events-none border border-strong text-muted"
                : "bg-primary text-on-brand hover:bg-primary-hover"
            }`}
          >
            {working ? "Analyzing…" : status.state === "done" || status.state === "error" ? "Choose another file" : "Choose an audio file"}
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="audio/*,.mp3,.wav,.flac,.ogg,.m4a,.aac,.aiff,.webm"
              disabled={working}
              className="sr-only"
              onChange={(change) => takeFile(change.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      {status.state === "error" && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {status.message}
        </p>
      )}

      {status.state === "done" && <Result result={status.result} fileName={status.fileName} />}
    </div>
  );
}

function Result({ result, fileName }: { result: AnalysisResult; fileName: string }) {
  const bpm = Math.round(result.bpm);
  const suggestion = result.steady
    ? suggestFor({
        bpm: result.bpm,
        mode: result.key.mode,
        tonic: result.key.tonic,
        alternateBpm: result.alternateBpm,
      })
    : null;
  const alternate = result.alternateBpm === null || !result.steady ? null : Math.round(result.alternateBpm);

  return (
    <div aria-live="polite" className="mt-6">
      <p className="text-sm text-muted">
        <span className="text-ink">{fileName}</span>
        <span aria-hidden> · </span>
        {formatDuration(result.duration)} analyzed
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-line bg-card p-5">
          <p className="text-sm font-semibold text-muted">Tempo</p>
          <p className="font-wide mt-2 text-5xl tracking-tight text-ink md:text-6xl">
            {result.steady ? (
              <>
                {bpm}
                <span className="ml-2 text-xl font-semibold text-muted md:text-2xl">BPM</span>
              </>
            ) : (
              <span className="text-3xl md:text-4xl">No steady beat</span>
            )}
          </p>
          <p className="mt-3 text-sm text-muted">
            {result.steady ? result.bpmLabel : "Hits in this clip don't repeat on a grid."}
          </p>
          {alternate !== null && result.alternateKind && (
            <p className="mt-2 text-sm text-muted">
              Also lines up at {alternate} BPM ({result.alternateKind}).
            </p>
          )}
        </div>
        <div className="rounded-md border border-line bg-card p-5">
          <p className="text-sm font-semibold text-muted">Key</p>
          <p className="mt-2 text-5xl font-black tracking-tight text-ink md:text-6xl">
            {result.key.tonic}{" "}
            <span className="text-xl font-semibold text-muted md:text-2xl">{result.key.mode}</span>
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="inline-flex h-7 items-center rounded-key border border-strong px-2 font-semibold text-ink">
              Camelot {result.key.camelot}
            </span>
            <span>{result.key.label}</span>
          </p>
        </div>
      </div>

      {suggestion ? (
        <aside className="mt-4 rounded-md border border-line bg-canvas p-5 md:p-6">
          <h2 className="text-xl md:text-2xl">Drums that sit in this pocket</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{suggestion.blurb}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TrackedLink
              href={suggestion.kit.href}
              track={{ action: "click_bpm_key_kit", category: "bpm_key_finder", label: suggestion.kit.slug }}
              className="inline-flex h-11 items-center justify-center rounded-key bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand-hover"
            >
              {suggestion.cta}
            </TrackedLink>
            <TrackedLink
              href={suggestion.band.href}
              track={{ action: "click_bpm_key_tempo", category: "bpm_key_finder", label: suggestion.band.slug }}
              className="inline-flex h-11 items-center justify-center rounded-key border border-strong px-4 text-sm font-semibold text-ink hover:bg-foreground/[0.06]"
            >
              Patterns at {suggestion.band.label}
            </TrackedLink>
          </div>
          {suggestion.doubledBand && (
            <p className="mt-4 text-sm text-muted">
              <Link href={suggestion.doubledBand.href} className="font-semibold text-ink underline underline-offset-4">
                Patterns at {suggestion.doubledBand.label}
              </Link>{" "}
              match the double-time grid.
            </p>
          )}
          <p className="mt-4 text-sm text-muted">
            Or sketch the drums yourself in the{" "}
            <Link href="/beat-maker" className="font-semibold text-ink underline underline-offset-4">
              free beat maker
            </Link>
            .
          </p>
        </aside>
      ) : (
        <aside className="mt-4 rounded-md border border-line bg-canvas p-5 md:p-6">
          <h2 className="text-xl md:text-2xl">The key is {result.key.name}</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            There isn&apos;t a drum grid to match, so set the tempo yourself and write to {result.key.camelot}. The kits
            below are built for trap and drill in that kind of harmony.
          </p>
          <div className="mt-5">
            <TrackedLink
              href="/kits"
              track={{ action: "click_bpm_key_kits", category: "bpm_key_finder", label: result.key.name }}
              className="inline-flex h-11 items-center justify-center rounded-key bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand-hover"
            >
              See the MIDI drum kits
            </TrackedLink>
          </div>
        </aside>
      )}
    </div>
  );
}
