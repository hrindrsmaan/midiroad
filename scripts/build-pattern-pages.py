#!/usr/bin/env python3
"""
Build the public pattern catalog (lib/pattern-catalog.json).

Every MIDI drum pattern gets a stable URL, a human title, and a description
derived from the file itself: tempo, time signature, bar count, and how the
notes actually fall. Kit and part come from the same folder map as
scripts/render-previews.py. Nothing musical is invented: if a file has no
time-signature event, timeSignature is null and you fill it with an override.
Each file is parsed with a one-second timeout. A file that fails or times out
is logged and skipped; that pattern then falls back to the tempo, length, and
name already stored in lib/midi-kits.json.

Run from the repo root whenever private/midiroad.zip or the kit map changes,
after scripts/render-previews.py (so lib/midi-kits.json ids still match):

    python3 scripts/build-pattern-pages.py

Hand edits
----------
Don't edit lib/pattern-catalog.json. Put corrections in
lib/pattern-overrides.json, keyed by the pattern id (the same id as in
lib/midi-kits.json, e.g. "psycho/hihat-1"), then re-run this script:

    {
      "psycho/hihat-1": {
        "title": "Rolling dark trap hi-hat",
        "slug": "rolling-hi-hat-130-bpm",
        "description": "Longer page copy.",
        "metaDescription": "Short description for the meta tag, under 160 characters."
      }
    }

Any key you omit keeps the generated value. Slugs stay unique inside a genre;
a colliding override gets a numeric suffix and a warning.
"""
from __future__ import annotations

import hashlib
import json
import re
import signal
import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ZIP = ROOT / "private" / "midiroad.zip"
KITS_JSON = ROOT / "lib" / "midi-kits.json"
OVERRIDES_JSON = ROOT / "lib" / "pattern-overrides.json"
OUT_JSON = ROOT / "lib" / "pattern-catalog.json"

MIDI_ROOT = "MIDIROAD/MIDI KITS/"

# Keep this folder map in sync with MIDI_KITS in scripts/render-previews.py.
MIDI_KITS = {
    "psycho": {
        "Psycho (Midi Drum Kit)/Kick": "kick",
        "Psycho (Midi Drum Kit)/Snare": "snare",
        "Psycho (Midi Drum Kit)/HH": "hihat",
        "Psycho (Midi Drum Kit)/OH": "open-hat",
        "Psycho (Midi Drum Kit)/808": "808",
    },
    "odyssey": {
        "ODYSSEY MIDI DRUM KIT/Snares": "snare",
        "ODYSSEY MIDI DRUM KIT/Hi-Hats": "hihat",
        "ODYSSEY MIDI DRUM KIT/OH": "open-hat",
        "ODYSSEY MIDI DRUM KIT/808": "808",
    },
    "decoy": {
        "DECOY (MIDI KIT)/SNR": "snare",
        "DECOY (MIDI KIT)/HH": "hihat",
        "DECOY (MIDI KIT)/808": "808",
    },
    "black-market": {
        "BLACK-MARKET-Premium-MIDI-Kit/Kick": "kick",
        "BLACK-MARKET-Premium-MIDI-Kit/Hi Hat": "hihat",
        "BLACK-MARKET-Premium-MIDI-Kit/Open Hat": "open-hat",
        "BLACK-MARKET-Premium-MIDI-Kit/808": "808",
    },
    "focus": {"FOCUS (808 MIDI KIT)": "808"},
    "essentials": {
        "KICK": "kick",
        "Snare": "snare",
        "Hi-Hats": "hihat",
        "OPEN-HATS": "open-hat",
        "808": "808",
    },
}

# Musical genre of each kit. Slugs are the first URL segment: /midi/<slug>/…
GENRES = {
    "essentials": {"slug": "trap", "name": "Trap"},
    "black-market": {"slug": "street-trap", "name": "Street trap"},
    "odyssey": {"slug": "melodic-trap", "name": "Melodic trap"},
    "psycho": {"slug": "dark-trap", "name": "Dark trap"},
    "decoy": {"slug": "drill", "name": "Drill"},
    "focus": {"slug": "808-bass", "name": "808 bass"},
}

