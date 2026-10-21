"use client";
import { useState } from "react";
import { trackOrder } from "@/app/actions";

const STEPS = ["pending", "processing", "packed", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    const res = await trackOrder(orderId.trim(), email.trim());
    setLoading(false);
    if (res.ok) setOrder(res.order);
    else setError(res.message);
  }

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;
  const isTerminalOther = order && !STEPS.includes(order.status); // cancelled / refunded / returned

  return (
    <div className="max-w-xl mx-auto px-5 py-20">
      <div className="text-[11px] tracking-widest text-olive mb-2">ORDER STATUS</div>
      <h1 className="font-serif text-4xl mb-8">Track Your Order</h1>

      <form onSubmit={submit} className="grid gap-3 mb-10">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID (e.g. AB12CD34 — shown after checkout)"
          className="border border-black/20 p-3 text-sm bg-transparent"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email used at checkout"
          className="border border-black/20 p-3 text-sm bg-transparent"
        />
        <button type="submit" disabled={loading} className="btn justify-center" style={{ background: "var(--olive)", color: "var(--cream)" }}>
          {loading ? "SEARCHING…" : "TRACK ORDER"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {order && (
        <div className="border border-black/10 rounded-sm p-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="text-[11px] text-taupe tracking-widest">ORDER</div>
              <div className="font-serif text-xl">#{order.id.slice(-8).toUpperCase()}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-taupe tracking-widest">TOTAL</div>
              <div className="font-serif text-xl">₹{order.total}</div>
            </div>
          </div>

          {isTerminalOther ? (
            <div className="text-sm mb-5 capitalize bg-creamSoft px-3 py-2 inline-block">{order.status}</div>
          ) : (
            <div className="flex mb-6">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1 text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1.5"
                    style={{ background: i <= stepIndex ? "var(--olive)" : "#ddd" }}
                  />
                  <div className="text-[10px] uppercase tracking-wide text-taupe">{s}</div>
                </div>
              ))}
            </div>
          )}

          {(order.carrier || order.tracking) && (
            <div className="text-sm text-taupe mb-5">
              {order.carrier && <div>Carrier: {order.carrier}</div>}
              {order.tracking && <div>Tracking #: {order.tracking}</div>}
            </div>
          )}

          <div className="border-t border-black/10 pt-4">
            {order.items.map((it: any) => (
              <div key={it.id} className="flex justify-between text-sm py-1.5">
                <span>{it.name} {it.size ? `(Size ${it.size})` : ""} × {it.qty}</span>
                <span>₹{it.price * it.qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
