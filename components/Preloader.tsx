"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Only show the splash once per browser tab session — not on every navigation/visit.
    const seen = sessionStorage.getItem("velora_seen_preloader");
    if (seen) return;
    sessionStorage.setItem("velora_seen_preloader", "1");
    setShow(true);
    const t = setTimeout(() => setHide(true), 550);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div id="preloader" className={hide ? "hide" : ""}>
      <div className="word-wrap">
        <div className="word">VELORA</div>
        <div className="bar"><i /></div>
      </div>
    </div>
  );
}
