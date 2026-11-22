import Image from "next/image";
import { TESTIMONIALS } from "@/lib/testimonials";

/**
 * A compact strip of YouTube comments under the buy buttons: one line per
 * comment, two per row on wider screens, so it adds social proof without
 * pushing the product details down.
 */
export function Testimonials({ className = "" }: { className?: string }) {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <figure className={`rounded-md border border-line px-4 py-3 ${className}`}>
      <figcaption className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="#ff0000"
            d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8Z"
          />
          <path fill="#fff" d="m9.75 15.5 5.75-3.5-5.75-3.5v7Z" />
        </svg>
        What producers say on YouTube
      </figcaption>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <li key={t.handle} className="flex min-w-0 items-center gap-2">
            <Image
              src={t.avatar}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] shrink-0 rounded-full object-cover"
            />
            <p className="min-w-0 text-[13px] leading-snug">
              <span className="text-ink">&ldquo;{t.text}&rdquo;</span>{" "}
              <span className="text-muted">{t.handle}</span>
            </p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default Testimonials;
