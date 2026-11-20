import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";
import { KIT_PRODUCTS, kitStats, type KitProduct } from "@/lib/products";

/**
 * Cover for a kit: a 3D product box with trap-style art on the front and the
 * kit name down the spine. Uses the kit's `image` instead when one is set.
 *
 * Everything is SVG with a fixed 3:4 viewBox, so type and art scale together
 * at any size. Each kit has its own art; the frame (label, stats band, grain)
 * is shared.
 */

const W = 300;
const H = 400;
/** Spine depth as a share of the box width. */
const DEPTH = 0.13;

const ANTON = { fontFamily: "var(--font-anton), Impact, sans-serif" };
const STENCIL = { fontFamily: "var(--font-black-ops), Impact, sans-serif" };
const MONO = { fontFamily: "var(--font-space-grotesk), ui-monospace, monospace" };

/** Small deterministic PRNG so server and client draw the same stars/scratches. */
function rng(seed: string) {
  let s = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

type Art = (kit: KitProduct, id: string) => ReactNode;

const ARTS: Record<string, Art> = {
  essentials: (kit, id) => {
    const a = kit.accent;
    return (
      <>
        <rect width={W} height={H} fill="#040805" />
        <circle cx={150} cy={160} r={150} fill={`url(#${id}-glow)`} />
        {/* Vault door */}
        <circle cx={150} cy={160} r={100} fill="#0a140d" stroke={a} strokeWidth={3} />
        <circle cx={150} cy={160} r={86} fill="none" stroke={a} strokeOpacity={0.5} strokeDasharray="2 6" strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={150 + Math.cos(t) * 93} cy={160 + Math.sin(t) * 93} r={3.2} fill={a} />;
        })}
        <circle cx={150} cy={160} r={58} fill="#06100a" stroke={a} strokeWidth={2} />
        {[0, 60, 120].map((r) => (
          <rect key={r} x={146} y={108} width={8} height={104} rx={4} fill={a} transform={`rotate(${r} 150 160)`} />
        ))}
        <circle cx={150} cy={160} r={16} fill="#040805" stroke={a} strokeWidth={3} />
        <text x={150} y={300} textAnchor="middle" fontSize={56} fill="#fff" style={ANTON} textLength={260} lengthAdjust="spacingAndGlyphs">
          ESSENTIALS
        </text>
        <text x={150} y={346} textAnchor="middle" fontSize={44} fill="none" stroke={a} strokeWidth={1.6} style={ANTON} letterSpacing={14}>
          VAULT
        </text>
      </>
    );
  },

  "black-market": (kit, id) => {
    const a = kit.accent;
    const tape = (y: number, rot: number, key: string) => (
      <g key={key} transform={`rotate(${rot} 150 ${y})`}>
        <rect x={-60} y={y - 14} width={420} height={28} fill={a} />
        <rect x={-60} y={y - 14} width={420} height={28} fill={`url(#${id}-hazard)`} opacity={0.35} />
        <text x={150} y={y + 5} textAnchor="middle" fontSize={14} fill="#000" style={ANTON} letterSpacing={3}>
          BLACK MARKET • DO NOT CROSS • BLACK MARKET
        </text>
      </g>
    );
    return (
      <>
        <rect width={W} height={H} fill="#0b0904" />
        <circle cx={150} cy={90} r={190} fill={`url(#${id}-glow)`} />
        <text x={150} y={250} textAnchor="middle" fontSize={300} fill={a} opacity={0.12} style={STENCIL}>
          $
        </text>
        {tape(96, -14, "t1")}
        {tape(190, 9, "t2")}
        {/* Stamp */}
        <g transform="rotate(-12 205 140)" opacity={0.9}>
          <rect x={150} y={124} width={112} height={34} fill="none" stroke="#e5322d" strokeWidth={3} />
          <text x={206} y={148} textAnchor="middle" fontSize={20} fill="#e5322d" style={STENCIL}>
            CLASSIFIED
          </text>
        </g>
        <text x={150} y={286} textAnchor="middle" fontSize={34} fill={a} style={STENCIL} textLength={250} lengthAdjust="spacingAndGlyphs">
          BLACK MARKET
        </text>
        <text x={150} y={350} textAnchor="middle" fontSize={72} fill="#fff" style={ANTON} letterSpacing={6}>
          HEIST
        </text>
      </>
    );
  },

  odyssey: (kit, id) => {
    const a = kit.accent;
    const r = rng(kit.id);
    return (
      <>
        <rect width={W} height={H} fill={`url(#${id}-sky)`} />
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={r() * W} cy={r() * 230} r={r() * 1.3 + 0.3} fill="#fff" opacity={r() * 0.7 + 0.2} />
        ))}
        <circle cx={150} cy={150} r={120} fill={a} opacity={0.35} filter={`url(#${id}-blur)`} />
        <circle cx={150} cy={150} r={68} fill={`url(#${id}-orb)`} />
        <ellipse cx={150} cy={150} rx={118} ry={20} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.5} transform="rotate(-14 150 150)" />
        {/* Four-point star */}
        <path d="M150 112 L156 144 L188 150 L156 156 L150 188 L144 156 L112 150 L144 144 Z" fill="#fff" opacity={0.95} />
        <rect y={225} width={W} height={H - 225} fill={`url(#${id}-horizon)`} />
        <text x={150} y={276} textAnchor="middle" fontSize={20} fill="#fff" style={ANTON} letterSpacing={12}>
          MIDNIGHT
        </text>
        <text x={150} y={346} textAnchor="middle" fontSize={68} fill="#fff" style={ANTON} textLength={256} lengthAdjust="spacingAndGlyphs">
          ODYSSEY
        </text>
      </>
    );
  },

  psycho: (kit, id) => {
    const a = kit.accent;
    const r = rng(kit.id);
    return (
      <>
        <rect width={W} height={H} fill="#090203" />
        <circle cx={150} cy={170} r={170} fill={`url(#${id}-glow)`} />
        {Array.from({ length: 26 }, (_, i) => {
          const x = r() * W;
          const y = r() * 260;
          const len = 30 + r() * 90;
          const ang = -70 + r() * 40;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + Math.cos((ang * Math.PI) / 180) * len}
              y2={y + Math.sin((ang * Math.PI) / 180) * len}
              stroke="#fff"
              strokeOpacity={0.1 + r() * 0.15}
              strokeWidth={0.6 + r()}
            />
          );
        })}
        {/* Broken medical cross with drips */}
        <g filter={`url(#${id}-shadow)`}>
          <rect x={122} y={70} width={56} height={170} fill={a} />
          <rect x={65} y={127} width={170} height={56} fill={a} />
          {[[132, 240, 26], [150, 240, 44], [166, 240, 18], [75, 183, 16], [214, 183, 30]].map(([x, y, h], i) => (
            <rect key={i} x={x} y={y - 2} width={6} height={h} rx={3} fill={a} />
          ))}
        </g>
        {/* Glitch slices */}
        {[[60, 138, 140, 5], [100, 160, 120, 3], [118, 92, 70, 4]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#090203" />
        ))}
        <rect x={140} y={150} width={90} height={4} fill="#38e8ff" opacity={0.6} />
        {/* Glitched title */}
        <g style={ANTON} fontSize={78} textAnchor="middle">
          <text x={146} y={318} fill="#38e8ff" opacity={0.7} textLength={262} lengthAdjust="spacingAndGlyphs">PSYCHO</text>
          <text x={154} y={318} fill={a} opacity={0.8} textLength={262} lengthAdjust="spacingAndGlyphs">PSYCHO</text>
          <text x={150} y={318} fill="#fff" textLength={262} lengthAdjust="spacingAndGlyphs">PSYCHO</text>
        </g>
        <rect x={30} y={284} width={240} height={3} fill="#090203" />
        <g transform="rotate(-4 150 340)">
          <rect x={100} y={326} width={100} height={26} fill="#e9e4d8" />
          <text x={150} y={346} textAnchor="middle" fontSize={20} fill="#000" style={STENCIL} letterSpacing={4}>
            WARD
          </text>
        </g>
      </>
    );
  },

  decoy: (kit, id) => {
    const a = kit.accent;
    return (
      <>
        <rect width={W} height={H} fill="#02080c" />
        <rect width={W} height={H} fill={`url(#${id}-grid)`} />
        <circle cx={150} cy={150} r={150} fill={`url(#${id}-glow)`} />
        {/* Crosshair */}
        <g stroke={a} fill="none">
          <circle cx={150} cy={150} r={86} strokeWidth={2} strokeDasharray="120 15" />
          <circle cx={150} cy={150} r={56} strokeWidth={1.5} strokeOpacity={0.7} />
          <circle cx={150} cy={150} r={22} strokeWidth={2} />
          <path d="M150 50 V118 M150 182 V250 M50 150 H118 M182 150 H250" strokeWidth={2} />
          <path d="M40 40 h22 M40 40 v22 M260 40 h-22 M260 40 v22 M40 260 h22 M40 260 v-22 M260 260 h-22 M260 260 v-22" strokeWidth={3} />
        </g>
        <circle cx={150} cy={150} r={4} fill="#ff3b3b" />
        <g style={MONO} fontSize={8} fill={a} letterSpacing={1.5}>
          <text x={46} y={76}>TARGET: LOCKED</text>
          <text x={254} y={232} textAnchor="end">51.5072° N 0.1276° W</text>
        </g>
        <text x={150} y={322} textAnchor="middle" fontSize={84} fill="#fff" style={ANTON} letterSpacing={4} filter={`url(#${id}-shadow)`}>
          DECOY
        </text>
        <text x={150} y={350} textAnchor="middle" fontSize={17} fill={a} style={ANTON} letterSpacing={11}>
          PROTOCOL
        </text>
      </>
    );
  },

  focus: (kit, id) => {
    const a = kit.accent;
    return (
      <>
        <rect width={W} height={H} fill="#0c0209" />
        <circle cx={150} cy={150} r={170} fill={`url(#${id}-glow)`} />
        {/* Speaker */}
        <circle cx={150} cy={150} r={104} fill="#1a1018" stroke="#2c1e29" strokeWidth={6} />
        {Array.from({ length: 8 }, (_, i) => {
          const t = (i / 8) * Math.PI * 2 + Math.PI / 8;
          return <circle key={i} cx={150 + Math.cos(t) * 97} cy={150 + Math.sin(t) * 97} r={3} fill="#5a4656" />;
        })}
        <circle cx={150} cy={150} r={84} fill={`url(#${id}-cone)`} />
        {[70, 56, 42].map((rad) => (
          <circle key={rad} cx={150} cy={150} r={rad} fill="none" stroke={a} strokeOpacity={0.35} />
        ))}
        <circle cx={150} cy={150} r={26} fill={a} />
        <circle cx={144} cy={143} r={8} fill="#fff" opacity={0.45} />
        <text x={150} y={280} textAnchor="middle" fontSize={20} fill={a} style={ANTON} letterSpacing={14}>
          FOCUS
        </text>
        <text x={150} y={352} textAnchor="middle" fontSize={78} fill="#fff" style={ANTON} letterSpacing={2}>
          808 LAB
        </text>
      </>
    );
  },
};

