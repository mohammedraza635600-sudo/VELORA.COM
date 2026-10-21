"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Wishlist is stored in the visitor's own browser (localStorage), same approach as
// the cart — no login needed. It only holds product slugs; the /wishlist page loads
// the live product details (price, stock, images) from the database.
type WishCtx = {
  slugs: string[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
};

const Ctx = createContext<WishCtx | null>(null);
const KEY = "velora_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSlugs(parsed.filter((s) => typeof s === "string"));
      }
    } catch {}
  }, []);

  function persist(next: string[]) {
    setSlugs(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }

  const has = (slug: string) => slugs.includes(slug);
  const toggle = (slug: string) => persist(has(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug]);
  const remove = (slug: string) => persist(slugs.filter((s) => s !== slug));

  return <Ctx.Provider value={{ slugs, count: slugs.length, has, toggle, remove }}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
