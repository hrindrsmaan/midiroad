import type { ReactNode } from "react";

export type Tone = "white" | "canvas";

/** A page section: consistent spacing, width and background. */
export function Section({
  id,
  tone = "white",
  className = "",
  labelledBy,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`px-5 py-20 md:py-28 scroll-mt-16 ${tone === "canvas" ? "bg-canvas" : "bg-white"} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Small uppercase label above a heading. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-brand ${className}`}>{children}</p>
  );
}

/** Section heading: eyebrow, title and an optional line of intro. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={`mb-12 md:mb-14 ${center ? "text-center" : ""}`}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-3xl md:text-[42px] leading-[1.1]">
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 max-w-xl text-base leading-relaxed text-muted ${center ? "mx-auto" : ""}`}>{intro}</p>
      )}
    </div>
  );
}
