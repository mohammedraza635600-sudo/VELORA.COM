import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubscribersAdmin() {
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Newsletter Subscribers</h2>
      <p className="text-xs text-gray-500 mb-5">{subs.length} total — emails collected from the website footer.</p>
      <div className="bg-white border rounded-lg overflow-hidden max-w-xl">
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Email</th><th className="p-3">Joined</th></tr></thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-gray-500">{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
            {subs.length === 0 && <tr><td colSpan={2} className="p-6 text-center text-gray-400">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
