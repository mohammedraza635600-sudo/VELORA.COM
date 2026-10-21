"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/components/WishlistContext";
import { getProductsBySlugs } from "@/app/actions";

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductsBySlugs(slugs)
      .then((res) => { if (!cancelled) setProducts(res); })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slugs]);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-12 py-16">
      <div className="mb-10">
        <div className="text-[11px] tracking-widest text-olive mb-2">SAVED FOR LATER</div>
        <h1 className="font-serif text-4xl md:text-5xl">Your Wishlist</h1>
      </div>
      {loading ? (
        <p className="text-sm text-taupe">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-taupe">
          Nothing saved yet. Tap the heart on any piece to keep it here. <a href="/shop" className="underline text-olive">Browse the collection →</a>
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
