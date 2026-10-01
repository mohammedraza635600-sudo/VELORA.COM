import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();
  const boundUpdate = updateProduct.bind(null, id);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Edit Product</h2>
      <ProductForm action={boundUpdate} product={product} />
    </div>
  );
}
