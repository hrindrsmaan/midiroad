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
      className={`px-5 py-20 md:py-28 scroll-mt-16 ${tone === "canvas" ? "bg-canvas" : "bg-background"} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Small label above a heading, led by a lit step light. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-sm font-semibold text-muted ${className}`}>
      <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-brand" />
      {children}
    </p>
  );
}

/** Section heading: eyebrow, title and an optional line of intro. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={`mb-10 md:mb-14 ${center ? "text-center" : ""}`}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 id={id} className="max-w-3xl text-[28px] leading-[1.05] md:text-[44px]">
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 max-w-xl text-base leading-relaxed text-muted ${center ? "mx-auto" : ""}`}>{intro}</p>
      )}
    </div>
  );
}
