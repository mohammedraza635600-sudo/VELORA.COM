"use server";
import { setSetting, logAudit, DEFAULT_NAV, DEFAULT_FOOTER } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveBranding(formData: FormData) {
  const session = await getAdminSession();
  const keys = ["primary","cream","oliveDeep","oliveDark","creamSoft","offWhite","taupe","charcoal"];
  const data: Record<string, string> = {};
  keys.forEach(k => data[k] = String(formData.get(k) || ""));
  await setSetting("branding", data);
  await logAudit("WEBSITE_SETTINGS_CHANGED", "branding", session?.name || "admin");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function saveHero(formData: FormData) {
  const session = await getAdminSession();
  const data = {
    eyebrow: String(formData.get("eyebrow") || ""),
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    ctaText: String(formData.get("ctaText") || ""),
    ctaUrl: String(formData.get("ctaUrl") || ""),
  };
  await setSetting("hero", data);
  await logAudit("WEBSITE_SETTINGS_CHANGED", "hero", session?.name || "admin");
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function saveNav(formData: FormData) {
  const session = await getAdminSession();
  const labels = formData.getAll("navLabel").map(String);
  const urls = formData.getAll("navUrl").map(String);
  const items = labels.map((label, i) => ({ label, url: urls[i] || "#" })).filter(i => i.label);
  await setSetting("navigation", { items: items.length ? items : DEFAULT_NAV.items });
  await logAudit("WEBSITE_SETTINGS_CHANGED", "navigation", session?.name || "admin");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function saveAnnouncement(formData: FormData) {
  const session = await getAdminSession();
  const data = {
    text: String(formData.get("text") || ""),
    link: String(formData.get("link") || ""),
    bg: String(formData.get("bg") || "#26382A"),
    color: String(formData.get("color") || "#FFF3D5"),
    enabled: formData.get("enabled") === "on",
  };
  await setSetting("announcement", data);
  await logAudit("WEBSITE_SETTINGS_CHANGED", "announcement", session?.name || "admin");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function saveFooter(formData: FormData) {
  const session = await getAdminSession();
  const titles = formData.getAll("colTitle").map(String);
  const linksRaw = formData.getAll("colLinks").map(String); // each: "Label|URL\nLabel|URL"
  const columns = titles.map((title, i) => ({
    title,
    links: (linksRaw[i] || "").split("\n").map(l => l.split("|")).filter(p => p[0]?.trim()).map(([label, url]) => ({ label: label.trim(), url: (url || "#").trim() })),
  })).filter(c => c.title);
  await setSetting("footer", { columns: columns.length ? columns : DEFAULT_FOOTER.columns });
  await logAudit("WEBSITE_SETTINGS_CHANGED", "footer", session?.name || "admin");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
