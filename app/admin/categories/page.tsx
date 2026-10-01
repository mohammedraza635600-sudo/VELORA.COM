import { prisma } from "@/lib/prisma";
import { upsertCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesAdmin() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Categories</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg overflow-hidden h-fit">
          <table className="w-full text-[12.5px]">
            <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Name</th><th className="p-3">Order</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td><td className="p-3">{c.order}</td><td className="p-3">{c.status}</td>
                  <td className="p-3"><form action={deleteCategory.bind(null, c.id)}><button className="text-red-600 text-[11px]">Delete</button></form></td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-400">No categories yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <form action={upsertCategory} className="bg-white border rounded-lg p-5 h-fit">
          <h3 className="text-sm font-medium mb-3">Add Category</h3>
          <input name="name" placeholder="Name" required className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <input name="order" type="number" placeholder="Display order" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <select name="status" className="w-full border rounded-md p-2.5 text-sm mb-3.5"><option value="visible">visible</option><option value="hidden">hidden</option></select>
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2 rounded-md">Save</button>
        </form>
      </div>
    </div>
  );
}
