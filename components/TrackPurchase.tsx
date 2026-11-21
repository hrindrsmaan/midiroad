"use client";

import { useEffect } from "react";
import { purchase, type PurchaseItem } from "@/lib/gtag";

/** Sends the GA purchase event once per order, even if the success page is reloaded. */
export function TrackPurchase({
  transactionId,
  value,
  currency,
  items,
}: {
  transactionId: string;
  value: number;
  currency: string;
  items: PurchaseItem[];
}) {
  useEffect(() => {
    const key = `ga_purchase_${transactionId}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      // Storage blocked: still send; GA dedupes on transaction_id.
    }
    purchase({ transaction_id: transactionId, value, currency, items });
  }, [transactionId, value, currency, items]);
  return null;
}
