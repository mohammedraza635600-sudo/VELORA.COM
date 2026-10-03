"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHide(true), 850);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="preloader" className={hide ? "hide" : ""}>
      <div className="word">VELORA</div>
    </div>
  );
}
