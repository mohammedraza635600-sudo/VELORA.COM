"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = "G-7ZHK4VHYQN";

// Google Analytics tag. Not loaded on the admin panel / staff login, so the
// owner's own clicks don't show up as visitors.
export default function GoogleAnalytics() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin") || pathname.startsWith("/velora-staff-k9x2m")) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
