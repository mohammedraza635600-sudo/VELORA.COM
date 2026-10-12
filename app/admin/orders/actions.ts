"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: string, formData: FormData) {
  const session = await getAdminSession();
  const status = String(formData.get("status") || "pending");
  await prisma.order.update({ where: { id }, data: { status } });
  await logAudit("ORDER_STATUS_CHANGED", "orders", session?.name || "admin", { id, status });
  revalidatePath("/admin/orders");
}

export async function updateTracking(id: string, formData: FormData) {
  const session = await getAdminSession();
  const carrier = String(formData.get("carrier") || "");
  const tracking = String(formData.get("tracking") || "");
  await prisma.order.update({ where: { id }, data: { carrier, tracking } });
  await logAudit("ORDER_TRACKING_UPDATED", "orders", session?.name || "admin", { id, carrier, tracking });
  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: string) {
  const session = await getAdminSession();
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  await prisma.order.delete({ where: { id } });
  await logAudit("ORDER_DELETED", "orders", session?.name || "admin", { id });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
}
