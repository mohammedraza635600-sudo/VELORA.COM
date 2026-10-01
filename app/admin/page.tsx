import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([prisma.order.findMany({ orderBy: { createdAt: "desc" } }), prisma.product.findMany()]);
  const revenue = orders.filter(o => o.payment === "Paid").reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outStock = products.filter(p => p.stock === 0).length;
  const pending = orders.filter(o => o.status === "pending").length;
  const paidCount = orders.filter(o => o.payment === "Paid").length;

  const stats = [
    [`$${revenue.toLocaleString()}`, "Revenue (paid orders)"],
    [orders.length, "Total Orders"],
    [products.length, "Total Products"],
    [paidCount ? `$${Math.round(revenue / paidCount)}` : "$0", "Avg. Order Value"],
    [lowStock, "Low Stock"],
    [outStock, "Out of Stock"],
    [pending, "Pending Orders"],
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Dashboard</h2>
      <p className="text-xs text-gray-500 mb-6">Live snapshot from the connected Postgres database.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-7">
        {stats.map(([n, l]) => (
          <div key={l as string} className="bg-white border rounded-lg p-4">
            <div className="text-xl font-bold">{n}</div>
            <div className="text-[11.5px] text-gray-500 mt-1">{l}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4.5 py-3.5 border-b font-medium text-sm px-4">Recent Orders</div>
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
          <tbody>
            {orders.slice(0, 6).map((o) => (
              <tr key={o.id} className="border-t"><td className="p-3">{o.name}</td><td className="p-3">${o.total}</td><td className="p-3">{o.status}</td><td className="p-3">{o.createdAt.toLocaleDateString()}</td></tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
