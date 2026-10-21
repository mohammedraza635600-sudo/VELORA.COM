import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customerAuth";
import AccountForms from "./AccountForms";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — VELORA", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) return <AccountForms />;

  // Only orders placed while signed in are attached to the account (by customerId).
  // Guest orders are never matched by email alone, so nobody can see someone else's
  // orders just by registering with their email address.
  const orders = await prisma.order.findMany({
    where: { customerId: session.customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="text-[11px] tracking-widest text-olive mb-2">MY ACCOUNT</div>
          <h1 className="font-serif text-4xl">Hello, {session.name.split(" ")[0]}</h1>
          <p className="text-xs text-taupe mt-1">{session.email}</p>
        </div>
        <LogoutButton />
      </div>

      <h2 className="font-serif text-2xl mb-4">Order history</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-taupe">No orders yet. Orders you place while signed in will appear here. <a href="/shop" className="underline text-olive">Start shopping →</a></p>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-black/10 p-5">
              <div className="flex justify-between text-sm">
                <span className="font-serif text-lg">#{o.id.slice(-8).toUpperCase()}</span>
                <span className="capitalize text-olive">{o.status}</span>
              </div>
              <div className="text-[11px] text-taupe mb-3">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              {o.items.map((it) => (
                <div key={it.id} className="flex justify-between text-sm py-1">
                  <span>{it.name}{it.size ? ` (${it.size})` : ""} × {it.qty}</span>
                  <span>₹{it.price * it.qty}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-medium border-t border-black/10 mt-2 pt-2"><span>Total</span><span>₹{o.total}</span></div>
              {(o.carrier || o.tracking) && <div className="text-xs text-taupe mt-2">{o.carrier} {o.tracking}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
