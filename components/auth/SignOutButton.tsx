"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className="h-11 rounded-key border border-line px-6 text-sm font-semibold transition-colors hover:bg-foreground/[0.03]"
    >
      Sign out
    </button>
  );
}
