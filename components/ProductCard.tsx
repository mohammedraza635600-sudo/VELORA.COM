import Link from "next/link";

type P = { slug: string; name: string; category: string; price: number; stock: number; colors?: string | null };

export default function ProductCard({ p }: { p: P }) {
  const colorList = (p.colors || "").split(",").map((c) => c.trim()).filter(Boolean);
  return (
    <Link href={`/product/${p.slug}`} className="product-card group block transition-transform duration-150 active:scale-[.97]">
      <div className="frame card-frame aspect-[3/4] relative">
        <div className="bg layer-a" />
        <div className="bg layer-b" />
        {p.stock === 0 && (
          <span className="absolute left-3 bottom-3 text-[10px] tracking-widest text-cream/80 z-10">OUT OF STOCK</span>
        )}
      </div>
      <div className="pt-4 flex justify-between gap-2">
        <div>
          <div className="text-sm card-name">{p.name}</div>
          <div className="text-[11px] text-taupe mt-1">{p.category}</div>
          <div className="flex gap-1.5 mt-2">
            {colorList.map((c) => (
              <span key={c} className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="text-sm whitespace-nowrap">${p.price}</div>
      </div>
    </Link>
  );
}
