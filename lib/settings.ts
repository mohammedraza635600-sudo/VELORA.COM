import { prisma } from "./prisma";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown) {
  const json = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key },
    update: { value: json },
    create: { key, value: json },
  });
}

export async function logAudit(action: string, resource: string, by: string, meta?: unknown) {
  await prisma.auditLog.create({
    data: { action, resource, by, meta: meta ? JSON.stringify(meta) : null },
  });
}

export const DEFAULT_BRANDING = {
  primary: "#4D694E",
  cream: "#FFF3D5",
  oliveDeep: "#344A38",
  oliveDark: "#26382A",
  creamSoft: "#FFF8E8",
  offWhite: "#FAF7EF",
  taupe: "#B7AE99",
  charcoal: "#191B18",
};

export const DEFAULT_HERO = {
  eyebrow: "THE NEW SEASON — MENSWEAR",
  title: "DEFINED BY DISTINCTION.",
  subtitle: "Tailoring for the modern man, cut from the finest natural fibres and shaped for permanence.",
  ctaText: "SHOP THE COLLECTION",
  ctaUrl: "/shop",
  videoUrl: "",
};

export const DEFAULT_NAV = {
  items: [
    { label: "SHOP", url: "/shop" },
    { label: "NEW IN", url: "/shop" },
    { label: "COLLECTIONS", url: "/#collections" },
    { label: "ABOUT", url: "/#story" },
  ],
};

export const DEFAULT_FOOTER = {
  columns: [
    { title: "SHOP", links: [{ label: "Shop", url: "/shop" }, { label: "New In", url: "/shop" }, { label: "About", url: "/#story" }] },
    { title: "CLIENT SERVICES", links: [{ label: "Shipping", url: "#" }, { label: "Returns", url: "#" }, { label: "FAQ", url: "#" }] },
    { title: "SOCIAL", links: [{ label: "Instagram", url: "#" }, { label: "Pinterest", url: "#" }, { label: "TikTok", url: "#" }] },
  ],
};

export const DEFAULT_ANNOUNCEMENT = {
  text: "Complimentary shipping on all orders over $200",
  enabled: true,
  bg: "#26382A",
  color: "#FFF3D5",
  link: "",
};
