"use client";
import { useEffect, useState } from "react";
import { savePushSubscription, removePushSubscription } from "@/app/actions";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function keyToBytes(base64: string) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

type State = "loading" | "unsupported" | "off" | "on" | "denied";

export default function NotifyButton({
  audience,
  labelOn,
  labelOff,
  className = "",
}: {
  audience: "admin" | "customer";
  labelOn: string;
  labelOff: string;
  className?: string;
}) {
  const [state, setState] = useState<State>("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!PUBLIC_KEY || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setState("unsupported");
        return;
      }
      if (Notification.permission === "denied") { setState("denied"); return; }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setState(sub ? "on" : "off");
      } catch {
        setState("unsupported");
      }
    })();
  }, []);

  async function turnOn() {
    setMsg("");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") { setState(perm === "denied" ? "denied" : "off"); return; }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(PUBLIC_KEY) });
      const res = await savePushSubscription(JSON.parse(JSON.stringify(sub)), audience);
      if (res.ok) setState("on");
      else { await sub.unsubscribe(); setMsg(res.message || "Could not turn on."); }
    } catch {
      setMsg("Could not turn on notifications on this device.");
    }
  }

  async function turnOff() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) { await removePushSubscription(sub.endpoint); await sub.unsubscribe(); }
    } catch {}
    setState("off");
  }

  // Hidden where push isn't possible (e.g. iPhone Safari tab that isn't installed yet).
  if (state === "loading" || state === "unsupported") return null;
  if (state === "denied") return <p className="text-[11px] opacity-60">Notifications are blocked in your browser settings.</p>;

  return (
    <div>
      <button type="button" onClick={state === "on" ? turnOff : turnOn} className={className}>
        {state === "on" ? labelOn : labelOff}
      </button>
      {msg && <p className="text-[11px] text-red-500 mt-1">{msg}</p>}
    </div>
  );
}
