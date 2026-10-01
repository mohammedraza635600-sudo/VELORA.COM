"use client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, subtotal, changeQty, remove } = useCart();

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-12 py-16">
      <h1 className="font-serif text-4xl mb-10">Your Bag</h1>
      {items.length === 0 ? (
        <p className="text-taupe text-sm">Your bag is empty. <Link href="/shop" className="underline">Continue shopping →</Link></p>
      ) : (
        <>
          {items.map((it, i) => (
            <div key={i} className="flex gap-4 py-5 border-b border-black/10">
              <div className="frame relative w-20 h-24 flex-shrink-0"><div className="bg" /></div>
              <div className="flex-1">
                <div className="text-sm">{it.name}</div>
                <div className="text-xs text-taupe mt-1">Size {it.size}</div>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => changeQty(i, -1)} className="border border-black/20 w-6 h-6 text-xs">−</button>
                  <span className="text-sm">{it.qty}</span>
                  <button onClick={() => changeQty(i, 1)} className="border border-black/20 w-6 h-6 text-xs">+</button>
                </div>
                <button onClick={() => remove(i)} className="text-[11px] text-taupe underline mt-2">Remove</button>
              </div>
              <div className="text-sm">${it.price * it.qty}</div>
            </div>
          ))}
          <div className="flex justify-between text-lg mt-8">
            <span>Subtotal</span><span>${subtotal}</span>
          </div>
          <Link href="/checkout" className="btn w-full justify-center mt-6" style={{ background: "var(--olive)", color: "var(--cream)" }}>CHECKOUT</Link>
        </>
      )}
    </div>
  );
}
