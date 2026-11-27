import Image from "next/image";
import Link from "next/link";
import { TESTIMONIALS } from "@/lib/testimonials";

/**
 * A compact strip of YouTube comments under the buy buttons: one line per
 * comment, two per row on wider screens, so it adds social proof without
 * pushing the product details down.
 */
export function Testimonials({
  className = "",
  layout = "grid",
}: {
  className?: string;
  /** `stack` fills a tall column; `grid` stays compact beside a buy box. */
  layout?: "grid" | "stack";
}) {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <figure className={className}>
      <figcaption className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="#ff0000"
            d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8Z"
          />
          <path fill="#fff" d="m9.75 15.5 5.75-3.5-5.75-3.5v7Z" />
        </svg>
        What producers say on YouTube
        <span className="font-normal">
          &middot;{" "}
          <Link
            href="https://www.youtube.com/@midiroad"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            see the comments in context
          </Link>
        </span>
      </figcaption>
      <ul
        className={
          layout === "stack"
            ? "flex flex-col gap-3"
            : "grid grid-cols-1 gap-3 md:grid-cols-2"
        }
      >
        {TESTIMONIALS.map((t) => (
          <li
            key={t.handle}
            className={`flex min-w-0 items-start gap-3 rounded-md border border-line bg-card ${
              layout === "stack" ? "p-5" : "p-4"
            }`}
          >
            <Image
              src={t.avatar}
              alt=""
              width={40}
              height={40}
              className={`${layout === "stack" ? "h-10 w-10" : "h-9 w-9"} shrink-0 rounded-full object-cover`}
            />
            {layout === "stack" ? (
              <div className="min-w-0">
                <p className="text-pretty text-[15px] leading-relaxed text-ink">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-1.5 text-xs text-muted">{t.handle}</p>
              </div>
            ) : (
              <p className="min-w-0 text-sm leading-snug">
                <span className="text-ink">&ldquo;{t.text}&rdquo;</span>{" "}
                <span className="text-muted">{t.handle}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default Testimonials;
