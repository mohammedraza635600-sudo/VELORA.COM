import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default function NewProduct() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Add Product</h2>
      <ProductForm action={createProduct} />
    </div>
  );
}
