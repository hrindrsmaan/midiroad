import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/Logo";
import { FREE_KIT_COUNT, FREE_KIT_MAX_BPM, FREE_KIT_MIN_BPM } from "@/lib/free-kit";

export const alt = `MidiRoad free MIDI drum kit: ${FREE_KIT_COUNT} royalty-free trap and drill patterns`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LANES = [
  { color: "#c4b5fd", steps: "1011101110111011" },
  { color: "#f0abfc", steps: "0000100000001000" },
  { color: "#7c5cff", steps: "1000001000100000" },
  { color: "#c6ff3d", steps: "1000001000100010" },
];

export default function FreeKitImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0b",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoMark size={64} />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            MIDI<span style={{ color: "#22c55e" }}>ROAD</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              background: "#c6ff3d",
              color: "#0a0a0b",
              fontSize: 30,
              fontWeight: 800,
              padding: "10px 22px",
              borderRadius: 8,
            }}
          >
            FREE
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            {`${FREE_KIT_COUNT} free MIDI drum patterns`}
          </div>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.65)" }}>
            {`Trap · Drill · Dark trap · 808s · ${FREE_KIT_MIN_BPM}–${FREE_KIT_MAX_BPM} BPM · Any DAW`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LANES.map((lane, r) => (
            <div key={r} style={{ display: "flex", gap: 8 }}>
              {[...lane.steps].map((on, i) => (
                <div
                  key={i}
                  style={{
                    width: 58,
                    height: 16,
                    borderRadius: 3,
                    background: on === "1" ? lane.color : "rgba(255,255,255,0.07)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
