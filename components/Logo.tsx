/**
 * MidiRoad logo.
 *
 * The mark is a road running into the distance whose center line is a run
 * of MIDI note blocks: the road and the piano roll in one shape. It is drawn
 * on a 64-unit grid so it stays crisp from a 16px favicon up.
 */

const TILE = "#7c3aed";
const ROAD = "#f8fafc";
const BRAND = "#22c55e";

/** Center-line notes, near to far: [y, height, width]. */
const NOTES: [number, number, number][] = [
  [42, 10, 4.8],
  [31.5, 6.8, 3.8],
  [23.5, 4.6, 2.9],
  [17.5, 3.2, 2.2],
];

/** Piano-roll notes beside the road: [x, y, width]. */
const SIDE_NOTES: [number, number, number][] = [
  [8, 15, 12],
  [44, 21, 12],
  [9, 27, 8],
  [48, 33, 8],
];

export function LogoMark({
  className = "h-9 w-9",
  inverted = false,
  title,
  size,
}: {
  className?: string;
  /** Fixed pixel size (for Open Graph images, which ignore CSS classes). */
  size?: number;
  /** Light tile for dark backgrounds. */
  inverted?: boolean;
  title?: string;
}) {
  const tile = inverted ? ROAD : TILE;
  const road = inverted ? TILE : ROAD;
  const side = inverted ? "#a5b4fc" : "#c4b5fd";
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="64" height="64" rx="10" fill={tile} />
      {SIDE_NOTES.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={3.4} rx={1.4} fill={side} />
      ))}
      {/* Road narrowing to the horizon */}
      <path d="M11 55 L29.5 11 H34.5 L53 55 Z" fill={road} />
      {/* Center line as MIDI notes */}
      {NOTES.map(([y, h, w]) => (
        <rect key={y} x={32 - w / 2} y={y} width={w} height={h} rx={w / 3} fill={BRAND} />
      ))}
    </svg>
  );
}

/** Mark plus wordmark. "MIDI" in ink, "ROAD" in brand red. */
export function Logo({
  className = "",
  inverted = false,
  markClassName = "h-9 w-9",
}: {
  className?: string;
  /** For dark backgrounds. */
  inverted?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} inverted={inverted} />
      <span
        className={`font-heading text-[22px] leading-none ${inverted ? "text-ivory" : "text-ink"}`}
      >
        MIDI<span className={"text-brand"}>ROAD</span>
      </span>
    </span>
  );
}

export default Logo;
