import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { KIT_PRODUCTS, kitStats, type KitProduct } from "@/lib/products";

/**
 * Kit covers, drawn as glossy product boxes in one series.
 *
 * Every front shares the same furniture: a big Anton title in the top band,
 * lit from below in the kit's accent; one glossy object in the middle with a
 * bloom behind it; and a black label strip with MIDIROAD, a 16-step pattern
 * and the catalogue number. What changes per kit is the ground colour, the
 * accent and the object.
 *
 * All of it is SVG on fixed viewBoxes (front 300 × 400, box 360 × 436), so
 * type and art scale together from 64px in the cart to 400px on a kit page.
 */

const W = 300;
const H = 400;
/** The box: a 44px spine on the left, the front face beside it. */
const BOX_W = 360;
const BOX_H = 436;
const BOX_H_REFLECT = 520;

const ANTON = { fontFamily: "var(--font-anton), Impact, sans-serif" };
const ROBOTO = { fontFamily: "var(--font-roboto), Roboto, sans-serif" };
const MONO = { fontFamily: "var(--font-space-grotesk), ui-monospace, monospace" };

/** Deterministic PRNG so the server and the client draw the same details. */
function rng(seed: string) {
  let s = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}
const r1 = (n: number) => Math.round(n * 10) / 10;

type Look = Pick<KitProduct, "id" | "name" | "accent" | "accent2">;

type Motif = { defs?: ReactNode; body: ReactNode };

type Spec = {
  /** Small tracked line above the title. */
  small: string;
  /** The title in the top band. */
  big: string;
  /** Genre, after "MIDI DRUM KIT ·". */
  category: string;
  motif: (kit: Look, id: string) => Motif;
};

/** A chrome-ball gradient tinted with the kit's colours. */
function chrome(id: string, kit: Look) {
  return (
    <radialGradient id={id} cx="0.36" cy="0.3" r="0.75">
      <stop offset="0" stopColor="#fff" />
      <stop offset="0.18" stopColor={kit.accent} stopOpacity={0.95} />
      <stop offset="0.62" stopColor={kit.accent2} />
      <stop offset="1" stopColor="#050505" />
    </radialGradient>
  );
}

