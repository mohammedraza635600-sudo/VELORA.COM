"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export async function upsertCollection(formData: FormData) {
  const session = await getAdminSession();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const data = { name, slug: slugify(name), description: String(formData.get("description") || ""), cover: String(formData.get("cover") || "#4D694E"), order: Number(formData.get("order") || 0), status: String(formData.get("status") || "active") };
  if (id) await prisma.collection.update({ where: { id }, data });
  else await prisma.collection.create({ data });
  await logAudit(id ? "COLLECTION_UPDATED" : "COLLECTION_CREATED", "collections", session?.name || "admin", { id });
  revalidatePath("/admin/collections");
}
export async function deleteCollection(id: string) {
  const session = await getAdminSession();
  await prisma.collection.delete({ where: { id } });
  await logAudit("COLLECTION_DELETED", "collections", session?.name || "admin", { id });
  revalidatePath("/admin/collections");
}
