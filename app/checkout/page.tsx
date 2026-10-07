"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { placeOrder } from "@/app/actions";

const WHATSAPP_NUMBER = "918200890373";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [method, setMethod] = useState("whatsapp");
  const [done, setDone] = useState<{ orderId: string; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  function buildWhatsAppMessage(orderId: string, name: string, address: string, city: string, zip: string) {
    const lines = [
      `*New VELORA Order* — #${orderId.slice(-8).toUpperCase()}`,
      ``,
      `*Customer:* ${name}`,
      `*Delivery Address:* ${address}${city ? ", " + city : ""}${zip ? " - " + zip : ""}`,
      ``,
      `*Items:*`,
      ...items.map((it) => `• ${it.name} (Size ${it.size}) × ${it.qty} — $${it.price * it.qty}`),
      ``,
      `Shipping: ${shipping === 0 ? "Free" : "$" + shipping}`,
      `*Total: $${total}*`,
      ``,
      `Please confirm this order and share payment details. Thank you!`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = `${form.get("first")} ${form.get("last")}`.trim();
    const email = String(form.get("email") || "");
    const address = String(form.get("address") || "");
    const city = String(form.get("city") || "");
    const zip = String(form.get("zip") || "");
    if (!name.trim() || !email) { alert("Please fill in your name and email."); return; }
    setLoading(true);
    const result = await placeOrder({
      name, email, address, city, zip,
      method,
      items: items.map((i) => ({ productId: i.productId, name: i.name, size: i.size, price: i.price, qty: i.qty })),
    });
    setLoading(false);
    setDone(result);
    clear();

    if (method === "whatsapp") {
      const msg = buildWhatsAppMessage(result.orderId, name, address, city, zip);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }
  }

  if (items.length === 0 && !done) {
    return <div className="max-w-xl mx-auto px-5 py-24 text-center text-taupe text-sm">Your bag is empty. <a href="/shop" className="underline">Go shopping →</a></div>;
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <div className="text-4xl text-olive">✓</div>
        <h2 className="font-serif text-4xl mt-4 mb-2">Thank you.</h2>
        <p className="text-sm text-taupe">Order #{done.orderId.slice(-8).toUpperCase()} placed — total ${done.total}.</p>
        {method === "whatsapp" ? (
          <p className="text-sm text-taupe mt-2">We&rsquo;ve opened WhatsApp with your order details — please hit send to confirm with us. If it didn&rsquo;t open, <a className="underline text-olive" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">tap here</a>.</p>
        ) : (
          <p className="text-sm text-taupe mt-2">It will now appear in the store&rsquo;s order management.</p>
        )}
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
          {[["whatsapp", "💬 Confirm Order via WhatsApp"], ["cod", "📦 Cash on Delivery"]].map(([val, label]) => (
            <div key={val} onClick={() => setMethod(val)} className={`border p-3.5 text-sm mb-2.5 cursor-pointer transition-colors ${method === val ? "border-olive bg-creamSoft" : "border-black/20"}`}>{label}</div>
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
            {loading ? "PLACING ORDER…" : method === "whatsapp" ? "PLACE ORDER & OPEN WHATSAPP" : "PLACE ORDER"}
          </button>
          <p className="text-[11px] text-taupe text-center mt-3">
            {method === "whatsapp" ? "We'll open WhatsApp with your order summary pre-filled — just hit send to confirm." : "Pay in cash when your order is delivered."}
          </p>
        </div>
      </form>
    </div>
  );
}
