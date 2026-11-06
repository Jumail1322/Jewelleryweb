"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string | null;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

// v2: variant ids are backend UUIDs (v1 held Shopify numeric ids)
const STORAGE_KEY = "ornmnt-cart-v2";
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load after mount so server and client render the same empty cart first
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage unavailable (private mode) — cart still works for this visit
    }
  }, [lines, hydrated]);

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) => (l.variantId === line.variantId ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { ...line, quantity }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, isOpen, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
