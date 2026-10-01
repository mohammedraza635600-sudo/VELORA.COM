"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, formData: FormData) {
  const rating = Number(formData.get("rating") || 5);
  const name = String(formData.get("name") || "Anonymous").trim() || "Anonymous";
  const text = String(formData.get("text") || "").trim();
  if (!text) return;
  await prisma.review.create({ data: { productId, rating, name, text, approved: false } });
  revalidatePath(`/product`);
}

export async function placeOrder(payload: {
  name: string; email: string; address: string; city: string; zip: string; method: string;
  items: { productId: string; name: string; size: string; price: number; qty: number }[];
}) {
  const subtotal = payload.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const order = await prisma.order.create({
    data: {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      city: payload.city,
      zip: payload.zip,
      method: payload.method,
      payment: payload.method === "cod" ? "Pending" : "Paid",
      subtotal,
      shipping,
      total,
      items: {
        create: payload.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          price: i.price,
          qty: i.qty,
        })),
      },
    },
  });

  for (const item of payload.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.qty } },
    }).catch(() => {});
  }

  return { orderId: order.id, total };
}
