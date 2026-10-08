import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import AddToBag from "@/components/AddToBag";
import ReviewsBox from "@/components/ReviewsBox";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return notFound();

  const [related, reviews] = await Promise.all([
    prisma.product.findMany({ where: { status: "published", id: { not: product.id } }, take: 4 }),
    prisma.review.findMany({ where: { productId: product.id, approved: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const colors = (product.colors || "").split(",").map((c) => c.trim()).filter(Boolean);
  const images = (product.images || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-12 py-14">
      <a href="/shop" className="text-xs tracking-widest text-olive inline-block mb-6">← BACK TO SHOP</a>
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-16">
        <div className="flex flex-col gap-4">
          {product.video && (
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
              <video src={product.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            </div>
          )}
          {images.length > 0 ? (
            images.map((url, i) => (
              <div key={url + i} className="relative aspect-[4/5] rounded-sm overflow-hidden">
                <img src={url} alt={`${product.name} — view ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))
          ) : !product.video ? (
            <>
              <div className="frame relative aspect-[4/5]"><div className="bg" /></div>
              <div className="frame relative aspect-[4/5]"><div className="bg" /></div>
            </>
          ) : null}
        </div>
        <div className="md:sticky md:top-28 self-start">
          <div className="text-[11px] tracking-widest text-olive">VELORA</div>
          <div className="text-[11px] tracking-widest text-taupe mt-1">{(product.collection || "").toUpperCase()} COLLECTION</div>
          <h1 className="font-serif text-4xl mt-4">{product.name}</h1>
          <div className="text-lg mt-2">${product.price}</div>
          <p className="text-sm leading-relaxed mt-5 max-w-md" style={{ color: "#4a5045" }}>{product.description}</p>

          <AddToBag product={{ id: product.id, name: product.name, slug: product.slug, price: product.price, colors, stock: product.stock }} />

          <div className="mt-11 border-t border-black/10">
            {[["Material", product.material], ["Care", product.care]].map(([label, val]) => val ? (
              <div key={label} className="border-b border-black/10 py-4">
                <div className="text-xs tracking-widest">{label.toString().toUpperCase()}</div>
                <p className="text-sm mt-2 max-w-md" style={{ color: "#4a5045" }}>{val}</p>
              </div>
            ) : null)}
          </div>

          <ReviewsBox productId={product.id} reviews={reviews} />
        </div>
      </div>

      <div className="mt-24">
        <div className="text-[11px] tracking-widest text-olive mb-2">YOU MAY ALSO LIKE</div>
        <h2 className="font-serif text-3xl mb-8">Complete The Look</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}
