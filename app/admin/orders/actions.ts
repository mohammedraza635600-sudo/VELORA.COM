"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Statuses where the goods are NOT going to the customer, so the stock goes back on the shelf.
const RESTOCK_STATUSES = ["cancelled", "returned"];
const VALID_STATUSES = ["pending", "processing", "packed", "shipped", "delivered", "cancelled", "refunded", "returned"];

export async function updateOrderStatus(id: string, formData: FormData) {
  const session = await requireAdminSession();
  const status = String(formData.get("status") || "pending");
  if (!VALID_STATUSES.includes(status)) return;
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return;
    const wasRestocked = RESTOCK_STATUSES.includes(order.status);
    const willRestock = RESTOCK_STATUSES.includes(status);
    // Moving INTO cancelled/returned gives the stock back; moving OUT of it takes it again.
    if (!wasRestocked && willRestock) {
      for (const it of order.items) await tx.product.updateMany({ where: { id: it.productId }, data: { stock: { increment: it.qty } } });
    } else if (wasRestocked && !willRestock) {
      for (const it of order.items) await tx.product.updateMany({ where: { id: it.productId }, data: { stock: { decrement: it.qty } } });
    }
    await tx.order.update({ where: { id }, data: { status } });
  });
  await logAudit("ORDER_STATUS_CHANGED", "orders", session?.name || "admin", { id, status });
  revalidatePath("/admin/orders");
}

export async function updateTracking(id: string, formData: FormData) {
  const session = await requireAdminSession();
  const carrier = String(formData.get("carrier") || "");
  const tracking = String(formData.get("tracking") || "");
  await prisma.order.update({ where: { id }, data: { carrier, tracking } });
  await logAudit("ORDER_TRACKING_UPDATED", "orders", session?.name || "admin", { id, carrier, tracking });
  revalidatePath("/admin/orders");
}

export async function updatePayment(id: string, formData: FormData) {
  const session = await requireAdminSession();
  const payment = String(formData.get("payment") || "Pending");
  await prisma.order.update({ where: { id }, data: { payment } });
  await logAudit("ORDER_PAYMENT_CHANGED", "orders", session?.name || "admin", { id, payment });
  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: string) {
  const session = await requireAdminSession();
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return;
    // Deleting an order that was still active (not already cancelled/returned) puts its stock back.
    if (!RESTOCK_STATUSES.includes(order.status)) {
      for (const it of order.items) await tx.product.updateMany({ where: { id: it.productId }, data: { stock: { increment: it.qty } } });
    }
    await tx.orderItem.deleteMany({ where: { orderId: id } });
    await tx.order.delete({ where: { id } });
  });
  await logAudit("ORDER_DELETED", "orders", session?.name || "admin", { id });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
}
