"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { placeOrder, validateCoupon } from "@/app/actions";

const WHATSAPP_NUMBER = "918200890373";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [method, setMethod] = useState("whatsapp");
  const [done, setDone] = useState<{ orderId: string; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; type: string; discount: number; message: string } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  // Keep these in sync with app/actions.ts placeOrder() — both must agree so the
  // total shown here matches what actually gets saved on the order.
  const FREE_SHIPPING_OVER = 1999;
  const SHIPPING_FEE = 99;
  const discount = coupon?.discount || 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = coupon?.type === "free_shipping" || afterDiscount > FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = afterDiscount + shipping;

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponBusy(true);
    setCouponMsg("");
    const res = await validateCoupon(couponInput, subtotal);
    setCouponBusy(false);
    if (res.ok) {
      setCoupon({ code: res.code!, type: res.type!, discount: res.discount!, message: res.message! });
      setCouponMsg(res.message);
    } else {
      setCoupon(null);
      setCouponMsg(res.message);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponMsg("");
  }

  // Built from what the server actually saved (real prices, discount, shipping, total),
  // so the WhatsApp message always matches the order even if a price changed meanwhile.
  function buildWhatsAppMessage(r: Awaited<ReturnType<typeof placeOrder>>, name: string, phone: string, address: string, city: string, zip: string) {
    const lines = [
      `*New VELORA Order* — #${r.orderId.slice(-8).toUpperCase()}`,
      ``,
      `*Customer:* ${name}`,
      ...(phone ? [`*Phone:* ${phone}`] : []),
      `*Delivery Address:* ${address}${city ? ", " + city : ""}${zip ? " - " + zip : ""}`,
      ``,
      `*Items:*`,
      ...r.items.map((it) => `• ${it.name} (Size ${it.size}) × ${it.qty} — ₹${it.price * it.qty}`),
      ``,
      ...(r.discount > 0 ? [`Discount: -₹${r.discount}`] : []),
      `Shipping: ${r.shipping === 0 ? "Free" : "₹" + r.shipping}`,
      `*Total: ₹${r.total}*`,
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
    const phone = String(form.get("phone") || "");
    const address = String(form.get("address") || "");
    const city = String(form.get("city") || "");
    const zip = String(form.get("zip") || "");
    if (!name.trim() || !email) { alert("Please fill in your name and email."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await placeOrder({
        name, email, phone, address, city, zip,
        method,
        couponCode: coupon?.code,
        items: items.map((i) => ({ productId: i.productId, name: i.name, size: i.size, price: i.price, qty: i.qty })),
      });
      setLoading(false);
      setDone(result);
      clear();

      if (method === "whatsapp") {
        const msg = buildWhatsAppMessage(result, name, phone, address, city, zip);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message?.replace(/^Error:\s*/, "") || "Something went wrong placing your order. Please try again.");
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
        <p className="text-sm text-taupe">Order #{done.orderId.slice(-8).toUpperCase()} placed — total ₹{done.total}.</p>
        {method === "whatsapp" ? (
          <p className="text-sm text-taupe mt-2">We&rsquo;ve opened WhatsApp with your order details — please hit send to confirm with us. If it didn&rsquo;t open, <a className="underline text-olive" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">tap here</a>.</p>
        ) : (
          <p className="text-sm text-taupe mt-2">It will now appear in the store&rsquo;s order management.</p>
        )}
        <div className="flex gap-3 justify-center mt-8">
          <a href="/" className="btn">CONTINUE SHOPPING</a>
          <a href="/track-order" className="btn" style={{ background: "transparent", color: "var(--olive)", border: "1px solid var(--olive)" }}>TRACK ORDER</a>
        </div>
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
          <input name="phone" type="tel" placeholder="Phone / WhatsApp number" className="border border-black/20 p-3 text-sm bg-transparent w-full mb-3" />
          <input name="address" placeholder="Address" className="border border-black/20 p-3 text-sm bg-transparent w-full mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input name="city" placeholder="City" className="border border-black/20 p-3 text-sm bg-transparent" />
            <input name="zip" placeholder="Postal code" className="border border-black/20 p-3 text-sm bg-transparent" />
          </div>
          <h3 className="font-serif text-2xl mt-8 mb-4">Payment</h3>
          <div className="border border-olive bg-creamSoft p-3.5 text-sm mb-2.5">💬 Confirm Order via WhatsApp</div>
        </div>
        <div className="bg-creamSoft p-6 h-fit">
          <div className="text-xs tracking-widest text-taupe mb-4">ORDER SUMMARY</div>
          {items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm py-2"><span>{it.name} × {it.qty}</span><span>₹{it.price * it.qty}</span></div>
          ))}

          <div className="py-2">
            {coupon ? (
              <div className="flex items-center justify-between text-[12px] bg-white/60 border border-olive/40 rounded px-2.5 py-2">
                <span>Coupon <strong>{coupon.code}</strong> applied</span>
                <button type="button" onClick={removeCoupon} className="text-red-600 underline">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="border border-black/20 p-2 text-sm bg-transparent flex-1"
                />
                <button type="button" onClick={applyCoupon} disabled={couponBusy} className="border border-olive text-olive text-xs px-3 tracking-wide">
                  {couponBusy ? "…" : "APPLY"}
                </button>
              </div>
            )}
            {couponMsg && !coupon && <p className="text-[11px] text-red-600 mt-1.5">{couponMsg}</p>}
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm py-2 text-olive"><span>Discount</span><span>-₹{discount}</span></div>
          )}
          <div className="flex justify-between text-sm py-2"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
          <div className="flex justify-between text-base font-medium border-t border-black/15 mt-2 pt-3.5"><span>Total</span><span>₹{total}</span></div>
          {error && <p className="text-[12px] text-red-600 mb-3">{error}</p>}
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
