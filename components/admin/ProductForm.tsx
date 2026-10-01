type P = Partial<{
  name: string; category: string; collection: string; price: number; compareAt: number | null;
  sku: string; stock: number; status: string; colors: string; description: string; material: string; care: string;
}>;

export default function ProductForm({ action, product }: { action: (formData: FormData) => void; product?: P }) {
  const p = product || {};
  return (
    <form action={action} className="bg-white border rounded-lg p-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-500 mb-1.5">Product Name</label>
          <input name="name" defaultValue={p.name} required className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Category</label>
          <select name="category" defaultValue={p.category} className="w-full border rounded-md p-2.5 text-sm">
            {["Outerwear","Tailoring","Knitwear","Shirting","Trousers","Footwear","Accessories"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Collection</label>
          <input name="collection" defaultValue={p.collection} className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Price ($)</label>
          <input name="price" type="number" defaultValue={p.price} required className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Compare-at Price ($)</label>
          <input name="compareAt" type="number" defaultValue={p.compareAt ?? undefined} className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">SKU</label>
          <input name="sku" defaultValue={p.sku} className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Stock Qty</label>
          <input name="stock" type="number" defaultValue={p.stock} className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Status</label>
          <select name="status" defaultValue={p.status || "draft"} className="w-full border rounded-md p-2.5 text-sm">
            <option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-500 mb-1.5">Colors (comma-separated hex)</label>
          <input name="colors" defaultValue={p.colors} placeholder="#26382A, #B7AE99" className="w-full border rounded-md p-2.5 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-500 mb-1.5">Description</label>
          <textarea name="description" defaultValue={p.description} className="w-full border rounded-md p-2.5 text-sm min-h-[70px]" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Material</label>
          <textarea name="material" defaultValue={p.material} className="w-full border rounded-md p-2.5 text-sm min-h-[60px]" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Care</label>
          <textarea name="care" defaultValue={p.care} className="w-full border rounded-md p-2.5 text-sm min-h-[60px]" />
        </div>
      </div>
      <button type="submit" className="bg-[#4D694E] text-white text-sm px-5 py-2.5 rounded-md mt-5">Save Product</button>
    </form>
  );
}
