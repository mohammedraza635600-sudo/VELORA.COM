"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const session = await getAdminSession();
  const name = String(formData.get("name") || "");
  const data = {
    name,
    slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
    category: String(formData.get("category") || ""),
    collection: String(formData.get("collection") || ""),
    price: Number(formData.get("price") || 0),
    compareAt: formData.get("compareAt") ? Number(formData.get("compareAt")) : null,
    sku: String(formData.get("sku") || ""),
    stock: Number(formData.get("stock") || 0),
    status: String(formData.get("status") || "draft"),
    colors: String(formData.get("colors") || ""),
    images: String(formData.get("images") || ""),
    video: String(formData.get("video") || ""),
    description: String(formData.get("description") || ""),
    material: String(formData.get("material") || ""),
    care: String(formData.get("care") || ""),
  };
  const p = await prisma.product.create({ data });
  await logAudit("PRODUCT_CREATED", "products", session?.name || "admin", { id: p.id });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await getAdminSession();
  const data = {
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || ""),
    collection: String(formData.get("collection") || ""),
    price: Number(formData.get("price") || 0),
    compareAt: formData.get("compareAt") ? Number(formData.get("compareAt")) : null,
    sku: String(formData.get("sku") || ""),
    stock: Number(formData.get("stock") || 0),
    status: String(formData.get("status") || "draft"),
    colors: String(formData.get("colors") || ""),
    images: String(formData.get("images") || ""),
    video: String(formData.get("video") || ""),
    description: String(formData.get("description") || ""),
    material: String(formData.get("material") || ""),
    care: String(formData.get("care") || ""),
  };
  await prisma.product.update({ where: { id }, data });
  await logAudit("PRODUCT_UPDATED", "products", session?.name || "admin", { id });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await getAdminSession();
  try {
    await prisma.product.delete({ where: { id } });
    await logAudit("PRODUCT_DELETED", "products", session?.name || "admin", { id });
  } catch (err: any) {
    if (err?.code === "P2003") {
      // Product has existing orders attached — archive instead of hard-deleting.
      await prisma.product.update({ where: { id }, data: { status: "archived" } }).catch(() => {});
      await logAudit("PRODUCT_ARCHIVED_HAS_ORDERS", "products", session?.name || "admin", { id });
    } else if (err?.code === "P2025") {
      // Already deleted (e.g. double click) — nothing to do.
    } else {
      throw err;
    }
  }
  revalidatePath("/admin/products");
}

export async function bulkUpdateProducts(formData: FormData) {
  const session = await getAdminSession();
  const ids = formData.getAll("ids").map(String);
  const action = String(formData.get("bulkAction") || "");
  if (!ids.length || !action) return;
  if (action === "delete") {
    try {
      await prisma.product.deleteMany({ where: { id: { in: ids } } });
    } catch (err: any) {
      if (err?.code === "P2003") {
        // Some of these products have existing orders — archive everything selected instead.
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: "archived" } });
      } else {
        throw err;
      }
    }
  } else {
    await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: action } });
  }
  await logAudit("PRODUCT_BULK_" + action.toUpperCase(), "products", session?.name || "admin", { ids });
  revalidatePath("/admin/products");
}

export async function adjustStock(id: string, delta: number) {
  const session = await getAdminSession();
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return;
  const next = Math.max(0, p.stock + delta);
  await prisma.product.update({ where: { id }, data: { stock: next } });
  await logAudit("INVENTORY_UPDATED", "products", session?.name || "admin", { id, old: p.stock, next });
  revalidatePath("/admin/products");
}
