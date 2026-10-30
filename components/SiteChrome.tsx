"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Wraps every page with the shop header + footer — except the admin panel and the admin
// login page, which have their own layout and should fill the whole screen.
export default function SiteChrome({
  navbar,
  footer,
  mainClass,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  mainClass: string;
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/velora-staff-k9x2m");
  if (bare) return <>{children}</>;
  return (
    <>
      {navbar}
      <main className={mainClass}>{children}</main>
      {footer}
    </>
  );
}
