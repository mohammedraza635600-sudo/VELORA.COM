"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";

type NavItem = { label: string; url: string };

export default function Navbar({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-offWhite/90 backdrop-blur border-b border-black/5">
        <div className="flex items-center justify-between px-5 md:px-12 py-4">
          <button className="md:hidden text-xs tracking-widest" onClick={() => setOpen(true)}>MENU</button>
          <Link href="/" className="font-serif text-2xl tracking-[.28em]">VELORA</Link>
          <nav className="hidden md:flex gap-10 text-xs tracking-widest">
            {items.map((n) => (
              <Link key={n.label} href={n.url} className="hover:opacity-60 transition">{n.label}</Link>
            ))}
          </nav>
          <div className="flex gap-6 text-xs tracking-widest items-center">
            <Link href="/search" className="hidden md:inline">SEARCH</Link>
            <Link href="/cart">BAG ({count})</Link>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-[60] bg-oliveDark flex flex-col justify-center gap-8 p-10">
          <button className="absolute top-6 right-6 text-cream text-xs tracking-widest" onClick={() => setOpen(false)}>CLOSE ✕</button>
          {items.map((n) => (
            <Link key={n.label} href={n.url} onClick={() => setOpen(false)} className="font-serif text-4xl text-cream">{n.label}</Link>
          ))}
        </div>
      )}
    </>
  );
}
