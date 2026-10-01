import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";

export const dynamic = "force-dynamic";

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string; collection?: string; sort?: string; inStock?: string }> }) {
  const sp = await searchParams;
  const where: any = { status: "published" };
  if (sp.category) where.category = sp.category;
  if (sp.collection) where.collection = sp.collection;
  if (sp.inStock === "1") where.stock = { gt: 0 };

  let orderBy: any = { createdAt: "desc" };
  if (sp.sort === "priceLow") orderBy = { price: "asc" };
  if (sp.sort === "priceHigh") orderBy = { price: "desc" };
  if (sp.sort === "name") orderBy = { name: "asc" };

  const [products, categories, collections] = await Promise.all([
    prisma.product.findMany({ where, orderBy }),
    prisma.category.findMany({ where: { status: "visible" }, orderBy: { order: "asc" } }),
    prisma.collection.findMany({ where: { status: "active" }, orderBy: { order: "asc" } }),
  ]);

  function qs(next: Record<string, string | undefined>) {
    const merged = { ...sp, ...next };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/shop?${params.toString()}`;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-12 py-16">
      <div className="mb-10">
        <div className="text-[11px] tracking-widest text-olive mb-2">FULL RANGE</div>
        <h1 className="font-serif text-4xl md:text-5xl">Shop All</h1>
      </div>
      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="text-sm">
          <h4 className="text-[11px] tracking-widest text-taupe mb-3">CATEGORY</h4>
          <ul className="mb-6 space-y-1">
            <li><a href={qs({ category: undefined })} className={!sp.category ? "font-medium" : "opacity-70"}>All</a></li>
            {categories.map((c) => (
              <li key={c.id}><a href={qs({ category: c.name })} className={sp.category === c.name ? "font-medium" : "opacity-70"}>{c.name}</a></li>
            ))}
          </ul>
          <h4 className="text-[11px] tracking-widest text-taupe mb-3">COLLECTION</h4>
          <ul className="mb-6 space-y-1">
            <li><a href={qs({ collection: undefined })} className={!sp.collection ? "font-medium" : "opacity-70"}>All</a></li>
            {collections.map((c) => (
              <li key={c.id}><a href={qs({ collection: c.name })} className={sp.collection === c.name ? "font-medium" : "opacity-70"}>{c.name}</a></li>
            ))}
          </ul>
          <label className="flex items-center gap-2 text-sm">
            <a href={qs({ inStock: sp.inStock === "1" ? undefined : "1" })} className="flex items-center gap-2">
              <span className={`inline-block w-4 h-4 border ${sp.inStock === "1" ? "bg-olive border-olive" : "border-black/30"}`} />
              In stock only
            </a>
          </label>
        </aside>
        <div>
          <div className="flex justify-between items-center mb-6 text-xs">
            <span className="text-taupe">{products.length} item(s)</span>
            <SortSelect />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          {products.length === 0 && <p className="text-sm text-taupe py-10">No products match these filters.</p>}
        </div>
      </div>
    </div>
  );
}