/** Fallback art for a kit without its own design. */
const DEFAULT_ART: Art = (kit, id) => (
  <>
    <rect width={W} height={H} fill="#07080a" />
    <circle cx={150} cy={150} r={170} fill={`url(#${id}-glow)`} />
    <text x={150} y={330} textAnchor="middle" fontSize={56} fill="#fff" style={ANTON} textLength={260} lengthAdjust="spacingAndGlyphs">
      {kit.name.toUpperCase()}
    </text>
  </>
);

function Defs({ kit, id }: { kit: KitProduct; id: string }) {
  const a = kit.accent;
  const b = kit.accent2;
  return (
    <defs>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0%" stopColor={a} stopOpacity={0.45} />
        <stop offset="100%" stopColor={a} stopOpacity={0} />
      </radialGradient>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#05040f" />
        <stop offset="100%" stopColor={b} />
      </linearGradient>
      <radialGradient id={`${id}-orb`} cx="40%" cy="35%">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="45%" stopColor={a} />
        <stop offset="100%" stopColor={b} />
      </radialGradient>
      <linearGradient id={`${id}-horizon`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={a} stopOpacity={0.55} />
        <stop offset="35%" stopColor={b} stopOpacity={0.9} />
        <stop offset="100%" stopColor="#05040f" />
      </linearGradient>
      <radialGradient id={`${id}-cone`} cx="50%" cy="45%">
        <stop offset="0%" stopColor="#3a2436" />
        <stop offset="80%" stopColor="#120910" />
        <stop offset="100%" stopColor="#24161f" />
      </radialGradient>
      <pattern id={`${id}-hazard`} width={20} height={20} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={10} height={20} fill="#000" />
      </pattern>
      <pattern id={`${id}-grid`} width={20} height={20} patternUnits="userSpaceOnUse">
        <path d="M20 0 H0 V20" fill="none" stroke={a} strokeOpacity={0.12} />
      </pattern>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={24} />
      </filter>
      <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx={0} dy={0} stdDeviation={6} floodColor={a} floodOpacity={0.7} />
      </filter>
      <filter id={`${id}-grain`}>
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity={0.18} />
        <stop offset="35%" stopColor="#fff" stopOpacity={0} />
        <stop offset="60%" stopColor="#fff" stopOpacity={0} />
        <stop offset="72%" stopColor="#fff" stopOpacity={0.08} />
        <stop offset="80%" stopColor="#fff" stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function Front({ kit, id }: { kit: KitProduct; id: string }) {
  const stats = kitStats(kit);
  const art = (ARTS[kit.id] ?? DEFAULT_ART)(kit, id);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
      <Defs kit={kit} id={id} />
      {art}

      {/* Top label */}
      <text x={16} y={24} fontSize={8} fill="#fff" fillOpacity={0.75} style={MONO} letterSpacing={3}>
        MIDIROAD PRESENTS
      </text>
      <rect x={W - 74} y={13} width={60} height={15} rx={7.5} fill={kit.accent} />
      <text x={W - 44} y={24} textAnchor="middle" fontSize={8} fill="#000" style={MONO} fontWeight={700} letterSpacing={1.5}>
        MIDI KIT
      </text>

      {/* Stats band */}
      <rect y={H - 34} width={W} height={34} fill="#000" fillOpacity={0.85} />
      <rect y={H - 34} width={W} height={1.5} fill={kit.accent} />
      <text x={16} y={H - 13} fontSize={9} fill="#fff" style={MONO} letterSpacing={2}>
        {stats.patterns} DRUM MIDI
      </text>
      <text x={W - 16} y={H - 13} textAnchor="end" fontSize={9} fill={kit.accent} style={MONO} letterSpacing={2}>
        {stats.minBpm}–{stats.maxBpm} BPM
      </text>

      {/* Grain and shrink-wrap gloss */}
      <rect width={W} height={H} filter={`url(#${id}-grain)`} opacity={0.14} style={{ mixBlendMode: "overlay" }} />
      <rect width={W} height={H} fill={`url(#${id}-gloss)`} />
    </svg>
  );
}

function Spine({ kit }: { kit: Pick<KitProduct, "name" | "accent" | "accent2"> }) {
  const w = W * DEPTH;
  return (
    <svg viewBox={`0 0 ${w} ${H}`} className="h-full w-full" aria-hidden>
      <rect width={w} height={H} fill={kit.accent2} />
      <rect width={w} height={H} fill="#000" opacity={0.35} />
      <rect x={w - 2} width={2} height={H} fill="#fff" opacity={0.15} />
      <rect x={w / 2 - 7} y={14} width={14} height={14} rx={7} fill={kit.accent} />
      <text
        transform={`translate(${w / 2 + 5} ${H - 20}) rotate(-90)`}
        fontSize={14}
        fill="#fff"
        style={ANTON}
        letterSpacing={3}
      >
        {kit.name.toUpperCase()}
      </text>
    </svg>
  );
}

export function KitCover({
  kit,
  priority = false,
}: {
  kit: KitProduct;
  /** Kept for existing callers; the cover scales to its container. */
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

  return (
    <Box label={`${kit.name} cover`} spine={<Spine kit={kit} />}>
      <Front kit={kit} id={`kc-${kit.id}`} />
    </Box>
  );
}

/** A box seen from slightly left: front face plus spine, centered in a square. */
function Box({ label, spine, children }: { label?: string; spine: ReactNode; children: ReactNode }) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="flex aspect-square w-full items-center justify-center [perspective:1400px]"
    >
      <div
        className="relative aspect-[3/4] h-[94%] [transform-style:preserve-3d] [transform:rotateY(24deg)]"
        style={{ marginLeft: `${DEPTH * 75}%` }}
      >
        <div
          className="absolute right-full top-0 h-full origin-right [transform:rotateY(-90deg)]"
          style={{ width: `${DEPTH * 100}%` }}
        >
          {spine}
        </div>
        <div className="absolute inset-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

const BUNDLE_LOOK = { name: "The Complete Vault", accent: "#f5c542", accent2: "#3a2a05" };

/** Front of the bundle box: every kit's art as a tile under the bundle title. */
function BundleFront() {
  const id = "kc-bundle";
  const a = BUNDLE_LOOK.accent;
  const tileW = 80;
  const tileH = 107;
  const gap = 10;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor={a} stopOpacity={0.35} />
          <stop offset="100%" stopColor={a} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="50%" stopColor={a} />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.18} />
          <stop offset="35%" stopColor="#fff" stopOpacity={0} />
          <stop offset="72%" stopColor="#fff" stopOpacity={0.08} />
          <stop offset="80%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#060504" />
      <circle cx={150} cy={260} r={200} fill={`url(#${id}-glow)`} />

      {/* Every kit, as a tile */}
      {KIT_PRODUCTS.slice(0, 6).map((kit, i) => {
        const x = 20 + (i % 3) * (tileW + gap);
        const y = 40 + Math.floor(i / 3) * (tileH + gap);
        const kid = `kc-${kit.id}`;
        return (
          <g key={kit.id}>
            <svg x={x} y={y} width={tileW} height={tileH} viewBox={`0 0 ${W} ${H}`}>
              <Defs kit={kit} id={kid} />
              {(ARTS[kit.id] ?? DEFAULT_ART)(kit, kid)}
            </svg>
            <rect x={x} y={y} width={tileW} height={tileH} fill="none" stroke={a} strokeOpacity={0.5} />
          </g>
        );
      })}

      <text x={150} y={293} textAnchor="middle" fontSize={17} fill="#fff" style={ANTON} letterSpacing={10}>
        THE COMPLETE
      </text>
      <text
        x={150}
        y={352}
        textAnchor="middle"
        fontSize={64}
        fill={`url(#${id}-gold)`}
        style={ANTON}
        letterSpacing={10}
      >
        VAULT
      </text>

      {/* Top label */}
      <text x={16} y={26} fontSize={8} fill="#fff" fillOpacity={0.75} style={MONO} letterSpacing={3}>
        MIDIROAD PRESENTS
      </text>
      <rect x={W - 74} y={15} width={60} height={15} rx={7.5} fill={a} />
      <text x={W - 44} y={26} textAnchor="middle" fontSize={8} fill="#000" style={MONO} fontWeight={700} letterSpacing={1.5}>
        BUNDLE
      </text>

      {/* Stats band */}
      <rect y={H - 34} width={W} height={34} fill="#000" fillOpacity={0.85} />
      <rect y={H - 34} width={W} height={1.5} fill={a} />
      <text x={16} y={H - 13} fontSize={9} fill="#fff" style={MONO} letterSpacing={1.5}>
        {MIDI_PATTERN_COUNT} MIDI + {ONE_SHOT_COUNT} ONE-SHOTS
      </text>
      <text x={W - 16} y={H - 13} textAnchor="end" fontSize={9} fill={a} style={MONO} letterSpacing={2}>
        {KIT_PRODUCTS.length} KITS
      </text>

      <rect width={W} height={H} filter={`url(#${id}-grain)`} opacity={0.14} style={{ mixBlendMode: "overlay" }} />
      <rect width={W} height={H} fill={`url(#${id}-gloss)`} />
    </svg>
  );
}

/**
 * The bundle as a stack: two kit boxes behind, the bundle box in front.
 */
export function BundleCover() {
  const behind = [KIT_PRODUCTS[2], KIT_PRODUCTS[3]].filter(Boolean);
  return (
    <div role="img" aria-label={`${BUNDLE_LOOK.name} bundle cover`} className="relative aspect-square w-full">
      {behind[0] && (
        <div className="absolute left-[-4%] top-[2%] w-[66%] opacity-95">
          <Box spine={<Spine kit={behind[0]} />}>
            <Front kit={behind[0]} id={`kc-${behind[0].id}`} />
          </Box>
        </div>
      )}
      {behind[1] && (
        <div className="absolute right-[-6%] top-[0%] w-[66%] opacity-95">
          <Box spine={<Spine kit={behind[1]} />}>
            <Front kit={behind[1]} id={`kc-${behind[1].id}`} />
          </Box>
        </div>
      )}
      <div className="absolute bottom-[-2%] left-[14%] w-[78%] drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]">
        <Box spine={<Spine kit={BUNDLE_LOOK} />}>
          <BundleFront />
        </Box>
      </div>
    </div>
  );
}

/**
 * The bundle's poster for its product section: every kit's cover face-on,
 * in a 3 × 2 grid, each linking to its kit page.
 */
export function BundleSpread() {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {KIT_PRODUCTS.map((kit) => (
        <Link
          key={kit.id}
          href={`/kits/${kit.slug}`}
          aria-label={`${kit.name}: ${kitStats(kit).patterns} MIDI patterns`}
          className="group relative block aspect-[3/4] overflow-hidden rounded-md shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-transform duration-200 hover:-translate-y-1"
        >
          {kit.image ? (
            <Image src={kit.image} alt="" fill sizes="200px" className="object-cover" />
          ) : (
            <Front kit={kit} id={`ks-${kit.id}`} />
          )}
        </Link>
      ))}
    </div>
  );
}

export default KitCover;
