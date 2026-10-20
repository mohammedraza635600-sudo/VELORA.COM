"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function upsertCoupon(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  const data = {
    code: String(formData.get("code") || "").toUpperCase(),
    type: String(formData.get("type") || "percentage"),
    value: Number(formData.get("value") || 0),
    minOrder: Number(formData.get("minOrder") || 0),
    usageLimit: Number(formData.get("usageLimit") || 0),
    expiry: String(formData.get("expiry") || ""),
    active: formData.get("active") === "on",
  };
  if (id) await prisma.coupon.update({ where: { id }, data });
  else await prisma.coupon.create({ data });
  await logAudit(id ? "COUPON_UPDATED" : "COUPON_CREATED", "coupons", session?.name || "admin", { id });
  revalidatePath("/admin/coupons");
}
export async function deleteCoupon(id: string) {
  const session = await requireAdminSession();
  await prisma.coupon.delete({ where: { id } });
  await logAudit("COUPON_DELETED", "coupons", session?.name || "admin", { id });
  revalidatePath("/admin/coupons");
}
