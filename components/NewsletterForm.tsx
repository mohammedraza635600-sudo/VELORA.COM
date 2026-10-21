"use client";
import { useState } from "react";
import { subscribeNewsletter } from "@/app/actions";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("email", email);
    const res = await subscribeNewsletter(fd);
    setBusy(false);
    setOk(res.ok);
    setMsg(res.message);
    if (res.ok) setEmail("");
  }

  return (
    <div>
      <h4 className="text-[11px] tracking-widest text-taupe mb-4">STAY IN TOUCH</h4>
      <p className="text-sm opacity-80 mb-3">New arrivals and quiet announcements, occasionally.</p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="bg-transparent border border-cream/30 px-3 py-2 text-sm flex-1 min-w-0"
          required
        />
        <button type="submit" disabled={busy} className="border border-cream/50 px-3 text-xs tracking-wide flex-shrink-0">
          {busy ? "…" : "JOIN"}
        </button>
      </form>
      {msg && <p className={`text-[11px] mt-2 ${ok ? "text-[#C9A961]" : "text-red-400"}`}>{msg}</p>}
    </div>
  );
}