PARTS = {
    "kick": "kick",
    "snare": "snare",
    "hihat": "hi-hat",
    "open-hat": "open hat",
    "808": "808",
}

ADJECTIVE = {
    "rolling": "Rolling",
    "skippy": "Skippy",
    "sparse": "Sparse",
    "straight": "Straight",
    "chopped": "Chopped",
    "sliding": "Sliding",
    "melodic": "Melodic",
    "sustained": "Sustained",
    "bouncy": "Bouncy",
    "groove": "Groove",
    "busy": "Busy",
    "downbeat": "Downbeat",
    "syncopated": "Syncopated",
    "backbeat": "Backbeat",
    "offbeat": "Offbeat",
    "accent": "Accent",
    "driving": "Driving",
}

GENERIC_NAME = re.compile(r"^(Kick|Snare|Hi-Hat|Open Hat|808) \d+$")


def parse_midi(data: bytes):
    """SMF reader -> bpm, (numerator, denominator) or None, notes, pitch-bend count.

    notes are (start_beats, duration_beats, note, velocity).
    """
    if data[:4] != b"MThd" or len(data) < 14:
        raise ValueError("Not a standard MIDI file")
    _fmt, ntracks, ppq = struct.unpack(">HHH", data[8:14])
    if ppq <= 0:
        raise ValueError("Unsupported SMPTE time division")
    pos, bpm, timesig, notes, bends = 14, 120.0, None, [], 0
    for _ in range(ntracks):
        length = struct.unpack(">I", data[pos + 4 : pos + 8])[0]
        t = data[pos + 8 : pos + 8 + length]
        pos += 8 + length
        i = tick = status = 0
        held: dict[int, tuple[int, int]] = {}
        steps = 0

        def vlq() -> int:
            nonlocal i
            v = 0
            guard = 0
            while True:
                if i >= len(t):
                    raise ValueError("truncated MIDI variable-length quantity")
                b = t[i]
                i += 1
                v = (v << 7) | (b & 0x7F)
                guard += 1
                if guard > 4:
                    raise ValueError("MIDI variable-length quantity too long")
                if not b & 0x80:
                    return v

        while i < len(t):
            steps += 1
            if steps > 100_000:
                raise ValueError("MIDI event loop did not finish")
            tick += vlq()
            if i >= len(t):
                break
            if t[i] & 0x80:
                status = t[i]
                i += 1
            if status == 0xFF:
                kind = t[i]
                i += 1
                n = vlq()
                if kind == 0x51 and n == 3:
                    bpm = 60_000_000 / int.from_bytes(t[i : i + n], "big")
                if kind == 0x58 and n >= 2:
                    timesig = (t[i], 2 ** t[i + 1])
                i += n
            elif status in (0xF0, 0xF7):
                n = vlq()
                if i + n > len(t):
                    raise ValueError("truncated MIDI sysex")
                i += max(n, 1) if n == 0 and i < len(t) else n
            else:
                kind = status & 0xF0
                n = 1 if kind in (0xC0, 0xD0) else 2
                a = t[i : i + n]
                i += n
                if kind == 0xE0:
                    bends += 1
                elif kind == 0x90 and len(a) == 2 and a[1] > 0:
                    held[a[0]] = (tick, a[1])
                elif kind in (0x80, 0x90) and len(a) == 2 and a[0] in held:
                    start, vel = held.pop(a[0])
                    notes.append((start / ppq, (tick - start) / ppq, a[0], vel))
    return bpm, timesig, notes, bends


