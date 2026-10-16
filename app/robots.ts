import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin-login", "/api"],
    },
    sitemap: "https://velora-com.vercel.app/sitemap.xml",
  };
}
