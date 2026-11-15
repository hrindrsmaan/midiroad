#!/usr/bin/env python3
"""
Render the audio previews shown in the product section.

Reads samples and MIDI patterns straight out of private/midiroad.zip and writes:
  - public/previews/<id>.mp3   one-shots and MIDI patterns played with kit samples
  - lib/preview-peaks.json     normalized waveform buckets per preview
  - public/previews/samples/<sample>.mp3   kit one-shots the browser plays MIDI kits with
  - public/previews/midi-notes.json       scheduled hits for every MIDI kit pattern
  - lib/midi-kits.json                    MIDI kit listing (names, tempo, length, peaks)
  - lib/bundle-contents.json              one-shot counts per category, for the page copy

Requires numpy and ffmpeg. Run from the repo root:
  python3 scripts/render-previews.py
"""
import json
import re
import struct
import subprocess
import zipfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ZIP = ROOT / "private" / "midiroad.zip"
OUT = ROOT / "public" / "previews"
PEAKS_JSON = ROOT / "lib" / "preview-peaks.json"

SR = 44100
BUCKETS = 44
BARS = 4  # bars of each MIDI pattern to render
ROOT_NOTE = 60  # MIDI note that plays a sample at its original pitch
TAIL = 0.4  # seconds of ring-out after the last bar

KIT = "MIDIROAD/DRUM KITS/ANAMOLY TRAP DRUM KIT/"
MIDI = "MIDIROAD/MIDI KITS/"

SAMPLES = {
    "kick": KIT + "Kick/Vice City (Kick).wav",
    "snare": KIT + "Snare/Toronto (Snare).wav",
    "hihat": KIT + "HH/Heist (HH).wav",
    "open-hat": KIT + "OH/Black Mirror (OH).wav",
    "808": KIT + "808/Holy Grail (808).wav",
}

# Mix level per sample when layered in a pattern.
GAIN = {"kick": 1.0, "snare": 0.8, "hihat": 0.45, "open-hat": 0.4, "808": 0.85}

# id -> (bpm override or None, [(sample, midi path)])
PATTERNS = {
    "midi-groove": (
        133,
        [
            ("kick", MIDI + "Psycho (Midi Drum Kit)/Kick/Kick1.mid"),
            ("snare", MIDI + "Psycho (Midi Drum Kit)/Snare/Snare1.mid"),
            ("hihat", MIDI + "Psycho (Midi Drum Kit)/HH/hh (1).mid"),
            ("open-hat", MIDI + "Psycho (Midi Drum Kit)/OH/Open Hat1.mid"),
            ("808", MIDI + "Psycho (Midi Drum Kit)/808/808 (1).mid"),
        ],
    ),
}

ONE_SHOTS = ["open-hat", "snare", "hihat", "kick"]

SAMPLES_OUT = OUT / "samples"
NOTES_JSON = OUT / "midi-notes.json"
KITS_JSON = ROOT / "lib" / "midi-kits.json"
CONTENTS_JSON = ROOT / "lib" / "bundle-contents.json"
DRUM_KIT_NAME = "Anamoly Trap Drum Kit"

# Drum kit folder -> label, in display order.
ONE_SHOT_FOLDERS = {
    "808": "808s",
    "Kick": "Kicks",
    "Snare": "Snares",
    "Clap": "Claps",
    "HH": "Hi-Hats",
    "OH": "Open Hats",
    "Rim": "Rims",
    "Perc": "Percussion",
}