def slugify(text: str) -> str:
    text = text.lower().replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def classify(part: str, notes: list, bends: int, beats: float) -> str:
    """A short rhythmic label from onsets. Used in the title, not as a claim about genre."""
    if beats <= 0 or not notes:
        return "groove"
    onsets = [n[0] for n in notes]
    density = len(notes) / beats
    roll_pairs = sum(1 for a, b in zip(onsets, onsets[1:]) if b - a < 0.2)

    def slot(t: float) -> int:
        return round((t % 1) * 4) % 4

    slots = Counter(slot(t) for t in onsets)
    offbeat = (slots[1] + slots[3]) / len(notes)
    on_grid = (slots[0] + slots[2]) / len(notes)

    def near_beat(t: float, beat: float) -> bool:
        pos = t % 4
        return abs(pos - beat) < 0.12 or abs(pos - beat - 4) < 0.12

    if part == "hihat":
        if roll_pairs >= 4 or density >= 2.4:
            return "rolling"
        if offbeat >= 0.42 and density >= 0.85:
            return "skippy"
        if density < 0.7:
            return "sparse"
        if on_grid >= 0.72:
            return "straight"
        return "chopped"
    if part == "open-hat":
        return "accent" if density < 0.5 else "driving"
    if part == "kick":
        down = sum(1 for t in onsets if near_beat(t, 0))
        if density >= 1.15:
            return "busy"
        if down >= max(1, len(notes) * 0.4):
            return "downbeat"
        return "syncopated"
    if part == "snare":
        back = sum(1 for t in onsets if near_beat(t, 1) or near_beat(t, 3))
        if density >= 1.15:
            return "busy"
        if back >= 2 and back / len(notes) >= 0.3:
            return "backbeat"
        return "offbeat"
    # 808
    pitches = {n[2] for n in notes}
    avg = sum(n[1] for n in notes) / len(notes)
    changes = sum(
        1
        for a, b in zip(notes, notes[1:])
        if a[2] != b[2] and b[0] - a[0] < 1.25
    )
    if bends >= 1 or changes >= 3:
        return "sliding"
    if len(pitches) >= 5:
        return "melodic"
    if avg >= 1.2:
        return "sustained"
    if avg <= 0.45 and density >= 0.65:
        return "bouncy"
    return "groove"


def shape_of(notes: list, beats: float) -> str:
    """Where the hits sit, used only to tell two otherwise identical titles apart."""
    if not notes or beats <= 0:
        return "even"
    mid = beats / 2
    early = sum(1 for n in notes if n[0] < mid)
    late = len(notes) - early
    if late > early * 1.35:
        return "late"
    if early > late * 1.35:
        return "early"
    return "even"


def rhythm_sentence(part: str, style: str, notes: list, bars: int, pitches: int) -> str:
    n = len(notes)
    if n == 0:
        return f"The preview is {bars} bars long."
    avg = sum(note[1] for note in notes) / n
    noun = PARTS[part]
    if part == "808":
        hold = "under half a beat" if avg < 0.5 else f"about {avg:.1f} beats"
        sentence = (
            f"The 808 line has {n} notes across {bars} bars"
            f" and {pitches} pitch{'es' if pitches != 1 else ''}, holding {hold} each."
        )
    elif style == "rolling":
        sentence = f"The {noun} pattern packs {n} hits into {bars} bars, with rolls tighter than a 16th note."
    elif style == "skippy":
        sentence = f"The {noun} pattern puts {n} hits across {bars} bars, mostly on the offbeats."
    elif style == "backbeat":
        sentence = f"The snare lands on the backbeat, {n} hits across {bars} bars."
    elif style == "sparse" or style == "accent":
        sentence = f"It stays open: {n} {noun} hits across {bars} bars, leaving room for the rest of the beat."
    else:
        sentence = f"It has {n} {noun} hits across {bars} bars."
    # Where the loop starts differs even when two patterns share a tempo and a hit count.
    sentence += f" The first hit is {notes[0][0]:.2f} beats in."
    return sentence


def given_name(raw: str | None) -> str | None:
    if not raw or GENERIC_NAME.match(raw):
        return None
    return raw.strip()


