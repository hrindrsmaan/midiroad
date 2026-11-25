import { ImageResponse } from "next/og";
import { MIDI_PATTERN_COUNT } from "@/lib/bundle";

export const alt = "MidiRoad – royalty-free MIDI drum kits and a free trap beat maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card for links on social apps and chat: the brand and what's sold. */
export default function OpengraphImage() {
  const bars = [0.5, 0.8, 0.35, 0.95, 0.6, 0.4, 0.85, 0.3, 0.7, 0.55, 0.9, 0.45];
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
          background: "#f8f1e7",
          color: "#1f1f1f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
          MIDI<span style={{ color: "#2e6b45" }}>ROAD</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>MIDI Drum Kits for Trap &amp; Drill</div>
          <div style={{ fontSize: 32, color: "rgba(31,31,31,0.62)" }}>
            {`${MIDI_PATTERN_COUNT} royalty-free MIDI patterns · Free beat maker · Any DAW`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 90 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ width: 52, height: `${h * 100}%`, borderRadius: 6, background: i % 4 === 3 ? "#2e6b45" : "#1f1f1f" }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
