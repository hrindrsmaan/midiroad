/** A pattern row the catalog can render without shipping every waveform sample. */
export type CatalogTrack = {
  id: string;
  libraryId: string;
  title: string;
  bpm: number;
  duration: number;
  path: string;
  kitName: string;
  kitSlug: string;
  partId: string;
  partLabel: string;
  /** One hex digit per bar (0–f). Fixed length, not the raw peak array. */
  wave: string;
};

export const WAVE_BARS = 32;

/** Downsample peaks to `bars` buckets and encode each as one hex digit. */
export function waveCode(peaks: number[], bars = WAVE_BARS): string {
  let code = "";
  const count = Math.max(peaks.length, 1);
  for (let i = 0; i < bars; i++) {
    const start = Math.floor((i * count) / bars);
    const end = Math.max(start + 1, Math.floor(((i + 1) * count) / bars));
    let max = 0;
    for (let j = start; j < end && j < peaks.length; j++) max = Math.max(max, peaks[j] ?? 0);
    code += Math.max(0, Math.min(15, Math.round(max * 15))).toString(16);
  }
  return code;
}

/** One SVG path of vertical bars in a 100×24 viewBox. */
export function wavePath(code: string): string {
  const bars = Math.max(code.length, 1);
  const width = 100;
  const height = 24;
  const gap = 0.45;
  const barWidth = width / bars;
  let d = "";
  for (let i = 0; i < code.length; i++) {
    const peak = parseInt(code[i] ?? "0", 16) / 15;
    const barHeight = Math.max(1, peak * (height - 2));
    const x = i * barWidth;
    const y = (height - barHeight) / 2;
    const w = Math.max(0.35, barWidth - gap);
    d += `M${x.toFixed(2)} ${y.toFixed(2)}h${w.toFixed(2)}v${barHeight.toFixed(2)}h-${w.toFixed(2)}z`;
  }
  return d;
}
