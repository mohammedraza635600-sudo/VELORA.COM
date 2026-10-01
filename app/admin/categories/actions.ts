"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export async function upsertCategory(formData: FormData) {
  const session = await getAdminSession();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const data = { name, slug: slugify(name), order: Number(formData.get("order") || 0), status: String(formData.get("status") || "visible") };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  await logAudit(id ? "CATEGORY_UPDATED" : "CATEGORY_CREATED", "categories", session?.name || "admin", { id });
  revalidatePath("/admin/categories");
}
export async function deleteCategory(id: string) {
  const session = await getAdminSession();
  await prisma.category.delete({ where: { id } });
  await logAudit("CATEGORY_DELETED", "categories", session?.name || "admin", { id });
  revalidatePath("/admin/categories");
}
