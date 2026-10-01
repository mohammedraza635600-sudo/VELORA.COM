"use client";
import { useState } from "react";

type Hit = { id: string; name: string; slug: string; category: string; price: number };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);

  async function onChange(v: string) {
    setQ(v);
    if (!v.trim()) { setHits([]); return; }
    const res = await fetch(`/api/search?q=${encodeURIComponent(v)}`);
    const data = await res.json();
    setHits(data.hits || []);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <input
        autoFocus
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products…"
        className="w-full border-b border-black py-3 font-serif text-3xl bg-transparent outline-none"
      />
      <div className="mt-8">
        {hits.map((h) => (
          <a key={h.id} href={`/product/${h.slug}`} className="flex gap-4 py-4 border-b border-black/10">
            <div className="frame relative w-14 h-16 flex-shrink-0"><div className="bg" /></div>
            <div>
              <div className="text-sm">{h.name}</div>
              <div className="text-xs text-taupe mt-1">{h.category} · ${h.price}</div>
            </div>
          </a>
        ))}
        {q && hits.length === 0 && <p className="text-sm text-taupe">No results for &ldquo;{q}&rdquo;.</p>}
      </div>
    </div>
  );
}
