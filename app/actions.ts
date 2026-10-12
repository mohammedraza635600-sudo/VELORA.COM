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

  const result = await prisma.$transaction(async (tx) => {
    // Lock-step stock check — prevents overselling if two customers order the last item at once.
    for (const item of payload.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true, name: true } });
      if (!product || product.stock < item.qty) {
        throw new Error(`Sorry, "${item.name}" only has ${product?.stock ?? 0} left in stock.`);
      }
    }

    const order = await tx.order.create({
      data: {
        name: payload.name,
        email: payload.email,
        address: payload.address,
        city: payload.city,
        zip: payload.zip,
        method: payload.method,
        // No real payment gateway is connected yet — never mark an order "Paid"
        // just because the browser reached this page. Admin confirms payment manually.
        payment: "Pending",
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
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }

    return order;
  });

  return { orderId: result.id, total };
}
