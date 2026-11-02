"use client";
import { useEffect } from "react";

// Registers the service worker (needed for the installable app + push notifications).
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
