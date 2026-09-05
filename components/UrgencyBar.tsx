"use client";

import { useEffect, useState } from "react";

const DEAL_MS = 24 * 60 * 60 * 1000;
const DEADLINE_KEY = "midiroad_deadline";
const STOCK_KEY = "midiroad_stock";
const INITIAL_STOCK = 12;
const MIN_STOCK = 3;

// Deterministic placeholder used during SSR and the very first client render.
// Using a fixed string ("24:00:00") guarantees the server-rendered HTML and the
// initial client render are byte-identical, eliminating hydration mismatch.
const PLACEHOLDER = { h: "24", m: "00", s: "00", expired: false };
const PLACEHOLDER_STOCK = INITIAL_STOCK;

function readNum(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const n = raw ? Number(raw) : NaN;
    if (Number.isFinite(n)) return n;
  } catch {}
  return fallback;
}
function writeNum(key: string, value: number) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {}
}

function format(ms: number) {
  if (ms <= 0) return { h: "00", m: "00", s: "00", expired: true };
  const t = Math.floor(ms / 1000);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
    expired: false,
  };
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex flex-col items-center justify-center min-w-[40px] sm:min-w-[48px] rounded-md bg-black px-2 py-1 sm:px-3 sm:py-1.5 text-white">
      <span className="font-mono text-base sm:text-lg font-black leading-none tabular-nums">{value}</span>
      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5">{label}</span>
    </span>
  );
}

export function UrgencyBar() {
  // mounted=false on the server AND on the very first client render.
  // Both renders therefore produce identical markup from the deterministic
  // PLACEHOLDER values. After hydration we flip to live ticker + localStorage.
  const [time, setTime] = useState<{ h: string; m: string; s: string; expired: boolean }>(PLACEHOLDER);
  const [stock, setStock] = useState<number>(PLACEHOLDER_STOCK);

  // One effect: subscribe to the "external system" (localStorage + clock).
  // Wrapping state updates in queueMicrotask coalesces them into a single
  // re-render and satisfies React's "subscribe then setState in callback" rule.
  useEffect(() => {
    let d = readNum(DEADLINE_KEY, NaN);
    if (!Number.isFinite(d) || d <= Date.now()) {
      d = Date.now() + DEAL_MS;
      writeNum(DEADLINE_KEY, d);
    }
    let s = readNum(STOCK_KEY, NaN);
    if (!Number.isFinite(s)) {
      s = INITIAL_STOCK;
      writeNum(STOCK_KEY, s);
    }

    queueMicrotask(() => {
      setStock(s);
      setTime(format(d - Date.now()));
    });

    const tick = () => {
      const next = format(d - Date.now());
      // If expired, roll the deadline forward before publishing.
      if (next.expired) {
        d = Date.now() + DEAL_MS;
        writeNum(DEADLINE_KEY, d);
      }
      setTime(format(d - Date.now()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const stockPct = Math.max(
    0,
    Math.min(100, ((stock - MIN_STOCK) / (INITIAL_STOCK - MIN_STOCK)) * 100),
  );

  return (
    <div className="w-full bg-[#ff90e8] border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 text-black">
          <span aria-hidden className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-base">🔥</span>
          <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider leading-tight">
            <span className="hidden sm:inline">Only </span>
            <span className="bg-black text-[#ff90e8] px-1.5 py-0.5 rounded-md" suppressHydrationWarning>{stock} left</span>
            <span className="hidden sm:inline"> at this price</span>
            <span className="mx-2 opacity-50">•</span>
            <span>Price goes up to $39.99</span>
          </p>
        </div>
        <div className="flex items-center gap-2" role="timer" aria-live="polite" suppressHydrationWarning>
          <span className="hidden sm:inline text-[11px] font-black uppercase tracking-widest text-black">Ends in</span>
          <div className="flex items-center gap-1">
            <Cell value={time.h} label="Hrs" />
            <span className="font-black text-black text-lg sm:text-xl">:</span>
            <Cell value={time.m} label="Min" />
            <span className="font-black text-black text-lg sm:text-xl">:</span>
            <Cell value={time.s} label="Sec" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-0.5 pb-2">
        <div className="h-1.5 w-full bg-black/15 rounded-full overflow-hidden border border-black/30">
          <div className="h-full bg-black transition-all duration-700 ease-out" style={{ width: `${stockPct}%` }} aria-hidden suppressHydrationWarning />
        </div>
      </div>
    </div>
  );
}

export default UrgencyBar;
