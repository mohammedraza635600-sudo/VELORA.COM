"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = { productId: string; name: string; slug: string; price: number; size: string; qty: number };
type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">) => void;
  changeQty: (i: number, d: number) => void;
  remove: (i: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "velora_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  function add(item: Omit<CartItem, "qty">) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.productId === item.productId && p.size === item.size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }
  function changeQty(i: number, d: number) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, qty: Math.max(1, it.qty + d) } : it)));
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function clear() { setItems([]); }

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, count, subtotal, add, changeQty, remove, clear }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
