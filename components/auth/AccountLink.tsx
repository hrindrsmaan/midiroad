"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

/** "Sign in" or "Account" in the nav, read client-side so pages stay static. */
export function AccountLink() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <span className="w-14" aria-hidden />;
  return (
    <Link
      href={data ? "/account" : "/login"}
      className="text-sm font-medium text-muted transition-colors hover:text-ink"
    >
      {data ? "Account" : "Sign in"}
    </Link>
  );
}
