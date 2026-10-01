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
  await prisma.product.delete({ where: { id } });
  await logAudit("PRODUCT_DELETED", "products", session?.name || "admin", { id });
  revalidatePath("/admin/products");
}

export async function bulkUpdateProducts(formData: FormData) {
  const session = await getAdminSession();
  const ids = formData.getAll("ids").map(String);
  const action = String(formData.get("bulkAction") || "");
  if (!ids.length || !action) return;
  if (action === "delete") {
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
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
