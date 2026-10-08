import Link from "next/link";

type P = { slug: string; name: string; category: string; price: number; stock: number; colors?: string | null; images?: string | null };

export default function ProductCard({ p }: { p: P }) {
  const colorList = (p.colors || "").split(",").map((c) => c.trim()).filter(Boolean);
  const imageList = (p.images || "").split(",").map((s) => s.trim()).filter(Boolean);
  const img1 = imageList[0];
  const img2 = imageList[1];

  return (
    <Link href={`/product/${p.slug}`} className="product-card group block transition-transform duration-150 active:scale-[.97]">
      <div className="frame card-frame aspect-[3/4] relative">
        {img1 ? (
          <>
            <img src={img1} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{ opacity: 1 }} />
            {img2 && (
              <img src={img2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </>
        ) : (
          <>
            <div className="bg layer-a" />
            <div className="bg layer-b" />
          </>
        )}
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
