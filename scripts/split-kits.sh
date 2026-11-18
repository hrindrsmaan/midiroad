#!/usr/bin/env bash
# Builds one download per MIDI kit (private/kits/<kit-id>.zip) from the full
# bundle in private/midiroad.zip. Re-run whenever the bundle zip changes.
set -euo pipefail
cd "$(dirname "$0")/.."

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
unzip -q private/midiroad.zip -d "$tmp" -x '__MACOSX/*' '*.DS_Store'
src="$tmp/MIDIROAD/MIDI KITS"
out="$PWD/private/kits"
rm -rf "$out" && mkdir -p "$out"

# kit-id | zip root folder | folders under "MIDI KITS" (comma-separated)
while IFS='|' read -r id root folders; do
  stage="$tmp/stage-$id/$root"
  mkdir -p "$stage"
  IFS=',' read -ra list <<< "$folders"
  for f in "${list[@]}"; do cp -R "$src/$f" "$stage/"; done
  (cd "$tmp/stage-$id" && zip -qr "$out/$id.zip" "$root")
  echo "$id.zip: $(unzip -Z1 "$out/$id.zip" | grep -ci '\.mid$') MIDI files"
done <<'KITS'
psycho|MIDIROAD - Psycho Ward|Psycho (Midi Drum Kit)
odyssey|MIDIROAD - Midnight Odyssey|ODYSSEY MIDI DRUM KIT
decoy|MIDIROAD - Decoy Protocol|DECOY (MIDI KIT)
black-market|MIDIROAD - Black Market Heist|BLACK-MARKET-Premium-MIDI-Kit
focus|MIDIROAD - Focus 808 Lab|FOCUS (808 MIDI KIT)
essentials|MIDIROAD - Essentials Vault|KICK,Snare,Hi-Hats,OPEN-HATS,808
KITS
