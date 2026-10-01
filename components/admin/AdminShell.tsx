"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin-login/actions";

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
  return (
    <div className="flex min-h-screen bg-[#F5F6F4] text-[#161816] text-[13.5px]">
      <aside className="w-[230px] bg-white border-r border-[#e4e6e1] py-5 flex-shrink-0">
        <div className="font-bold tracking-wide px-5 pb-4 text-[15px]">VELORA <span className="font-normal text-gray-400">/ admin</span></div>
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="px-5 pt-3.5 pb-1.5 text-[10px] tracking-wider text-gray-400">{g.group}</div>
            {g.items.map(([href, label]) => {
              const locked = !PERMS[href]?.includes(session.role);
              const active = pathname === href;
              return locked ? (
                <div key={href} className="px-5 py-2.5 text-[13px] opacity-30">{label} 🔒</div>
              ) : (
                <Link key={href} href={href} className={`block px-5 py-2.5 text-[13px] border-l-2 ${active ? "border-[#4D694E] bg-[#eef2ec] text-[#344A38] font-semibold" : "border-transparent hover:bg-[#f2f3f0]"}`}>{label}</Link>
              );
            })}
          </div>
        ))}
      </aside>
      <div className="flex-1 min-w-0">
        <div className="bg-white border-b border-[#e4e6e1] px-6 py-3.5 flex justify-between items-center sticky top-0 z-10">
          <div className="text-xs text-gray-500">Signed in as <b className="text-black">{session.name}</b><span className="ml-1.5 bg-[#eef2ec] text-[#344A38] px-2 py-0.5 rounded-full text-[10.5px]">{session.role}</span></div>
          <form action={logoutAdmin}><button className="text-xs text-gray-500 underline">Log out</button></form>
        </div>
        <div className="p-6 max-w-[1300px]">{children}</div>
      </div>
    </div>
  );
}
