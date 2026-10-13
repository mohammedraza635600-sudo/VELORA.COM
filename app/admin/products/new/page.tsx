import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Add Product</h2>
      <ProductForm action={createProduct} categories={categories.map((c) => c.name)} />
    </div>
  );
}
