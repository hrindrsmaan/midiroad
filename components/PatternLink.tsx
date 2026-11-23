import Link from "next/link";
import type { ReactNode } from "react";
import { PATTERNS } from "@/lib/patterns";

const PATHS = new Set(PATTERNS.map((p) => p.path));

/**
 * A link to a public pattern page from hand-written copy. Throws at build time
 * if the catalog no longer has that URL, so a guide can't ship a dead link.
 */
export function PatternLink({ path, children }: { path: string; children: ReactNode }) {
  if (!PATHS.has(path)) throw new Error(`PatternLink: no pattern page at ${path}`);
  return <Link href={path}>{children}</Link>;
}
