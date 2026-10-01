import { prisma } from "@/lib/prisma";
import { upsertCoupon, deleteCoupon } from "./actions";

export const dynamic = "force-dynamic";

export default async function CouponsAdmin() {
  const coupons = await prisma.coupon.findMany();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Coupons</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg overflow-hidden h-fit">
          <table className="w-full text-[12.5px]">
            <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Active</th><th className="p-3"></th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 font-medium">{c.code}</td><td className="p-3">{c.type}</td><td className="p-3">{c.value}</td>
                  <td className="p-3">{c.active ? "Yes" : "No"}</td>
                  <td className="p-3"><form action={deleteCoupon.bind(null, c.id)}><button className="text-red-600 text-[11px]">Delete</button></form></td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-400">No coupons yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <form action={upsertCoupon} className="bg-white border rounded-lg p-5 h-fit">
          <h3 className="text-sm font-medium mb-3">Add Coupon</h3>
          <input name="code" placeholder="CODE10" required className="w-full border rounded-md p-2.5 text-sm mb-2.5 uppercase" />
          <select name="type" className="w-full border rounded-md p-2.5 text-sm mb-2.5">
            <option value="percentage">percentage</option><option value="fixed">fixed</option><option value="free_shipping">free_shipping</option>
          </select>
          <input name="value" type="number" placeholder="Value" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <input name="minOrder" type="number" placeholder="Minimum order ($)" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <input name="usageLimit" type="number" placeholder="Usage limit" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <input name="expiry" placeholder="Expiry (YYYY-MM-DD)" className="w-full border rounded-md p-2.5 text-sm mb-2.5" />
          <label className="flex items-center gap-2 text-sm mb-3.5"><input type="checkbox" name="active" defaultChecked /> Active</label>
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2 rounded-md">Save</button>
        </form>
      </div>
    </div>
  );
}
