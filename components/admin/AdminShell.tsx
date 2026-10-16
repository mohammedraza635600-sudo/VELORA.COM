"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/app/velora-staff-k9x2m/actions";

const PERMS: Record<string, string[]> = {
  "/admin": ["SUPER_ADMIN","ADMIN","PRODUCT_MANAGER","ORDER_MANAGER","INVENTORY_MANAGER","CONTENT_MANAGER","MARKETING_MANAGER","SUPPORT"],
  "/admin/products": ["SUPER_ADMIN","ADMIN","PRODUCT_MANAGER"],
  "/admin/collections": ["SUPER_ADMIN","ADMIN","PRODUCT_MANAGER","CONTENT_MANAGER"],
  "/admin/categories": ["SUPER_ADMIN","ADMIN","PRODUCT_MANAGER","CONTENT_MANAGER"],
  "/admin/orders": ["SUPER_ADMIN","ADMIN","ORDER_MANAGER","SUPPORT"],
  "/admin/coupons": ["SUPER_ADMIN","ADMIN","MARKETING_MANAGER"],
  "/admin/reviews": ["SUPER_ADMIN","ADMIN","MARKETING_MANAGER","SUPPORT"],
  "/admin/settings": ["SUPER_ADMIN","ADMIN","CONTENT_MANAGER","MARKETING_MANAGER"],
  "/admin/audit-logs": ["SUPER_ADMIN","ADMIN"],
};

const NAV = [
  { group: "Overview", items: [["/admin", "Dashboard"]] },
  { group: "Catalog", items: [["/admin/products", "Products"], ["/admin/collections", "Collections"], ["/admin/categories", "Categories"]] },
  { group: "Sales", items: [["/admin/orders", "Orders"], ["/admin/coupons", "Coupons"], ["/admin/reviews", "Reviews"]] },
  { group: "Storefront CMS", items: [["/admin/settings", "Website Builder"]] },
  { group: "System", items: [["/admin/audit-logs", "Audit Logs"]] },
];

export default function AdminShell({ children, session }: { children: React.ReactNode; session: { name: string; role: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <aside className="w-[230px] max-w-[80vw] bg-white border-r border-[#e4e6e1] py-5 flex-shrink-0 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-5 pb-4">
        <div className="font-bold tracking-wide text-[15px]">VELORA <span className="font-normal text-gray-400">/ admin</span></div>
        <button className="md:hidden text-gray-400 text-lg leading-none" onClick={() => setOpen(false)}>✕</button>
      </div>
      {NAV.map((g) => (
        <div key={g.group}>
          <div className="px-5 pt-3.5 pb-1.5 text-[10px] tracking-wider text-gray-400">{g.group}</div>
          {g.items.map(([href, label]) => {
            const locked = !PERMS[href]?.includes(session.role);
            const active = pathname === href;
            return locked ? (
              <div key={href} className="px-5 py-2.5 text-[13px] opacity-30">{label} 🔒</div>
            ) : (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`block px-5 py-2.5 text-[13px] border-l-2 ${active ? "border-[#4D694E] bg-[#eef2ec] text-[#344A38] font-semibold" : "border-transparent hover:bg-[#f2f3f0]"}`}>{label}</Link>
            );
          })}
        </div>
      ))}
    </aside>
  );

  return (
    <div className="md:flex min-h-[100dvh] bg-[#F5F6F4] text-[#161816] text-[13.5px]">
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:block">{sidebar}</div>

      {/* Mobile sidebar — slide-in drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-[230px] max-w-[80vw] bg-white h-full">{sidebar}</div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="bg-white border-b border-[#e4e6e1] px-4 md:px-6 py-3.5 flex justify-between items-center sticky top-0 z-10 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden border rounded px-2.5 py-1.5 text-xs flex-shrink-0" onClick={() => setOpen(true)}>☰</button>
            <div className="text-xs text-gray-500 truncate">Signed in as <b className="text-black">{session.name}</b><span className="ml-1.5 bg-[#eef2ec] text-[#344A38] px-2 py-0.5 rounded-full text-[10.5px] hidden sm:inline">{session.role}</span></div>
          </div>
          <form action={logoutAdmin}><button className="text-xs text-gray-500 underline flex-shrink-0">Log out</button></form>
        </div>
        <div className="p-4 md:p-6 max-w-[1300px] overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}
