"use client";
import { useEffect, useRef } from "react";

export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;
      const fade = Math.max(0, 1 - y / 500);
      el.style.transform = `translateY(${y * 0.25}px)`;
      el.style.opacity = String(fade);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="hero-parallax">
      {children}
    </div>
  );
}
