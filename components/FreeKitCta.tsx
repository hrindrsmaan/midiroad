"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { rememberCta } from "@/components/AttributionCapture";
import type { SignupSource } from "@/lib/attribution";
import { event } from "@/lib/gtag";

const PATH = "/free-midi-kit";

/** A link to the free kit page that records which placement was clicked (GA + the signup's source). */
export function FreeKitLink({
  source,
  children,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { source: SignupSource; children: ReactNode }) {
  return (
    <Link
      href={PATH}
      {...props}
      onClick={(e) => {
        rememberCta(source);
        event({ action: "click_free_kit", category: "free_kit", label: source });
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}

/** A slim band pointing to the free kit, for the homepage, hubs, pattern pages, guides and the beat maker. */
export function FreeKitBanner({
  source,
  count,
  className = "",
}: {
  source: SignupSource;
  count: number;
  className?: string;
}) {
  return (
    <aside
      aria-label="Free MIDI kit"
      className={`flex flex-col gap-4 rounded-md border border-brand/30 bg-gradient-to-r from-brand/[0.12] to-primary/[0.10] p-5 sm:flex-row sm:items-center sm:justify-between md:px-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden className="mt-1 grid shrink-0 grid-cols-4 gap-[3px]">
          {[1, 0, 1, 1, 0, 1, 0, 1].map((on, i) => (
            <span key={i} className={`h-2 w-2 rounded-[1.5px] ${on ? "bg-brand" : "bg-foreground/[0.08]"}`} />
          ))}
        </span>
        <div>
          <p className="font-semibold text-ink">Get {count} free MIDI drum patterns</p>
          <p className="mt-0.5 text-sm text-muted">Trap, drill, dark trap and 808s. Royalty-free, sent to your inbox.</p>
        </div>
      </div>
      <FreeKitLink
        source={source}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-key bg-brand px-5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover"
      >
        Get the free kit
      </FreeKitLink>
    </aside>
  );
}
