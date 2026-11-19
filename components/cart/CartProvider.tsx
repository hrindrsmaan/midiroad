"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { normalizeCart } from "@/lib/cart";
import { BUNDLE_ID } from "@/lib/products";
import * as gtag from "@/lib/gtag";

const STORAGE_KEY = "midiroad:cart";

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

/** Cart state for the whole site, saved in the browser between visits. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read the saved cart once on mount; it isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(load());
    setReady(true);
    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(load());
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
    }),
    [ids, ready, isOpen, update],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
