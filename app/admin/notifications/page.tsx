import { prisma } from "@/lib/prisma";
import BroadcastForm from "./BroadcastForm";

export const dynamic = "force-dynamic";

export default async function NotificationsAdmin() {
  const [customers, admins] = await Promise.all([
    prisma.pushSubscription.count({ where: { audience: "customer" } }),
    prisma.pushSubscription.count({ where: { audience: "admin" } }),
  ]);
  const configured = !!(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Notifications</h2>
      <p className="text-xs text-gray-500 mb-5">
        {customers} customer device(s) subscribed · {admins} owner device(s) getting new-order alerts
      </p>
      {!configured && (
        <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-md p-3 mb-5 max-w-md">
          Notification keys are not set up on Vercel yet, so nothing can be sent. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY, then redeploy.
        </p>
      )}
      <BroadcastForm />
      <p className="text-[11px] text-gray-500 mt-4 max-w-md">
        To get an alert on your phone for every new order, open the admin panel on that phone and tap “🔔 Order alerts” at the top.
      </p>
    </div>
  );
}
