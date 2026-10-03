"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

type NavItem = { label: string; url: string };

export default function Navbar({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header id="site-nav" className={`fixed top-0 left-0 right-0 z-50 border-b border-transparent ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-pad flex items-center justify-between px-5 md:px-12 py-4 transition-[padding] duration-300">
          <button className="md:hidden text-xs tracking-widest active:scale-90 transition-transform" onClick={() => setOpen(true)}>MENU</button>
          <Link href="/" className="font-serif text-2xl tracking-[.28em] active:scale-95 transition-transform inline-block">VELORA</Link>
          <nav className="hidden md:flex gap-10 text-xs tracking-widest">
            {items.map((n) => (
              <Link key={n.label} href={n.url} className="relative hover:opacity-60 transition-opacity duration-300 group">
                {n.label}
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="flex gap-6 text-xs tracking-widest items-center">
            <Link href="/search" className="hidden md:inline hover:opacity-60 transition-opacity">SEARCH</Link>
            <Link href="/cart" className="active:scale-90 transition-transform inline-block">BAG ({count})</Link>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-[60] bg-oliveDark flex flex-col justify-center gap-8 p-10 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${open ? "translate-y-0" : "-translate-y-full"}`}
      >
        <button className="absolute top-6 right-6 text-cream text-xs tracking-widest active:scale-90 transition-transform" onClick={() => setOpen(false)}>CLOSE ✕</button>
        {items.map((n, i) => (
          <Link
            key={n.label}
            href={n.url}
            onClick={() => setOpen(false)}
            className="font-serif text-4xl text-cream transition-all duration-500"
            style={{
              transitionDelay: open ? `${i * 60}ms` : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(16px)",
            }}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </>
  );
}
