import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/Logo";
import { getBeat } from "@/lib/beats";
import { KEY_NAMES, VIBES, type DrumPart } from "@/lib/midi-generator";
import { beatPattern } from "@/lib/shared-beat";

export const alt = "A beat made in the MidiRoad beat maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STEPS = 64;
/** Rows and colors as in the beat maker (DESIGN.md chart colors). */
const ROWS: { id: string; label: string; parts: DrumPart[]; color: string }[] = [
  { id: "hats", label: "HATS", parts: ["hihat", "open-hat"], color: "#9b8ce8" },
  { id: "snare", label: "SNARE", parts: ["snare"], color: "#d07bd4" },
  { id: "kick", label: "KICK", parts: ["kick"], color: "#6a4ce8" },
  { id: "808", label: "808", parts: ["808"], color: "#3f8f5e" },
];

/** Share card for /b/<id>: the beat's step grid, tempo and key, and the MidiRoad mark. */
export default async function BeatImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = await getBeat(id);
  const pattern = stored ? beatPattern(stored.beat) : null;
  const muted = new Set(stored?.beat.muted ?? []);

  const grid = ROWS.map((row) => {
    const on = new Array<boolean>(STEPS).fill(false);
    for (const t of pattern?.tracks ?? []) {
      if (!row.parts.includes(t.part)) continue;
      for (const n of t.notes) on[Math.min(STEPS - 1, Math.floor((n.beat / pattern!.beats) * STEPS + 1e-6))] = true;
    }
    return { ...row, on, off: muted.has(row.id as never) };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#f8f1e7",
          color: "#1f1f1f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LogoMark size={56} />
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
            MIDI<span style={{ color: "#2e6b45" }}>ROAD</span>
          </div>
          <div style={{ display: "flex", marginLeft: "auto", fontSize: 26, color: "rgba(31,31,31,0.55)" }}>
            Play it · Remix it
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4, color: "#2e6b45" }}>
            {pattern ? String(pattern.bpm) : "—"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 6 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "rgba(31,31,31,0.6)" }}>BPM</div>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
              {pattern ? `${VIBES[pattern.vibe].label} beat · ${KEY_NAMES[pattern.key]} minor` : "Shared beat"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#fefaf7", borderRadius: 10, padding: "18px 20px" }}>
          {grid.map((row) => (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", width: 56, fontSize: 15, fontWeight: 700, color: "rgba(31,31,31,0.5)" }}>
                {row.label}
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {row.on.map((lit, i) => (
                  <div
                    key={i}
                    style={{
                      width: 13,
                      height: row.id === "808" ? 34 : 26,
                      borderRadius: 2,
                      background: lit ? row.color : i % 16 === 0 ? "rgba(31,31,31,0.14)" : i % 4 === 0 ? "rgba(31,31,31,0.09)" : "rgba(31,31,31,0.05)",
                      opacity: lit && row.off ? 0.25 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
