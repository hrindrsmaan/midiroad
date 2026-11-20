"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { event } from "@/lib/gtag";

/** A Next.js link that sends a Google Analytics event when clicked. */
export function TrackedLink({
  track,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { track: { action: string; category: string; label: string } }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        event(track);
        onClick?.(e);
      }}
    />
  );
}