def title_for(genre_name: str, part: str, style: str, named: str | None) -> str:
    """Sentence case. A proper pattern name is kept as written, and words are not repeated.

    The 808-bass genre plus an 808 part would otherwise read "sliding 808 bass 808".
    """
    part_noun = PARTS[part]
    genre = genre_name[0].lower() + genre_name[1:] if genre_name else genre_name
    head = named if named else ADJECTIVE[style].lower()
    pieces = [head]
    blob = head.lower()
    if part_noun not in blob and part_noun not in genre:
        pieces.append(part_noun)
        blob = " ".join(pieces).lower()
    if genre not in blob:
        pieces.append(genre)
    return " ".join(pieces)


def meta_for(title: str, bpm: int, timesig: str | None, kit_name: str) -> str:
    sig = f", {timesig}" if timesig else ""
    text = (
        f"Royalty-free {title} MIDI at {bpm} BPM{sig}. "
        f"Preview it in the browser, then buy the {kit_name} kit or unlock this file with 1 credit."
    )
    if len(text) <= 160:
        return text
    # Keep the facts; drop the second sentence's tail if a long proper name blows the limit.
    short = f"Royalty-free {title} MIDI at {bpm} BPM{sig}, from the {kit_name} kit. Preview it, then buy the kit or unlock the file."
    return short if len(short) <= 160 else short[:157].rsplit(" ", 1)[0] + "..."


def description_for(title: str, bpm: int, timesig: str | None, kit_name: str, rhythm: str) -> str:
    sig = timesig or "the file's own time signature"
    return (
        f"{title[0].upper()}{title[1:]} is a royalty-free MIDI pattern at {bpm} BPM in {sig}, "
        f"from the {kit_name} kit. {rhythm} "
        f"Preview it here with MidiRoad drum samples. Buy the {kit_name} kit, or unlock this one file with 1 credit. "
        f"The MIDI drags into FL Studio, Ableton, Logic, and any DAW. Royalty-free for releases."
    )


class ParseTimeout(Exception):
    pass


def _on_alarm(signum, frame):
    raise ParseTimeout("timed out reading a MIDI file")


def parse_file(data: bytes, seconds: float = 1.0):
    """Parse one MIDI file, or give up. A single bad file must not stall the catalog."""
    signal.signal(signal.SIGALRM, _on_alarm)
    signal.setitimer(signal.ITIMER_REAL, seconds)
    try:
        return parse_midi(data)
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)


def library_id(path: str) -> str:
    return hashlib.sha256(path.encode()).hexdigest()[:12]


def load_overrides() -> dict:
    if not OVERRIDES_JSON.exists():
        return {}
    data = json.loads(OVERRIDES_JSON.read_text())
    if not isinstance(data, dict):
        sys.exit("pattern-overrides.json must be an object keyed by pattern id")
    return data


