"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

/** Opens Stripe's billing portal: change card, see invoices, cancel. */
export function ManageBillingButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <button
        onClick={async () => {
          setBusy(true);
          setError("");
          const { error } = await authClient.subscription.billingPortal({ returnUrl: "/account" });
          if (error) {
            setError(error.message ?? "Couldn't open billing. Try again.");
            setBusy(false);
          }
        }}
        disabled={busy}
        className="h-11 rounded-key border border-strong px-6 text-sm font-semibold transition-colors hover:bg-white/5 disabled:opacity-60"
      >
        {busy ? "Opening…" : "Manage billing"}
      </button>
      {error && <p className="mt-2 text-sm text-brand">{error}</p>}
    </div>
  );
}
