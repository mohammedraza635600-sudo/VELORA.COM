import { prisma } from "@/lib/prisma";
import { upsertCollection, deleteCollection } from "./actions";

export const dynamic = "force-dynamic";

export default async function CollectionsAdmin() {
  const collections = await prisma.collection.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Collections</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg overflow-hidden h-fit">
          <table className="w-full text-[12.5px]">
            <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Name</th><th className="p-3">Order</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3"><span className="inline-block w-3 h-3 rounded mr-2" style={{ background: c.cover || "#ccc" }} />{c.name}</td>
                  <td className="p-3">{c.order}</td><td className="p-3">{c.status}</td>
                  <td className="p-3"><form action={deleteCollection.bind(null, c.id)}><button className="text-red-600 text-[11px]">Delete</button></form></td>
                </tr>
              ))}
              {collections.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-400">No collections yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <form action={upsertCollection} className="bg-white border rounded-lg p-5 h-fit">
          <h3 className="text-sm font-medium mb-3">Add Collection</h3>
          <input name="name" placeholder="Name" required className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <textarea name="description" placeholder="Description" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <input name="cover" type="color" defaultValue="#4D694E" className="w-full border rounded-md p-1 h-10 mb-2.5" />
          <input name="order" type="number" placeholder="Display order" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <select name="status" className="w-full border rounded-md p-2.5 text-sm mb-3.5"><option value="active">active</option><option value="hidden">hidden</option></select>
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2 rounded-md">Save</button>
        </form>
      </div>
    </div>
  );
}
