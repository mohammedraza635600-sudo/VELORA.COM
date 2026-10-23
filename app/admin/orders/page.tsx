import { prisma } from "@/lib/prisma";
import { updateOrderStatus, updateTracking, deleteOrder, updatePayment } from "./actions";

export const dynamic = "force-dynamic";
const STATUSES = ["pending","processing","packed","shipped","delivered","cancelled","refunded","returned"];

export default async function OrdersAdmin() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Orders</h2>
      <p className="text-xs text-gray-500 mb-5">{orders.length} order(s). Status changes are logged and visible to the customer.</p>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Tracking</th><th className="p-3">Date</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t align-top">
                <td className="p-3">{o.name}<br /><span className="text-gray-400 text-[11px]">{o.email}</span>{o.phone && <><br /><span className="text-gray-400 text-[11px]">{o.phone}</span></>}</td>
                <td className="p-3">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="p-3">₹{o.total}{o.discount > 0 && <><br /><span className="text-[10.5px] text-green-700">{o.couponCode} (-₹{o.discount})</span></>}</td>
                <td className="p-3">
                  <form action={updatePayment.bind(null, o.id)} className="flex flex-col gap-1">
                    <select name="payment" defaultValue={o.payment} className={`border rounded p-1 text-[11px] ${o.payment === "Paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                    <button className="border rounded text-[10.5px] px-1.5 py-0.5">Save</button>
                  </form>
                </td>
                <td className="p-3">
                  <form action={updateOrderStatus.bind(null, o.id)} className="flex gap-1.5 items-center">
                    <select name="status" defaultValue={o.status} className="border rounded p-1 text-[11.5px]">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="border rounded text-[10.5px] px-1.5 py-0.5">Save</button>
                  </form>
                </td>
                <td className="p-3">
                  <form action={updateTracking.bind(null, o.id)} className="flex flex-col gap-1">
                    <input name="carrier" placeholder="Carrier" defaultValue={o.carrier || ""} className="border rounded p-1 text-[11px] w-24" />
                    <input name="tracking" placeholder="Tracking #" defaultValue={o.tracking || ""} className="border rounded p-1 text-[11px] w-24" />
                    <button className="border rounded text-[10.5px] px-1.5 py-0.5">Save</button>
                  </form>
                </td>
                <td className="p-3 text-[11px]">{o.createdAt.toLocaleDateString()}</td>
                <td className="p-3">
                  <form action={deleteOrder.bind(null, o.id)}>
                    <button className="border rounded text-[10.5px] px-2 py-1 text-red-600">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-400">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
