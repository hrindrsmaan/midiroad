#!/usr/bin/env python3
"""
Build the free starter kit (private/free-kit.zip) from the full bundle.

The pattern list lives in lib/free-kit.json (ids from lib/pattern-catalog.json).
Each pattern's libraryId is the first 12 hex characters of the SHA-256 of its
path inside private/midiroad.zip (see scripts/build-library.mjs), so the
files are found by hashing every path in the bundle.

The zip goes in private/, never public/: it is only served by
/api/free-kit/download with a signed, expiring link sent to an email address.

Run from the repo root whenever lib/free-kit.json or the bundle changes:

    python3 scripts/build-free-kit.py
"""

import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUNDLE = ROOT / "private" / "midiroad.zip"
OUT = ROOT / "private" / "free-kit.zip"
KIT = json.loads((ROOT / "lib" / "free-kit.json").read_text())
CATALOG = json.loads((ROOT / "lib" / "pattern-catalog.json").read_text())

GENRES = {g["slug"]: g["name"] for g in CATALOG["genres"]}
PATTERNS = {p["id"]: p for p in CATALOG["patterns"]}
FOLDER = KIT["name"]

README = f"""{KIT["name"]}
{"=" * len(KIT["name"])}

{len(KIT["patterns"])} royalty-free MIDI drum patterns from MidiRoad, two from each style.

How to use them
- Drag a .mid file onto a drum, hi-hat or 808 channel in FL Studio, Ableton Live,
  Logic Pro or any DAW. Set your project to the BPM in the file name.
- 808 files are written in C. Load your 808 sample and transpose to your key.

License
- Royalty-free: use these patterns in your beats and released music.
- Do not resell or share the MIDI files themselves as a sample pack.

The full kits (hundreds more patterns): https://midiroad.com
Free beat maker: https://midiroad.com/beat-maker
"""


# A fixed timestamp, so re-running the script on the same input gives the same bytes.
STAMP = (2026, 1, 1, 0, 0, 0)


def entry(name: str) -> zipfile.ZipInfo:
    info = zipfile.ZipInfo(name, date_time=STAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    return info


def safe(name: str) -> str:
    return re.sub(r'[\\/:*?"<>|]+', "-", name).strip()


def main() -> int:
    wanted = KIT["patterns"]
    missing = [pid for pid in wanted if pid not in PATTERNS]
    if missing:
        print(f"Unknown pattern ids in lib/free-kit.json: {missing}", file=sys.stderr)
        return 1
    if len(set(wanted)) != len(wanted):
        print("lib/free-kit.json lists a pattern twice", file=sys.stderr)
        return 1

    by_library = {PATTERNS[pid]["libraryId"]: PATTERNS[pid] for pid in wanted}
    found: dict[str, bytes] = {}
    with zipfile.ZipFile(BUNDLE) as bundle:
        for info in bundle.infolist():
            name = info.filename
            if "__MACOSX" in name or not name.endswith(".mid"):
                continue
            lib_id = hashlib.sha256(name.encode("utf-8")).hexdigest()[:12]
            if lib_id in by_library:
                found[lib_id] = bundle.read(info)

    absent = [p["id"] for lid, p in by_library.items() if lid not in found]
    if absent:
        print(f"Not found in {BUNDLE.name}: {absent}", file=sys.stderr)
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as out:
        out.writestr(entry(f"{FOLDER}/README.txt"), README)
        for pid in wanted:
            p = PATTERNS[pid]
            genre = GENRES[p["genreSlug"]]
            file_name = safe(f"{p['title'][0].upper()}{p['title'][1:]} - {p['bpm']} BPM.mid")
            out.writestr(entry(f"{FOLDER}/{genre}/{file_name}"), found[p["libraryId"]])
            print(f"  {genre:<13} {p['bpm']:>3} BPM  {p['title']}")

    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size:,} bytes, {len(wanted)} patterns)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