const SPECS: Record<string, Spec> = {
  essentials: {
    small: "VAULT",
    big: "ESSENTIALS",
    category: "TRAP · DRILL · RNB",
    // A piano roll in perspective, a chrome sun on the horizon, notes riding the lanes.
    motif: (kit, id) => {
      const a = kit.accent;
      const hz = 190;
      const random = rng(kit.id);
      const notes = Array.from({ length: 14 }, () => {
        const lane = Math.floor(random() * 8);
        const t = 0.15 + random() * 0.8;
        const y = hz + t ** 1.8 * 150;
        const xc = 150 + (-60 + (lane + 0.5) * 52.5 - 150) * ((y - hz) / 150);
        const w = 10 + t * 30;
        const h = 2 + t * 6;
        return { x: r1(xc - w / 2), y: r1(y - h), w: r1(w), h: r1(h), o: r1(0.55 + t * 0.45) };
      });
      return {
        defs: chrome(`${id}-sun`, kit),
        body: (
          <>
            <circle cx={150} cy={168} r={62} fill={a} fillOpacity={0.18} filter={`url(#${id}-soft)`} />
            <circle cx={150} cy={168} r={44} fill={`url(#${id}-sun)`} />
            <rect y={hz - 1} width={W} height={150} fill={kit.accent2} fillOpacity={0.85} />
            <rect y={hz - 1} width={W} height={1.6} fill={a} filter={`url(#${id}-glow)`} />
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`l${i}`}
                x1={150}
                y1={hz}
                x2={r1(-60 + i * 52.5)}
                y2={340}
                stroke={a}
                strokeOpacity={i === 4 ? 0.5 : 0.28}
                strokeWidth={i % 4 === 0 ? 1.4 : 0.8}
              />
            ))}
            {Array.from({ length: 9 }, (_, i) => {
              const t = ((i + 1) / 9) ** 1.8;
              const y = r1(hz + t * 150);
              return <line key={`r${i}`} x1={0} y1={y} x2={W} y2={y} stroke={a} strokeOpacity={r1(0.12 + t * 0.3)} strokeWidth={0.8} />;
            })}
            {notes.map((n, i) => (
              <rect key={`n${i}`} x={n.x} y={n.y} width={n.w} height={n.h} rx={1.5} fill={a} fillOpacity={n.o} filter={`url(#${id}-glow)`} />
            ))}
          </>
        ),
      };
    },
  },
  "black-market": {
    small: "BLACK MARKET",
    big: "HEIST",
    category: "STREET TRAP",
    // A chrome vault dial behind two crossed hazard tapes.
    motif: (kit, id) => {
      const a = kit.accent;
      const tape = (rot: number, y: number) => (
        <g transform={`rotate(${rot} 150 ${y})`}>
          <rect x={-80} y={y - 15} width={460} height={30} fill={`url(#${id}-haz)`} />
          <rect x={-80} y={y - 15} width={460} height={30} fill={`url(#${id}-sheen)`} />
          <text
            x={150}
            y={y + 4.5}
            textAnchor="middle"
            fontSize={13}
            letterSpacing={3}
            fill="#0d0a04"
            stroke={a}
            strokeWidth={3}
            paintOrder="stroke"
            style={ANTON}
          >
            DO NOT CROSS · MIDIROAD · DO NOT CROSS
          </text>
        </g>
      );
      return {
        defs: (
          <>
            {chrome(`${id}-dial`, kit)}
            <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5a4208" />
              <stop offset="0.5" stopColor="#ffe7a3" />
              <stop offset="1" stopColor="#5a4208" />
            </linearGradient>
            <pattern id={`${id}-haz`} width={22} height={30} patternUnits="userSpaceOnUse" patternTransform="skewX(-35)">
              <rect width={22} height={30} fill="#141008" />
              <rect width={11} height={30} fill={a} />
            </pattern>
            <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
              <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
              <stop offset="1" stopColor="#000" stopOpacity={0.35} />
            </linearGradient>
          </>
        ),
        body: (
          <>
            <circle cx={150} cy={210} r={100} fill={a} fillOpacity={0.16} filter={`url(#${id}-soft)`} />
            <circle cx={150} cy={210} r={88} fill={`url(#${id}-dial)`} stroke={a} strokeOpacity={0.6} strokeWidth={2} />
            {Array.from({ length: 60 }, (_, i) => {
              const ang = (i / 60) * Math.PI * 2;
              const major = i % 5 === 0;
              const r0 = major ? 70 : 75;
              return (
                <line
                  key={i}
                  x1={r1(150 + Math.cos(ang) * r0)}
                  y1={r1(210 + Math.sin(ang) * r0)}
                  x2={r1(150 + Math.cos(ang) * 80)}
                  y2={r1(210 + Math.sin(ang) * 80)}
                  stroke="#f3e6c4"
                  strokeOpacity={major ? 0.9 : 0.4}
                  strokeWidth={major ? 1.6 : 0.8}
                />
              );
            })}
            <circle cx={150} cy={210} r={62} fill="#0d0a04" fillOpacity={0.55} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={146} y={150} width={8} height={120} rx={4} fill={`url(#${id}-bar)`} transform={`rotate(${i * 60 + 15} 150 210)`} />
            ))}
            <circle cx={150} cy={210} r={18} fill={`url(#${id}-dial)`} stroke="#ffe7a3" strokeWidth={1.2} />
            {tape(-16, 175)}
            {tape(12, 262)}
          </>
        ),
      };
    },
  },
  odyssey: {
    small: "MIDNIGHT",
    big: "ODYSSEY",
    category: "MELODIC TRAP",
    // A ringed planet in a star field.
    motif: (kit, id) => {
      const a = kit.accent;
      const random = rng(kit.id);
      const stars = Array.from({ length: 46 }, () => ({
        x: r1(random() * W),
        y: r1(100 + random() * 240),
        r: r1(0.4 + random() * 1.2),
        o: r1(0.3 + random() * 0.7),
      }));
      return {
        defs: (
          <>
            {chrome(`${id}-planet`, kit)}
            <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={a} stopOpacity={0.1} />
              <stop offset="0.5" stopColor="#e6e1ff" />
              <stop offset="1" stopColor={a} stopOpacity={0.1} />
            </linearGradient>
          </>
        ),
        body: (
          <>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" fillOpacity={s.o} />
            ))}
            <circle cx={150} cy={215} r={96} fill={a} fillOpacity={0.22} filter={`url(#${id}-soft)`} />
            <g transform="rotate(-18 150 215)">
              <ellipse cx={150} cy={215} rx={132} ry={26} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={7} strokeOpacity={0.55} />
            </g>
            <circle cx={150} cy={215} r={70} fill={`url(#${id}-planet)`} />
            <path d="M88 190 Q150 176 212 190 M82 218 Q150 204 218 218 M90 246 Q150 232 210 246" stroke="#fff" strokeOpacity={0.12} strokeWidth={5} fill="none" />
            <g transform="rotate(-18 150 215)">
              <path d="M18 215 A132 26 0 0 0 282 215" fill="none" stroke={`url(#${id}-ring)`} strokeWidth={7} />
              <path d="M30 218 A120 22 0 0 0 270 218" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1} />
            </g>
            <circle cx={236} cy={132} r={9} fill={`url(#${id}-planet)`} />
          </>
        ),
      };
    },
  },
  psycho: {
    small: "WARD",
    big: "PSYCHO",
    category: "DARK TRAP",
    // A glossy cross that drips, on a scratched ground.
    motif: (kit, id) => {
      const a = kit.accent;
      const random = rng(kit.id);
      const scratches = Array.from({ length: 18 }, () => {
        const x = random() * W;
        const y = 100 + random() * 250;
        return { x1: r1(x), y1: r1(y), x2: r1(x + 6 + random() * 22), y2: r1(y + (random() - 0.5) * 8), o: r1(0.08 + random() * 0.2) };
      });
      const drips = Array.from({ length: 9 }, () => {
        const x = 112 + random() * 76;
        const len = 14 + random() * 40;
        const top = 290;
        return `M${r1(x - 3)} ${top} L${r1(x - 2)} ${r1(top + len)} Q${r1(x)} ${r1(top + len + 7)} ${r1(x + 2)} ${r1(top + len)} L${r1(x + 3)} ${top} Z`;
      });
      return {
        defs: (
          <linearGradient id={`${id}-blood`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd1d8" />
            <stop offset="0.25" stopColor={a} />
            <stop offset="0.7" stopColor="#8a0a1f" />
            <stop offset="1" stopColor="#2a0208" />
          </linearGradient>
        ),
        body: (
          <>
            {scratches.map((s, i) => (
              <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#ffd7dd" strokeOpacity={s.o} strokeWidth={0.7} />
            ))}
            <circle cx={150} cy={210} r={104} fill={a} fillOpacity={0.2} filter={`url(#${id}-soft)`} />
            <path
              d="M126 112 H174 V176 H226 V224 H174 V292 H126 V224 H74 V176 H126 Z"
              fill={`url(#${id}-blood)`}
              stroke="#ffd1d8"
              strokeOpacity={0.6}
              strokeWidth={1.2}
            />
            <path d="M130 116 H170 V180" stroke="#fff" strokeOpacity={0.55} strokeWidth={2} fill="none" />
            {drips.map((d, i) => (
              <path key={i} d={d} fill={`url(#${id}-blood)`} />
            ))}
          </>
        ),
      };
    },
  },
  decoy: {
    small: "PROTOCOL",
    big: "DECOY",
    category: "DRILL",
    // A targeting reticle with a radar sweep and a locked target.
    motif: (kit, id) => {
      const a = kit.accent;
      const bracket = (x: number, y: number, sx: number, sy: number) => (
        <path d={`M${x} ${y + sy * 18} V${y} H${x + sx * 18}`} stroke={a} strokeWidth={2.4} fill="none" filter={`url(#${id}-glow)`} />
      );
      return {
        defs: (
          <>
            <radialGradient id={`${id}-core`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.35" stopColor={a} />
              <stop offset="1" stopColor={a} stopOpacity={0} />
            </radialGradient>
            <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={a} stopOpacity={0} />
              <stop offset="1" stopColor={a} stopOpacity={0.45} />
            </linearGradient>
          </>
        ),
        body: (
          <>
            {Array.from({ length: 60 }, (_, i) => (
              <rect key={i} y={100 + i * 4} width={W} height={1} fill={a} fillOpacity={0.05} />
            ))}
            <circle cx={150} cy={212} r={110} fill={a} fillOpacity={0.12} filter={`url(#${id}-soft)`} />
            <path d="M150 212 L246 212 A96 96 0 0 0 218 144 Z" fill={`url(#${id}-sweep)`} />
            {[96, 72, 48].map((r, i) => (
              <circle
                key={r}
                cx={150}
                cy={212}
                r={r}
                fill="none"
                stroke={a}
                strokeOpacity={0.35 + i * 0.2}
                strokeWidth={i === 2 ? 1.6 : 1}
                strokeDasharray={i === 0 ? "3 5" : undefined}
              />
            ))}
            <line x1={30} y1={212} x2={270} y2={212} stroke={a} strokeOpacity={0.5} strokeWidth={0.8} />
            <line x1={150} y1={98} x2={150} y2={326} stroke={a} strokeOpacity={0.5} strokeWidth={0.8} />
            {bracket(92, 154, 1, 1)}
            {bracket(208, 154, -1, 1)}
            {bracket(92, 270, 1, -1)}
            {bracket(208, 270, -1, -1)}
            <circle cx={182} cy={186} r={16} fill={`url(#${id}-core)`} />
            <text x={200} y={176} fontSize={7} letterSpacing={1.2} fill={a} style={MONO}>
              LOCK 0.98
            </text>
          </>
        ),
      };
    },
  },
  focus: {
    small: "FOCUS",
    big: "808 LAB",
    category: "808 BASS",
    // A speaker cone with a chrome dust cap.
    motif: (kit, id) => {
      const a = kit.accent;
      return {
        defs: (
          <>
            {chrome(`${id}-cap`, kit)}
            <radialGradient id={`${id}-cone`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.3" stopColor="#0a0308" />
              <stop offset="0.85" stopColor="#2a0a24" />
              <stop offset="1" stopColor={a} stopOpacity={0.6} />
            </radialGradient>
            <radialGradient id={`${id}-surr`} cx="0.45" cy="0.4" r="0.6">
              <stop offset="0.7" stopColor="#3a1032" />
              <stop offset="0.86" stopColor={a} stopOpacity={0.85} />
              <stop offset="1" stopColor="#14040f" />
            </radialGradient>
          </>
        ),
        body: (
          <>
            <circle cx={150} cy={214} r={124} fill={a} fillOpacity={0.2} filter={`url(#${id}-soft)`} />
            <circle cx={150} cy={214} r={116} fill="#120410" stroke={a} strokeOpacity={0.4} />
            {Array.from({ length: 8 }, (_, i) => {
              const ang = (i / 8) * Math.PI * 2 + Math.PI / 8;
              return <circle key={i} cx={r1(150 + Math.cos(ang) * 106)} cy={r1(214 + Math.sin(ang) * 106)} r={3.4} fill={`url(#${id}-cap)`} />;
            })}
            <circle cx={150} cy={214} r={96} fill={`url(#${id}-surr)`} />
            <circle cx={150} cy={214} r={80} fill={`url(#${id}-cone)`} />
            {[66, 54, 42].map((r) => (
              <circle key={r} cx={150} cy={214} r={r} fill="none" stroke={a} strokeOpacity={0.18} />
            ))}
            <circle cx={150} cy={214} r={30} fill={`url(#${id}-cap)`} />
            <ellipse cx={140} cy={203} rx={10} ry={6} fill="#fff" fillOpacity={0.55} />
          </>
        ),
      };
    },
  },
};

/** Any kit without its own art: the name as the title and a lit orb. */
function specFor(kit: Look): Spec {
  return (
    SPECS[kit.id] ?? {
      small: "MIDIROAD",
      big: kit.name.toUpperCase(),
      category: "TRAP",
      motif: (k, id) => ({
        defs: chrome(`${id}-orb`, k),
        body: (
          <>
            <circle cx={150} cy={214} r={100} fill={k.accent} fillOpacity={0.2} filter={`url(#${id}-soft)`} />
            <circle cx={150} cy={214} r={62} fill={`url(#${id}-orb)`} />
          </>
        ),
      }),
    }
  );
}

/** The catalogue number: MR-001 … MR-006 in kit order. */
function catalogueNumber(kit: Look) {
  const index = KIT_PRODUCTS.findIndex((product) => product.id === kit.id);
  return index < 0 ? "MR-000" : `MR-${String(index + 1).padStart(3, "0")}`;
}

/** The 16 steps printed on every label strip. */
const LABEL_STEPS = new Set([0, 3, 6, 8, 10, 12, 14, 15]);

/** The front face's contents, drawn in a 300 × 400 space. */
function FrontArt({ kit, id }: { kit: Look; id: string }) {
  const spec = specFor(kit);
  const motif = spec.motif(kit, id);
  const a = kit.accent;
  const titleWidth = spec.big.length > 6 ? 262 : Math.min(262, spec.big.length * 42);
  const title = (extra: Record<string, unknown>) => (
    <text
      x={150}
      y={92}
      textAnchor="middle"
      fontSize={64}
      textLength={titleWidth}
      lengthAdjust="spacingAndGlyphs"
      style={ANTON}
      {...extra}
    >
      {spec.big}
    </text>
  );
  return (
    <>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect width={W} height={H} rx={3} />
        </clipPath>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={2.2} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" />
        </filter>
        <linearGradient id={`${id}-title`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor={a} />
        </linearGradient>
        <linearGradient id={`${id}-scrim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050505" stopOpacity={0.92} />
          <stop offset="1" stopColor="#050505" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.16} />
          <stop offset="0.38" stopColor="#fff" stopOpacity={0.02} />
          <stop offset="0.4" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.05} />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.52" r="0.72">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.6} />
        </radialGradient>
        {motif.defs}
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {/* Ground: the kit's deep tone under a dark wash, so no two boxes are the same black. */}
        <rect width={W} height={H} fill={kit.accent2} />
        <rect width={W} height={H} fill="#0a0a0a" fillOpacity={0.5} />
        {motif.body}
        <rect width={W} height={H} fill={`url(#${id}-vig)`} />
        <rect width={W} height={130} fill={`url(#${id}-scrim)`} />

        <text x={150} y={30} textAnchor="middle" fontSize={9} fontWeight={700} letterSpacing={4.5} fill={a} style={ROBOTO}>
          {spec.small}
        </text>
        {title({ fill: a, fillOpacity: 0.55, filter: `url(#${id}-soft)` })}
        {title({ fill: `url(#${id}-title)`, stroke: "#000", strokeOpacity: 0.35, strokeWidth: 1 })}
        <text x={150} y={108} textAnchor="middle" fontSize={7.5} fontWeight={500} letterSpacing={2.6} fill="#fff" fillOpacity={0.72} style={ROBOTO}>
          MIDI DRUM KIT · {spec.category}
        </text>

        {/* The label strip, the same on every box. */}
        <rect y={352} width={W} height={48} fill="#050505" fillOpacity={0.88} />
        <rect y={352} width={W} height={1} fill={a} fillOpacity={0.6} />
        <text x={14} y={381} fontSize={10} fontWeight={900} letterSpacing={1.6} fill="#fff" style={ROBOTO}>
          MIDIROAD
        </text>
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x={100 + i * 6.4}
            y={377}
            width={4.4}
            height={4.4}
            rx={1}
            fill={LABEL_STEPS.has(i) ? a : "#fff"}
            fillOpacity={LABEL_STEPS.has(i) ? 0.95 : 0.16}
          />
        ))}
        <text x={286} y={381} textAnchor="end" fontSize={8} letterSpacing={1.2} fill={a} style={MONO}>
          {catalogueNumber(kit)}
        </text>

        {/* Print texture and the gloss. */}
        <rect width={W} height={H} filter={`url(#${id}-grain)`} />
        <rect width={W} height={H} fill={`url(#${id}-gloss)`} />
        <rect x={6} y={6} width={288} height={388} rx={2} fill="none" stroke="#fff" strokeOpacity={0.1} />
      </g>
    </>
  );
}

/** The box seen from slightly left: spine, front and, on posters, a floor reflection. */
function BoxSvg({ kit, id, reflect = false, className }: { kit: Look; id: string; reflect?: boolean; className?: string }) {
  const spec = specFor(kit);
  return (
    <svg viewBox={`0 0 ${BOX_W} ${reflect ? BOX_H_REFLECT : BOX_H}`} className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}-spine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor={kit.accent2} />
        </linearGradient>
        <filter id={`${id}-floor`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        {reflect && (
          <>
            <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.28} />
              <stop offset="0.3" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id={`${id}-mask`}>
              <rect y={424} width={BOX_W} height={96} fill={`url(#${id}-fade)`} />
            </mask>
          </>
        )}
      </defs>
      <ellipse cx={200} cy={428} rx={170} ry={9} fill="#000" fillOpacity={0.35} filter={`url(#${id}-floor)`} />
      <polygon points="8,40 44,24 44,424 8,410" fill={`url(#${id}-spine)`} />
      <polygon points="8,40 44,24 44,424 8,410" fill="none" stroke={kit.accent} strokeOpacity={0.35} strokeWidth={0.8} />
      <text transform="translate(30 226) rotate(-90)" textAnchor="middle" fontSize={15} letterSpacing={3} fill={kit.accent} style={ANTON}>
        {spec.big} · {catalogueNumber(kit)}
      </text>
      <g transform="translate(44 24)">
        <FrontArt kit={kit} id={id} />
      </g>
      {reflect && (
        <g mask={`url(#${id}-mask)`}>
          <g transform="translate(44 848) scale(1 -1)">
            <rect width={W} height={H} fill={kit.accent2} />
            <rect width={W} height={H} fill="#0a0a0a" fillOpacity={0.4} />
            <rect y={352} width={W} height={48} fill="#050505" />
          </g>
        </g>
      )}
    </svg>
  );
}

export function KitCover({
  kit,
  priority = false,
  idPrefix = "kc",
}: {
  kit: KitProduct;
  /**
   * Prefix for the SVG's gradient and filter ids. Give a second copy of the same
   * kit on one page its own, so a hidden copy can't take the visible one's art.
   */
  idPrefix?: string;
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
    <div role="img" aria-label={`${kit.name} cover`} className="flex aspect-square w-full items-center justify-center">
      <BoxSvg kit={kit} id={`${idPrefix}-${kit.id}`} className="h-[96%] w-auto max-w-full" />
    </div>
  );
}

/** Just the front face, flat at 3:4 (the bundle spread). */
function Front({ kit, id }: { kit: Look; id: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <FrontArt kit={kit} id={id} />
    </svg>
  );
}


/** Back row, then front row, as on the Vault poster. */
const STACK_BACK = ["black-market", "odyssey", "psycho"];
const STACK_FRONT = ["decoy", "essentials", "focus"];

/**
 * Every kit's box in two rows, the way the Vault poster shows them.
 * Drawn in a 760 × 500 space (560 with the floor reflection) and scaled to its container.
 */
export function VaultStack({ reflect = false, idPrefix = "vs" }: { reflect?: boolean; idPrefix?: string }) {
  const byId = (id: string) => KIT_PRODUCTS.find((k) => k.id === id);
  const back = STACK_BACK.map(byId).filter((k): k is KitProduct => Boolean(k));
  const front = STACK_FRONT.map(byId).filter((k): k is KitProduct => Boolean(k));
  const spaceH = reflect ? 560 : 500;
  // Positions in percent of the space: back boxes 230 wide, front 262.
  const place = (i: number, step: number, w: number, top: number) => ({
    left: `${((380 + (i - 1) * step - w / 2) / 760) * 100}%`,
    top: `${(top / spaceH) * 100}%`,
    width: `${(w / 760) * 100}%`,
  });
  return (
    <div className="relative w-full" style={{ aspectRatio: `760 / ${spaceH}` }} aria-hidden>
      {back.map((kit, i) => (
        <div key={kit.id} className="absolute" style={place(i, 205, 230, 0)}>
          <BoxSvg kit={kit} id={`${idPrefix}-b-${kit.id}`} className="block h-auto w-full" />
        </div>
      ))}
      {front.map((kit, i) => (
        <div key={kit.id} className="absolute" style={place(i, 232, 262, 172)}>
          <BoxSvg kit={kit} id={`${idPrefix}-f-${kit.id}`} reflect={reflect} className="block h-auto w-full" />
        </div>
      ))}
    </div>
  );
}

/** The bundle's cover in grids and the cart: all six boxes stacked in a square. */
export function BundleCover() {
  return (
    <div role="img" aria-label="The Complete Vault: all six kit boxes" className="flex aspect-square w-full items-center justify-center">
      <div className="w-full">
        <VaultStack idPrefix="bc" />
      </div>
    </div>
  );
}

/**
 * The bundle's poster for its product section: every kit's front face-on,
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
          className="group relative block aspect-[3/4] overflow-hidden rounded-md shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] ring-1 ring-foreground/10 transition-transform duration-200 hover:-translate-y-1"
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
