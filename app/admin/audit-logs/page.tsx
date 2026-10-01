import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function AuditLogsAdmin() {
  const logs = await prisma.auditLog.findMany({ orderBy: { ts: "desc" }, take: 100 });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Audit Logs</h2>
      <p className="text-xs text-gray-500 mb-5">Every sensitive admin action is recorded automatically.</p>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Action</th><th className="p-3">Resource</th><th className="p-3">By</th><th className="p-3">When</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t"><td className="p-3">{l.action}</td><td className="p-3">{l.resource}</td><td className="p-3">{l.by}</td><td className="p-3">{l.ts.toLocaleString()}</td></tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No actions logged yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
