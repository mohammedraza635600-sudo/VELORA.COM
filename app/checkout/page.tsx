"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { placeOrder } from "@/app/actions";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [method, setMethod] = useState("card");
  const [done, setDone] = useState<{ orderId: string; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = `${form.get("first")} ${form.get("last")}`.trim();
    const email = String(form.get("email") || "");
    if (!name.trim() || !email) { alert("Please fill in your name and email."); return; }
    setLoading(true);
    const result = await placeOrder({
      name, email,
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      zip: String(form.get("zip") || ""),
      method,
      items: items.map((i) => ({ productId: i.productId, name: i.name, size: i.size, price: i.price, qty: i.qty })),
    });
    setLoading(false);
    setDone(result);
    clear();
  }

  if (items.length === 0 && !done) {
    return <div className="max-w-xl mx-auto px-5 py-24 text-center text-taupe text-sm">Your bag is empty. <a href="/shop" className="underline">Go shopping →</a></div>;
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <div className="text-4xl text-olive">✓</div>
        <h2 className="font-serif text-4xl mt-4 mb-2">Thank you.</h2>
        <p className="text-sm text-taupe">Order #{done.orderId.slice(-8).toUpperCase()} placed — total ${done.total}. It will now appear in the store&rsquo;s order management.</p>
        <a href="/" className="btn mt-8 inline-flex">CONTINUE SHOPPING</a>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-16">
      <a href="/cart" className="text-xs tracking-widest text-olive inline-block mb-8">← BACK TO BAG</a>
      <form onSubmit={submit} className="grid md:grid-cols-[1.2fr_.8fr] gap-14">
        <div>
          <h3 className="font-serif text-2xl mb-4">Shipping Address</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input name="first" placeholder="First name" required className="border border-black/20 p-3 text-sm bg-transparent" />
            <input name="last" placeholder="Last name" className="border border-black/20 p-3 text-sm bg-transparent" />
          </div>
          <input name="email" type="email" placeholder="Email" required className="border border-black/20 p-3 text-sm bg-transparent w-full mb-3" />
          <input name="address" placeholder="Address" className="border border-black/20 p-3 text-sm bg-transparent w-full mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input name="city" placeholder="City" className="border border-black/20 p-3 text-sm bg-transparent" />
            <input name="zip" placeholder="Postal code" className="border border-black/20 p-3 text-sm bg-transparent" />
          </div>
          <h3 className="font-serif text-2xl mt-8 mb-4">Payment</h3>
          {[["card", "💳 Credit / Debit Card"], ["upi", "📱 UPI"], ["cod", "📦 Cash on Delivery"]].map(([val, label]) => (
            <div key={val} onClick={() => setMethod(val)} className={`border p-3.5 text-sm mb-2.5 cursor-pointer ${method === val ? "border-olive bg-creamSoft" : "border-black/20"}`}>{label}</div>
          ))}
        </div>
        <div className="bg-creamSoft p-6 h-fit">
          <div className="text-xs tracking-widest text-taupe mb-4">ORDER SUMMARY</div>
          {items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm py-2"><span>{it.name} × {it.qty}</span><span>${it.price * it.qty}</span></div>
          ))}
          <div className="flex justify-between text-sm py-2"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
          <div className="flex justify-between text-base font-medium border-t border-black/15 mt-2 pt-3.5"><span>Total</span><span>${total}</span></div>
          <button type="submit" disabled={loading} className="btn w-full justify-center mt-5" style={{ background: "var(--olive)", color: "var(--cream)" }}>
            {loading ? "PLACING ORDER…" : "PLACE ORDER"}
          </button>
          <p className="text-[11px] text-taupe text-center mt-3">
            {method === "card" ? "Card payments require STRIPE_SECRET_KEY to be configured — otherwise this simulates the order." : "No payment is charged until the order is confirmed."}
          </p>
        </div>
      </form>
    </div>
  );
}
