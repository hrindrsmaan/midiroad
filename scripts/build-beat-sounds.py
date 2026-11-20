#!/usr/bin/env python3
"""
Export the one-shots the beat maker lets people swap between.

Reads a hand-picked set of samples from the bundle's drum kit in
private/midiroad.zip and writes:
  - public/previews/sounds/<part>/<slug>.mp3   trimmed, peak-normalized one-shots
  - lib/beat-sounds.json                       per part: id, name, src, tune

808s are pitched: `tune` is the semitones that bring each one to C, the pitch
the generator writes its notes against, so every 808 plays in key.

Requires numpy and ffmpeg. Run from the repo root:
  python3 scripts/build-beat-sounds.py
"""
import json
import math
import re
import subprocess
import zipfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ZIP = ROOT / "private" / "midiroad.zip"
OUT = ROOT / "public" / "previews" / "sounds"
JSON_OUT = ROOT / "lib" / "beat-sounds.json"
KIT = "MIDIROAD/DRUM KITS/ANAMOLY TRAP DRUM KIT/"
SR = 44100

# part -> (kit folder, [(file stem, display name)]). The first is the default.
PICKS = {
    "hihat": ("HH", [
        ("Heist (HH)", "Heist"), ("Europe (HH)", "Europe"), ("Travis (HH)", "Travis"),
        ("Over It (HH)", "Over It"), ("Life Is Good (HH)", "Life Is Good"), ("Blood Bath (HH)", "Blood Bath"),
    ]),
    "snare": ("Snare", [
        ("Toronto (Snare)", "Toronto"), ("Prada (Snare)", "Prada"), ("Wheezy (Snare)", "Wheezy"),
        ("Zay (Snare)", "Zay"), ("Glock (Snare)", "Glock"), ("Millions (Snare)", "Millions"),
    ]),
    "clap": ("Clap", [
        ("Astroworld (Clap)", "Astroworld"), ("Versace (Clap)", "Versace"), ("Standard (Clap)", "Standard"),
        ("Tsunami (Clap)", "Tsunami"), ("Cardo (Clap)", "Cardo"), ("Hyperpop (Clap)", "Hyperpop"),
    ]),
    "kick": ("Kick", [
        ("Vice City (Kick)", "Vice City"), ("Goated (Kick)", "Goated"), ("Classic (Kick)", "Classic"),
        ("Views (Kick)", "Views"), ("Popstar (Kick)", "Popstar"), ("Melo (Kick)", "Melo"),
    ]),
    "808": ("808", [
        ("Holy Grail (808)", "Holy Grail"), ("Pierre (808)", "Pierre"), ("Suge v2 (808)", "Suge"),
        ("WheezyTheWave (808)", "Wheezy Wave"), ("Trapsoul 808", "Trapsoul"), ("Short Spinz 808", "Short Spinz"),
    ]),
}

# Longest each part is kept, in seconds; 808s need room to hold.
MAX_LEN = {"hihat": 0.6, "snare": 1.2, "clap": 1.2, "kick": 1.2, "808": 3.0}


def decode(data: bytes) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", "pipe:0", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        input=data, capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def encode(audio: np.ndarray, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "pipe:0",
         "-codec:a", "libmp3lame", "-b:a", "128k", str(path)],
        input=audio.astype(np.float32).tobytes(), check=True,
    )


def trim(audio: np.ndarray, max_len: float) -> np.ndarray:
    """Cut trailing silence and anything past max_len, with a short fade out."""
    mono = np.abs(audio).max(axis=1)
    loud = np.nonzero(mono > mono.max() * 10 ** (-60 / 20))[0]
    end = min(len(audio), (loud[-1] + 1) if len(loud) else len(audio), int(max_len * SR))
    out = audio[:end].copy()
    fade = min(len(out), int(0.02 * SR))
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return out


def tune_to_c(audio: np.ndarray) -> int:
    """Semitones that move an 808's fundamental to the nearest C."""
    mono = audio.mean(axis=1)
    body = mono[int(0.06 * SR):int(0.6 * SR)]
    spectrum = np.abs(np.fft.rfft(body * np.hanning(len(body)), n=1 << 17))
    freqs = np.fft.rfftfreq(1 << 17, 1 / SR)
    band = (freqs > 25) & (freqs < 160)
    f0 = freqs[band][np.argmax(spectrum[band])]
    above_c = 12 * math.log2(f0 / 32.703) % 12  # semitones above C
    shift = -round(above_c)
    return shift + 12 if shift < -6 else shift


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def main() -> None:
    sounds = {}
    with zipfile.ZipFile(ZIP) as zf:
        for part, (folder, picks) in PICKS.items():
            sounds[part] = []
            for stem, name in picks:
                audio = decode(zf.read(f"{KIT}{folder}/{stem}.wav"))
                audio = trim(audio, MAX_LEN[part])
                audio = audio / (np.abs(audio).max() or 1) * 0.89
                slug = slugify(name)
                encode(audio, OUT / part / f"{slug}.mp3")
                tune = tune_to_c(audio) if part == "808" else 0
                sounds[part].append({
                    "id": slug, "name": name, "src": f"/previews/sounds/{part}/{slug}.mp3", "tune": tune,
                })
                print(f"{part:6} {name:14} tune {tune:+d}")
    JSON_OUT.write_text(json.dumps(sounds, indent=1) + "\n")


if __name__ == "__main__":
    main()