# Kit name -> {folder under MIDI: part}. Parts map to SAMPLES keys.
MIDI_KITS = {
    "Psycho": {
        "Psycho (Midi Drum Kit)/Kick": "kick",
        "Psycho (Midi Drum Kit)/Snare": "snare",
        "Psycho (Midi Drum Kit)/HH": "hihat",
        "Psycho (Midi Drum Kit)/OH": "open-hat",
        "Psycho (Midi Drum Kit)/808": "808",
    },
    "Odyssey": {
        "ODYSSEY MIDI DRUM KIT/Snares": "snare",
        "ODYSSEY MIDI DRUM KIT/Hi-Hats": "hihat",
        "ODYSSEY MIDI DRUM KIT/OH": "open-hat",
        "ODYSSEY MIDI DRUM KIT/808": "808",
    },
    "Decoy": {
        "DECOY (MIDI KIT)/SNR": "snare",
        "DECOY (MIDI KIT)/HH": "hihat",
        "DECOY (MIDI KIT)/808": "808",
    },
    "Black Market": {
        "BLACK-MARKET-Premium-MIDI-Kit/Kick": "kick",
        "BLACK-MARKET-Premium-MIDI-Kit/Hi Hat": "hihat",
        "BLACK-MARKET-Premium-MIDI-Kit/Open Hat": "open-hat",
        "BLACK-MARKET-Premium-MIDI-Kit/808": "808",
    },
    "Focus": {"FOCUS (808 MIDI KIT)": "808"},
    "Essentials": {
        "KICK": "kick",
        "Snare": "snare",
        "Hi-Hats": "hihat",
        "OPEN-HATS": "open-hat",
        "808": "808",
    },
}

# part -> (tab label, name for numbered patterns)
PARTS = {
    "kick": ("Kicks", "Kick"),
    "snare": ("Snares", "Snare"),
    "hihat": ("Hi-Hats", "Hi-Hat"),
    "open-hat": ("Open Hats", "Open Hat"),
    "808": ("808s", "808"),
}

# Filename words that carry no name of their own, e.g. "C - 808 - FOCUS (3)".
GENERIC = {"808", "x", "c", "focus", "hh", "hi", "hats", "kick", "oh", "open", "hat", "snare", "snr"}


