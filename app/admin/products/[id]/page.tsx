import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!product) return notFound();
  const boundUpdate = updateProduct.bind(null, id);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Edit Product</h2>
      <ProductForm action={boundUpdate} product={product} categories={categories.map((c) => c.name)} />
    </div>
  );
}
