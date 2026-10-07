"use client";
import { useEffect } from "react";

export default function RevealScript() {
  useEffect(() => {
    const groups = new Map<Element, Element[]>();
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      groups.set(group, Array.from(group.querySelectorAll(".reveal")));
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const target = e.target as HTMLElement;
          const parentGroup = target.closest("[data-reveal-group]");
          if (parentGroup && groups.has(parentGroup)) {
            const siblings = groups.get(parentGroup)!;
            const idx = siblings.indexOf(target);
            target.style.transitionDelay = `${Math.min(idx, 6) * 90}ms`;
          }
          target.classList.add("in");
          io.unobserve(target);
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