def main() -> None:
    import zipfile

    kits = json.loads(KITS_JSON.read_text())["kits"]
    by_library: dict[str, dict] = {}
    for kit in kits:
        for part in kit["parts"]:
            for pattern in part["patterns"]:
                by_library[pattern["libraryId"]] = {
                    "id": pattern["id"],
                    "name": pattern["name"],
                    "bpm": pattern["bpm"],
                    "duration": pattern["duration"],
                    "kitId": kit["id"],
                    "partId": part["id"],
                }

    found: dict[str, dict] = {}
    with zipfile.ZipFile(ZIP) as zf:
        for kit_id, folders in MIDI_KITS.items():
            for folder, part in folders.items():
                prefix = f"{MIDI_ROOT}{folder}/"
                paths = [
                    p
                    for p in zf.namelist()
                    if p.startswith(prefix)
                    and "/" not in p[len(prefix) :]
                    and p.lower().endswith(".mid")
                    and "/._" not in p
                    and "__MACOSX" not in p
                ]
                for path in paths:
                    lid = library_id(path)
                    meta = by_library.get(lid)
                    if not meta:
                        continue
                    if meta["kitId"] != kit_id or meta["partId"] != part:
                        print(
                            f"skip {path}: hash belongs to {meta['id']}, folder map says {kit_id}/{part}",
                            file=sys.stderr,
                        )
                        continue
                    try:
                        bpm, timesig, notes, bends = parse_file(zf.read(path))
                    except Exception as err:
                        print(f"skip {path}: {err}", file=sys.stderr)
                        continue
                    beats = max(1, round((meta["duration"] - 0.4) * meta["bpm"] / 60))
                    in_window = [n for n in notes if n[0] < beats + 0.01]
                    found[lid] = {
                        "meta": meta,
                        "fileBpm": round(bpm),
                        "timesig": timesig,
                        "notes": in_window,
                        "bends": bends,
                        "beats": beats,
                    }

    for lid, meta in by_library.items():
        if lid in found:
            continue
        # The listing already has tempo, length, and a name. Use those when the file cannot be read.
        print(f"fallback {meta['id']}: using the kit listing (tempo, length, name)", file=sys.stderr)
        found[lid] = {
            "meta": meta,
            "fileBpm": meta["bpm"],
            "timesig": None,
            "notes": [],
            "bends": 0,
            "beats": max(1, round((meta["duration"] - 0.4) * meta["bpm"] / 60)),
        }

    kit_names = {
        "essentials": "Essentials Vault",
        "black-market": "Black Market Heist",
        "odyssey": "Midnight Odyssey",
        "psycho": "Psycho Ward",
        "decoy": "Decoy Protocol",
        "focus": "Focus 808 Lab",
    }

    drafts = []
    for lid, row in found.items():
        meta = row["meta"]
        genre = GENRES[meta["kitId"]]
        timesig = None
        beats_per_bar = 4
        if row["timesig"]:
            num, den = row["timesig"]
            timesig = f"{num}/{den}"
            beats_per_bar = num * 4 / den
        bars = max(1, round(row["beats"] / beats_per_bar))
        notes = row["notes"]
        style = classify(meta["partId"], notes, row["bends"], row["beats"])
        named = given_name(meta["name"])
        pitches = len({n[2] for n in notes}) or 1
        title = title_for(genre["name"], meta["partId"], style, named)
        rhythm = rhythm_sentence(meta["partId"], style, notes, bars, pitches)
        fingerprint = tuple((round(n[0], 2), n[2]) for n in notes)
        drafts.append(
            {
                "id": meta["id"],
                "libraryId": lid,
                "kitId": meta["kitId"],
                "partId": meta["partId"],
                "genreSlug": genre["slug"],
                "genreName": genre["name"],
                "bpm": meta["bpm"],
                "timeSignature": timesig,
                "bars": bars,
                "hits": len(notes),
                "pitches": pitches,
                "style": style,
                "givenName": named,
                "title": title,
                "shape": shape_of(notes, row["beats"]),
                "description": description_for(title, meta["bpm"], timesig, kit_names[meta["kitId"]], rhythm),
                "metaDescription": meta_for(title, meta["bpm"], timesig, kit_names[meta["kitId"]]),
                "fingerprint": fingerprint,
                "fileBpm": row["fileBpm"],
            }
        )

    # Same notes in another kit: link them instead of pretending each is unique.
    groups: dict[tuple, list[str]] = defaultdict(list)
    for d in drafts:
        if d["fingerprint"]:
            groups[d["fingerprint"]].append(d["id"])
    also = {i: [other for other in ids if other != i] for ids in groups.values() for i in ids}

    overrides = load_overrides()
    unknown = sorted(set(overrides) - {d["id"] for d in drafts})
    if unknown:
        print(f"warning: overrides for unknown ids: {', '.join(unknown)}", file=sys.stderr)

    used: dict[str, set[str]] = defaultdict(set)
    patterns = []
    for d in sorted(drafts, key=lambda r: (r["genreSlug"], r["partId"], r["bpm"], r["id"])):
        ov = overrides.get(d["id"], {})
        title = str(ov.get("title") or d["title"]).strip()
        # Keep the genre word when it is part of a pattern name ("Trap Alone"),
        # so the slug is not shortened to "alone-…".
        slug = slugify(str(ov.get("slug") or f"{title}-{d['bpm']}-bpm"))
        base = slug
        taken = used[d["genreSlug"]]
        if slug in taken and d["shape"] != "even" and not ov.get("slug"):
            shaped = f"{base}-{d['shape']}"
            if shaped not in taken:
                slug = shaped
                if not ov.get("title"):
                    extra = "late hits" if d["shape"] == "late" else "front-loaded"
                    title = f"{title}, {extra}"
        n = 2
        numbered = False
        while slug in taken:
            slug = f"{base}-{n}"
            n += 1
            numbered = True
            if n > 100:
                slug = slugify(f"{base}-{d['id']}")
                break
        if numbered and not ov.get("title"):
            title = f"{title}, {d['hits']} hits"
        taken.add(slug)
        description = str(ov.get("description") or d["description"]).strip()
        if title != d["title"] and not ov.get("description"):
            # The opening clause quotes the title, so keep it in sync.
            description = description.replace(d["title"][0].upper() + d["title"][1:], title[0].upper() + title[1:], 1)
            description = description.replace(d["title"], title, 1)
        meta_description = str(ov.get("metaDescription") or meta_for(title, d["bpm"], d["timeSignature"], kit_names[d["kitId"]])).strip()
        bpm_note = None if d["fileBpm"] == d["bpm"] else d["fileBpm"]
        patterns.append(
            {
                "id": d["id"],
                "libraryId": d["libraryId"],
                "kitId": d["kitId"],
                "partId": d["partId"],
                "genreSlug": d["genreSlug"],
                "slug": slug,
                "title": title,
                "bpm": d["bpm"],
                "timeSignature": d["timeSignature"],
                "bars": d["bars"],
                "hits": d["hits"],
                "pitches": d["pitches"],
                "style": d["style"],
                "givenName": d["givenName"],
                "description": description,
                "metaDescription": meta_description,
                "alsoIn": also.get(d["id"], []),
                **({"fileBpm": bpm_note} if bpm_note else {}),
            }
        )

    genres = [
        {"slug": g["slug"], "name": g["name"], "kitId": kit_id}
        for kit_id, g in GENRES.items()
    ]
    # Stable, musical order: broad trap first, then the more specific lanes.
    order = ["trap", "street-trap", "melodic-trap", "dark-trap", "drill", "808-bass"]
    genres.sort(key=lambda g: order.index(g["slug"]))

    missing_sig = [p["id"] for p in patterns if not p["timeSignature"]]
    long_meta = [p["id"] for p in patterns if len(p["metaDescription"]) > 160]
    if long_meta:
        sys.exit(f"meta descriptions over 160 characters: {', '.join(long_meta[:8])}")

    OUT_JSON.write_text(json.dumps({"genres": genres, "patterns": patterns}, indent=2) + "\n")
    styles = Counter(p["style"] for p in patterns)
    print(f"wrote {len(patterns)} patterns in {len(genres)} genres -> {OUT_JSON.relative_to(ROOT)}")
    print("styles:", ", ".join(f"{k} {v}" for k, v in styles.most_common()))
    print(f"named: {sum(1 for p in patterns if p['givenName'])}")
    print(f"shared grooves: {sum(1 for p in patterns if p['alsoIn'])}")
    if missing_sig:
        print(f"missing time signature ({len(missing_sig)}): fill these in pattern-overrides.json")
        print(" ", ", ".join(missing_sig[:12]))
    # Show a spread of titles so a re-run is easy to eyeball.
    print("sample titles:")
    for p in patterns[::17][:12]:
        print(f"  /midi/{p['genreSlug']}/{p['slug']}")
        print(f"    {p['title']}  ({p['bpm']} BPM {p['timeSignature']})")


if __name__ == "__main__":
    main()