def decode(data: bytes) -> np.ndarray:
    """Decode audio bytes to float32 stereo at SR."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", "pipe:0", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        input=data, capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def encode(audio: np.ndarray, path: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "pipe:0",
         "-codec:a", "libmp3lame", "-b:a", "128k", str(path)],
        input=audio.astype(np.float32).tobytes(), check=True,
    )


def parse_midi(data: bytes):
    """Minimal SMF reader -> (bpm, [(start_beats, dur_beats, note, velocity)])."""
    assert data[:4] == b"MThd"
    _, ntracks, ppq = struct.unpack(">HHH", data[8:14])
    pos, bpm, notes = 14, 120.0, []
    for _ in range(ntracks):
        length = struct.unpack(">I", data[pos + 4:pos + 8])[0]
        t = data[pos + 8:pos + 8 + length]
        pos += 8 + length
        i = tick = status = 0
        held = {}

        def vlq():
            nonlocal i
            v = 0
            while True:
                b = t[i]
                i += 1
                v = (v << 7) | (b & 0x7F)
                if not b & 0x80:
                    return v

        while i < len(t):
            tick += vlq()
            if t[i] & 0x80:
                status = t[i]
                i += 1
            if status == 0xFF:
                kind = t[i]
                i += 1
                n = vlq()
                if kind == 0x51:
                    bpm = 60_000_000 / int.from_bytes(t[i:i + n], "big")
                i += n
            elif status in (0xF0, 0xF7):
                i += vlq()
            else:
                kind = status & 0xF0
                n = 1 if kind in (0xC0, 0xD0) else 2
                a = t[i:i + n]
                i += n
                if kind == 0x90 and a[1] > 0:
                    held[a[0]] = (tick, a[1])
                elif kind in (0x80, 0x90) and a[0] in held:
                    start, vel = held.pop(a[0])
                    notes.append((start / ppq, (tick - start) / ppq, a[0], vel))
    return bpm, sorted(notes)


def repitch(sample: np.ndarray, semitones: int) -> np.ndarray:
    if semitones == 0:
        return sample
    ratio = 2 ** (semitones / 12)
    x = np.arange(0, len(sample) - 1, ratio)
    idx = np.arange(len(sample))
    return np.stack([np.interp(x, idx, sample[:, c]) for c in range(2)], axis=1)


def pattern_hits(name, notes, beats, root):
    """MIDI notes -> [(start_beats, semitones, gain, cut_beats or None)].

    `root` is the note that plays the sample at its original pitch.
    """
    notes = [n for n in notes if n[0] < beats]
    hits = []
    for k, (start, dur, note, vel) in enumerate(notes):
        cut = None
        if name == "808":
            # 808s are monophonic: hold for the note length, cut by the next note.
            end = start + dur
            if k + 1 < len(notes):
                end = min(end, notes[k + 1][0])
            cut = end - start
        hits.append((start, note - root, GAIN[name] * (vel / 127), cut))
    return hits


def mix_hits(samples, layers, bpm, beats) -> np.ndarray:
    """Render [(sample name, hits)] to audio, `beats` long plus a faded tail."""
    spb = 60 / bpm * SR  # samples per beat
    total = int(beats * spb)
    mix = np.zeros((total + SR * 3, 2))  # tail room for the last hits to ring out
    fade = int(0.01 * SR)
    for name, hits in layers:
        for start, semitones, gain, cut in hits:
            hit = repitch(samples[name], semitones) * gain
            if cut is not None:
                hit = hit[: max(fade, int(cut * spb))].copy()
                hit[-fade:] *= np.linspace(1, 0, fade)[:, None]
            at = int(start * spb)
            hit = hit[: len(mix) - at]
            mix[at:at + len(hit)] += hit
    # Trim to the pattern length plus a short tail, fading the tail out.
    tail = int(TAIL * SR)
    mix = mix[: total + tail]
    mix[-tail:] *= np.linspace(1, 0, tail)[:, None]
    return mix


def render_pattern(zf, samples, bpm_override, layers) -> np.ndarray:
    beats = BARS * 4
    bpm = bpm_override or parse_midi(zf.read(layers[0][1]))[0]
    return mix_hits(
        samples,
        [(name, pattern_hits(name, parse_midi(zf.read(path))[1], beats, ROOT_NOTE))
         for name, path in layers],
        bpm,
        beats,
    )


def normalize(audio: np.ndarray) -> np.ndarray:
    peak = np.abs(audio).max() or 1.0
    return audio / peak * 0.89  # -1 dBFS


def peaks(audio: np.ndarray) -> list[float]:
    mono = np.abs(audio).max(axis=1)
    chunks = np.array_split(mono, BUCKETS)
    p = np.array([c.max() if len(c) else 0 for c in chunks])
    return [round(float(v), 2) for v in p / (p.max() or 1)]


def pattern_name(stem: str) -> str | None:
    """'RB - HH - Hustle' -> 'Hustle'; None for numbered files like 'C - 808 - FOCUS (3)'."""
    stem = re.sub(r"\(?\s*\d+\s*-?\s*\d*\s*BPM\s*\)?", "", stem, flags=re.I)
    stem = re.sub(r"^(RB - HH - |Racks - )|\s*HH Midi$", "", stem).strip()
    words = re.findall(r"[A-Za-z]+|\d+", stem)
    named = [w for w in words if w.lower() not in GENERIC and not w.isdigit()]
    if not named:
        return None
    return " ".join(w.title() if w.isupper() and len(w) > 3 else w for w in stem.split())


def natural_key(name: str):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def render_midi_kits(zf, samples) -> None:
    """Write the MIDI kit listing, its waveforms, and the hits the browser plays."""
    SAMPLES_OUT.mkdir(parents=True, exist_ok=True)
    for name, audio in samples.items():
        encode(audio, SAMPLES_OUT / f"{name}.mp3")

    kits, notes_out = [], {}
    for kit_name, folders in MIDI_KITS.items():
        parts = []
        for folder, part in folders.items():
            prefix = f"{MIDI}{folder}/"
            paths = [
                p for p in zf.namelist()
                if p.startswith(prefix) and "/" not in p[len(prefix):]
                and p.lower().endswith(".mid") and "/._" not in p
            ]
            patterns = []
            # Named patterns alphabetically, numbered ones in file order.
            paths.sort(key=lambda p: natural_key(pattern_name(Path(p).stem) or Path(p).stem))
            for path in paths:
                bpm, notes = parse_midi(zf.read(path))
                if not notes:
                    continue
                # Up to BARS bars, rounded up to whole bars.
                beats = min(BARS * 4, int(np.ceil((notes[-1][0] + 1e-6) / 4)) * 4)
                # Drum parts play at the pitch they're written on most; 808s stay in key.
                root = ROOT_NOTE if part == "808" else max(
                    set(n[2] for n in notes), key=[n[2] for n in notes].count)
                hits = pattern_hits(part, notes, beats, root)
                audio = mix_hits(samples, [(part, hits)], bpm, beats)
                level = 0.89 / (np.abs(audio).max() or 1.0)  # normalize to -1 dBFS
                spb = 60 / bpm
                pid = f"{slugify(kit_name)}/{part}-{len(patterns) + 1}"
                notes_out[pid] = {
                    "sample": part,
                    "hits": [
                        [round(start * spb, 4), semitones, round(gain * level, 3)]
                        + ([round(cut * spb, 4)] if cut is not None else [])
                        for start, semitones, gain, cut in hits
                    ],
                }
                patterns.append({
                    "id": pid,
                    "name": pattern_name(Path(path).stem)
                    or f"{PARTS[part][1]} {len(patterns) + 1}",
                    "bpm": round(bpm),
                    "duration": round(beats * spb + TAIL, 2),
                    "peaks": peaks(audio),
                })
            parts.append({"id": part, "label": PARTS[part][0], "patterns": patterns})
        kits.append({"id": slugify(kit_name), "name": kit_name, "parts": parts})
        print(f"midi kit {kit_name:13s} {sum(len(p['patterns']) for p in parts):3d} patterns")

    KITS_JSON.write_text(json.dumps({"kits": kits}) + "\n")
    NOTES_JSON.write_text(json.dumps(notes_out, separators=(",", ":")) + "\n")


def write_bundle_contents(zf) -> None:
    """Count the drum kit's one-shots per category, straight from the zip."""
    names = [n for n in zf.namelist() if "/._" not in n and n.lower().endswith(".wav")]
    one_shots = [
        {"label": label, "count": sum(n.startswith(f"{KIT}{folder}/") for n in names)}
        for folder, label in ONE_SHOT_FOLDERS.items()
    ]
    CONTENTS_JSON.write_text(
        json.dumps({"drumKit": DRUM_KIT_NAME, "oneShots": one_shots}, indent=2) + "\n"
    )
    print(f"one-shots     {sum(o['count'] for o in one_shots):3d}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    result = {}
    with zipfile.ZipFile(ZIP) as zf:
        samples = {name: decode(zf.read(path)) for name, path in SAMPLES.items()}

        for name in ONE_SHOTS:
            audio = samples[name]
            encode(audio, OUT / f"{name}.mp3")
            result[name] = peaks(audio)
            print(f"{name:12s} {len(audio) / SR:5.2f}s")

        for pid, (bpm, layers) in PATTERNS.items():
            audio = normalize(render_pattern(zf, samples, bpm, layers))
            encode(audio, OUT / f"{pid}.mp3")
            result[pid] = peaks(audio)
            print(f"{pid:12s} {len(audio) / SR:5.2f}s")

        render_midi_kits(zf, samples)
        write_bundle_contents(zf)

    PEAKS_JSON.write_text(json.dumps(result, indent=2) + "\n")


if __name__ == "__main__":
    main()
