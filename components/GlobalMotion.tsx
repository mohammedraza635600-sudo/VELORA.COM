"use client";
import { useEffect } from "react";

export default function GlobalMotion() {
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest(".btn, .ripple-wrap") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const dot = document.createElement("span");
      dot.className = "ripple-dot";
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - rect.left - size / 2}px`;
      dot.style.top = `${e.clientY - rect.top - size / 2}px`;
      const prevPosition = target.style.position;
      if (!prevPosition || prevPosition === "static") target.style.position = "relative";
      target.style.overflow = target.style.overflow || "hidden";
      target.appendChild(dot);
      setTimeout(() => dot.remove(), 650);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
