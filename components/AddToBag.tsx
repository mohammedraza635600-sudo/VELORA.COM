"use client";
import { useState } from "react";
import { useCart } from "./CartContext";
import SizeGuide from "./SizeGuide";
import { useWishlist } from "./WishlistContext";

type Product = { id: string; name: string; slug: string; price: number; colors: string[]; stock: number };

export default function AddToBag({ product }: { product: Product }) {
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product.slug);

  function handleAdd() {
    add({ productId: product.id, name: product.name, slug: product.slug, price: product.price, size });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div>
      {product.colors.length > 0 && (
        <>
          <div className="text-[11px] tracking-widest text-taupe mt-8 mb-3">COLOR</div>
          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <span key={c} className="w-6 h-6 rounded-full inline-block border-2 border-transparent" style={{ background: c }} />
            ))}
          </div>
        </>
      )}
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="text-[11px] tracking-widest text-taupe">SIZE</div>
        <SizeGuide />
      </div>
      <div className="flex gap-2.5 flex-wrap">
        {["XS", "S", "M", "L", "XL"].map((s) => (
          <button key={s} onClick={() => setSize(s)} className={`w-11 h-11 border text-xs ${size === s ? "bg-olive border-olive text-cream" : "border-black/20"}`}>{s}</button>
        ))}
      </div>
      <button onClick={handleAdd} disabled={product.stock === 0} className="btn w-full justify-center mt-8 disabled:opacity-40" style={{ background: added ? "var(--olive-dark)" : "var(--olive)", color: "var(--cream)", borderColor: "var(--olive)" }}>
        {product.stock === 0 ? "OUT OF STOCK" : added ? "ADDED ✓" : "ADD TO BAG"}
      </button>
      <button type="button" onClick={() => toggle(product.slug)} aria-pressed={saved} className="w-full text-center text-[11px] tracking-widest text-olive mt-4 py-2.5 border border-olive/40 hover:bg-creamSoft transition-colors">
        {saved ? "♥ SAVED TO WISHLIST" : "♡ SAVE TO WISHLIST"}
      </button>
      <div className="text-xs text-taupe mt-4">Complimentary shipping on orders over ₹1,999.</div>
    </div>
  );
}
