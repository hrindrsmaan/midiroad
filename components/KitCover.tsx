import Image from "next/image";
import { kitStats, midiKitFor, type KitProduct } from "@/lib/products";

/**
 * Square cover for a kit. Uses the kit's `image` when one is set; otherwise
 * draws a poster from the kit's own MIDI: the bars are the waveform of its
 * first patterns, so every cover is different and true to the kit.
 */
export function KitCover({
  kit,
  size = "md",
  priority = false,
}: {
  kit: KitProduct;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  if (kit.image) {
    return (
      <Image
        src={kit.image}
        alt={`${kit.name} cover`}
        width={800}
        height={800}
        priority={priority}
        className="aspect-square w-full rounded-md object-cover"
      />
    );
  }

  const stats = kitStats(kit);
  const bars = midiKitFor(kit)
    .parts.flatMap((p) => p.patterns.slice(0, 1).flatMap((x) => x.peaks))
    .slice(0, 48);
  const large = size === "lg";

  return (
    <div
      role="img"
      aria-label={`${kit.name} cover`}
      className="relative aspect-square w-full overflow-hidden rounded-md border border-white/10"
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, ${kit.accent}55, transparent 60%), radial-gradient(90% 80% at 100% 100%, ${kit.accent2}, #07080a 75%)`,
      }}
    >
      {/* Piano-roll grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: large ? "32px 32px" : "20px 20px",
        }}
      />

      {/* MIDI bars from the kit's own patterns */}
      <div
        aria-hidden
        className={`absolute inset-x-[8%] flex items-end gap-[2px] ${large ? "bottom-[30%] top-[38%]" : "top-[24%] bottom-[50%] sm:top-[30%] sm:bottom-[38%]"}`}
      >
        {bars.map((v, i) => (
          <span
            key={i}
            className="flex-1 rounded-[1px]"
            style={{
              height: `${Math.max(6, v * 100)}%`,
              background: kit.accent,
              opacity: v > 0.05 ? 0.9 : 0.25,
            }}
          />
        ))}
      </div>

      <div className={`absolute inset-0 flex flex-col justify-between ${large ? "p-7" : "p-4"}`}>
        <div className="flex items-center justify-between">
          <span
            className={`font-black uppercase tracking-[0.25em] text-white/70 ${large ? "text-xs" : "text-[9px]"}`}
          >
            MidiRoad
          </span>
          <span
            className={`rounded-full font-black uppercase tracking-wider text-black ${large ? "px-3 py-1 text-[11px]" : "px-2 py-0.5 text-[9px]"}`}
            style={{ background: kit.accent }}
          >
            MIDI Kit
          </span>
        </div>
        <div>
          <p
            className={`font-display leading-[0.95] text-white drop-shadow ${large ? "text-3xl sm:text-5xl md:text-6xl" : "text-base sm:text-2xl"}`}
          >
            {kit.name}
          </p>
          <p
            className={`mt-2 font-black uppercase tracking-widest ${large ? "text-xs" : "text-[9px]"}`}
            style={{ color: kit.accent }}
          >
            {stats.patterns} patterns · {stats.minBpm}–{stats.maxBpm} BPM
          </p>
        </div>
      </div>
    </div>
  );
}

export default KitCover;
