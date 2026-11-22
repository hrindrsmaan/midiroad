"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { normalizeCart } from "@/lib/cart";
import { BUNDLE_ID } from "@/lib/products";
import { validCoupon } from "@/lib/pricing";
import * as gtag from "@/lib/gtag";

const STORAGE_KEY = "midiroad:cart";
const COUPON_KEY = "midiroad:coupon";

type CartContext = {
  ids: string[];
  /** False until the saved cart has been read, so counts don't flash. */
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  /** True when the bundle is in the cart, which already holds every kit. */
  hasBundle: boolean;
  /** The applied coupon code, if any (always a valid one). */
  coupon?: string;
  /** Applies a code; returns false if it isn't valid. */
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
};

const Ctx = createContext<CartContext | null>(null);

function load(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeCart(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Private mode or blocked storage: the cart still works for this visit.
  }
}

function loadCoupon(): string | undefined {
  try {
    return validCoupon(window.localStorage.getItem(COUPON_KEY));
  } catch {
    return undefined;
  }
}

function saveCoupon(code: string | undefined) {
  try {
    if (code) window.localStorage.setItem(COUPON_KEY, code);
    else window.localStorage.removeItem(COUPON_KEY);
  } catch {
    // Blocked storage: the coupon still applies for this visit.
  }
}

/** Cart state for the whole site, saved in the browser between visits. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | undefined>();

  useEffect(() => {
    // Read the saved cart once on mount; it isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(load());
    setCoupon(loadCoupon());
    setReady(true);
    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(load());
      if (e.key === COUPON_KEY) setCoupon(loadCoupon());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((next: (prev: string[]) => string[]) => {
    setIds((prev) => {
      const ids = normalizeCart(next(prev));
      save(ids);
      return ids;
    });
  }, []);

  const value = useMemo<CartContext>(
    () => ({
      ids,
      ready,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (id) => {
        gtag.event({ action: "add_to_cart", category: "engagement", label: id });
        update((prev) => [...prev, id]);
        setIsOpen(true);
      },
      remove: (id) => update((prev) => prev.filter((x) => x !== id)),
      clear: () => update(() => []),
      has: (id) => ids.includes(id),
      hasBundle: ids.includes(BUNDLE_ID),
      coupon,
      applyCoupon: (code) => {
        const valid = validCoupon(code);
        if (!valid) return false;
        gtag.event({ action: "apply_coupon", category: "engagement", label: valid });
        setCoupon(valid);
        saveCoupon(valid);
        return true;
      },
      removeCoupon: () => {
        setCoupon(undefined);
        saveCoupon(undefined);
      },
    }),
    [ids, ready, isOpen, update, coupon],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
