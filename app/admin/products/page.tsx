import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProduct, bulkUpdateProducts, adjustStock } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductsAdmin() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link href="/admin/products/new" className="bg-[#4D694E] text-white text-xs px-4 py-2.5 rounded-md">+ Add Product</Link>
      </div>
      <p className="text-xs text-gray-500 mb-5">{products.length} item(s) — live on the storefront the moment you publish.</p>
      <form action={bulkUpdateProducts} className="bg-white border rounded-lg overflow-hidden">
        <div className="flex gap-2 px-4 py-2.5 border-b bg-gray-50 text-[11.5px]">
          <button name="bulkAction" value="published" className="border rounded px-2.5 py-1">Bulk Publish</button>
          <button name="bulkAction" value="draft" className="border rounded px-2.5 py-1">Bulk Unpublish</button>
          <button name="bulkAction" value="delete" className="border rounded px-2.5 py-1 text-red-600">Bulk Delete</button>
        </div>
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500">
            <th className="p-3"></th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3">Actions</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3"><input type="checkbox" name="ids" value={p.id} /></td>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    {p.images ? (
                      <img src={p.images.split(",")[0].trim()} alt="" className="w-9 h-11 rounded object-cover border" />
                    ) : (
                      <div className="w-9 h-11 rounded border bg-gray-100" />
                    )}
                    {p.name}
                  </div>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">
                  {p.stock === 0 ? <span className="text-red-600">Out of stock</span> : p.stock < 5 ? <span className="text-amber-600">{p.stock} — Low</span> : p.stock}
                  <span className="inline-flex gap-1 ml-2">
                    <button formAction={adjustStock.bind(null, p.id, 1)} className="border rounded w-5 h-5 text-[10px]">+</button>
                    <button formAction={adjustStock.bind(null, p.id, -1)} className="border rounded w-5 h-5 text-[10px]">−</button>
                  </span>
                </td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10.5px] ${p.status === "published" ? "bg-green-50 text-green-700" : p.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{p.status}</span></td>
                <td className="p-3 flex gap-2">
                  <Link href={`/admin/products/${p.id}`} className="border rounded px-2.5 py-1">Edit</Link>
                  <button formAction={deleteProduct.bind(null, p.id)} className="border rounded px-2.5 py-1 text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No products yet.</td></tr>}
          </tbody>
        </table>
      </form>
    </div>
  );
}
