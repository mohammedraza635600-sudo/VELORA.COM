"use client";
import { useState } from "react";
import { sendBroadcast } from "./actions";

export default function BroadcastForm() {
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!confirm("Send this notification to ALL subscribed customers now?")) return;
    setBusy(true);
    setMsg("");
    const res = await sendBroadcast(new FormData(form));
    setBusy(false);
    setOk(res.ok);
    setMsg(res.message);
    if (res.ok) form.reset();
  }

  return (
    <form onSubmit={submit} className="bg-white border rounded-lg p-5 max-w-md">
      <h3 className="text-sm font-medium mb-3">Send a notification to customers</h3>
      <input name="title" maxLength={80} placeholder="Title (e.g. New arrivals are here)" required className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
      <textarea name="body" maxLength={200} rows={3} placeholder="Message (e.g. 10% off this weekend with code WELCOME10)" required className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
      <input name="url" defaultValue="/shop" placeholder="Opens page (e.g. /shop)" className="w-full border rounded-md p-2.5 text-sm mb-3" />
      <button disabled={busy} className="bg-[#4D694E] text-white text-sm px-4 py-2 rounded-md">{busy ? "Sending…" : "Send now"}</button>
      {msg && <p className={`text-xs mt-3 ${ok ? "text-green-700" : "text-red-600"}`}>{msg}</p>}
    </form>
  );
}
