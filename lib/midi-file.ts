import type { DrumPart, GeneratedPattern } from "@/lib/midi-generator";

/**
 * Writes a generated pattern as a Standard MIDI File.
 *
 * Every part is written at C5 (note 60) plus its pitch offset, like the kits
 * in the bundle: dropped on a sampler channel, it plays the producer's own
 * sample at its own pitch, and 808s land in key. A full beat becomes one
 * track per part, which DAWs split onto separate channels on import.
 */

const PPQ = 96;
const ROOT = 60;

const TRACK_NAMES: Record<DrumPart, string> = {
  kick: "Kick",
  snare: "Snare",
  hihat: "Hi-Hat",
  "open-hat": "Open Hat",
  "808": "808",
};

const vlq = (n: number) => {
  const bytes = [n & 0x7f];
  while ((n >>= 7)) bytes.unshift((n & 0x7f) | 0x80);
  return bytes;
};

const text = (s: string) => [...new TextEncoder().encode(s)];

function chunk(type: string, body: number[]) {
  const len = body.length;
  return [...text(type), (len >>> 24) & 255, (len >>> 16) & 255, (len >>> 8) & 255, len & 255, ...body];
}

/** Events as [tick, order, bytes]; note-offs sort before note-ons at the same tick. */
type Event = [number, number, number[]];

function trackChunk(name: string, events: Event[]) {
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const body = [0, 0xff, 0x03, ...vlq(text(name).length), ...text(name)];
  let last = 0;
  for (const [tick, , bytes] of events) {
    body.push(...vlq(tick - last), ...bytes);
    last = tick;
  }
  body.push(0, 0xff, 0x2f, 0);
  return chunk("MTrk", body);
}

export function patternToMidi(pattern: GeneratedPattern): Uint8Array {
  const tempo = Math.round(60_000_000 / pattern.bpm);
  const conductor: Event[] = [
    [0, 0, [0xff, 0x51, 3, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255]],
    [0, 0, [0xff, 0x58, 4, 4, 2, 24, 8]],
  ];
  const tracks = pattern.tracks.map((track) => {
    const events: Event[] = [];
    for (const n of track.notes) {
      const note = Math.max(0, Math.min(127, ROOT + n.pitch));
      const on = Math.round(n.beat * PPQ);
      const off = Math.max(on + 1, Math.round((n.beat + n.dur) * PPQ));
      events.push([on, 1, [0x90, note, n.vel]], [off, 0, [0x80, note, 0]]);
    }
    return trackChunk(TRACK_NAMES[track.part], events);
  });

  const header = chunk("MThd", [0, 1, 0, tracks.length + 1, (PPQ >> 8) & 255, PPQ & 255]);
  return new Uint8Array([...header, ...trackChunk("MidiRoad", conductor), ...tracks.flat()]);
}

export function midiFileName(pattern: GeneratedPattern, index: number) {
  const kind = { hihat: "hihat", "808": "808", kick: "kick", beat: "beat" }[pattern.kind];
  const key = pattern.kind === "808" || pattern.kind === "beat" ? `-${["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"][pattern.key]}min` : "";
  return `midiroad-${kind}-${pattern.bpm}bpm${key}-${index + 1}.mid`;
}

export function downloadMidi(pattern: GeneratedPattern, index: number) {
  const blob = new Blob([patternToMidi(pattern) as BlobPart], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = midiFileName(pattern, index);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
