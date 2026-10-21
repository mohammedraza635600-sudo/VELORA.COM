"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword, createCustomerSession, clearCustomerSession, getCustomerSession } from "@/lib/customerAuth";

export async function submitReview(productId: string, formData: FormData) {
  const rating = Number(formData.get("rating") || 5);
  const name = String(formData.get("name") || "Anonymous").trim() || "Anonymous";
  const text = String(formData.get("text") || "").trim();
  if (!text) return;
  await prisma.review.create({ data: { productId, rating, name, text, approved: false } });
  revalidatePath(`/product`);
}

// Free-shipping threshold / flat shipping fee, in ₹. Shared by the checkout page's
// preview total and the real total computed here — keep both in sync.
const FREE_SHIPPING_OVER = 1999;
const SHIPPING_FEE = 99;

// Looks up a coupon and returns the discount it would give on `subtotal`, without
// applying it. Used for the "Apply" button on checkout so the customer sees the
// discount before placing the order. The real, authoritative calculation happens
// again inside placeOrder() — this function's result is never trusted blindly.
export async function validateCoupon(code: string, subtotal: number) {
  const clean = code.trim().toUpperCase();
  if (!clean) return { ok: false, message: "Enter a coupon code." };
  const coupon = await prisma.coupon.findUnique({ where: { code: clean } });
  if (!coupon || !coupon.active) return { ok: false, message: "Invalid or inactive coupon." };
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) return { ok: false, message: "This coupon has expired." };
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return { ok: false, message: "This coupon has reached its usage limit." };
  if (subtotal < coupon.minOrder) return { ok: false, message: `Minimum order of ₹${coupon.minOrder} required for this coupon.` };

  let discount = 0;
  if (coupon.type === "percentage") discount = Math.round((subtotal * coupon.value) / 100);
  else if (coupon.type === "fixed") discount = coupon.value;
  // "free_shipping" type gives discount=0 here; the free shipping itself is applied in placeOrder.
  discount = Math.min(discount, subtotal);

  return { ok: true, code: clean, type: coupon.type, discount, message: coupon.type === "free_shipping" ? "Free shipping applied!" : `₹${discount} off applied!` };
}

export async function placeOrder(payload: {
  name: string; email: string; address: string; city: string; zip: string; method: string;
  couponCode?: string;
  items: { productId: string; name: string; size: string; price: number; qty: number }[];
}) {
  const subtotal = payload.items.reduce((s, i) => s + i.price * i.qty, 0);
  // If the buyer is signed in, attach the order to their account so it shows in order history.
  const customerSession = await getCustomerSession();

  const result = await prisma.$transaction(async (tx) => {
    // Lock-step stock check — prevents overselling if two customers order the last item at once.
    for (const item of payload.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true, name: true } });
      if (!product || product.stock < item.qty) {
        throw new Error(`Sorry, "${item.name}" only has ${product?.stock ?? 0} left in stock.`);
      }
    }

    // Re-validate and apply the coupon server-side — never trust a discount amount
    // sent from the browser.
    let discount = 0;
    let freeShipping = false;
    let couponCode: string | null = null;
    if (payload.couponCode) {
      const clean = payload.couponCode.trim().toUpperCase();
      const coupon = await tx.coupon.findUnique({ where: { code: clean } });
      const validMinOrder = !coupon || subtotal >= coupon.minOrder;
      const validExpiry = !coupon?.expiry || new Date(coupon.expiry) >= new Date();
      const validUsage = !coupon || coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit;
      if (coupon && coupon.active && validExpiry && validUsage && validMinOrder) {
        couponCode = coupon.code;
        if (coupon.type === "percentage") discount = Math.round((subtotal * coupon.value) / 100);
        else if (coupon.type === "fixed") discount = coupon.value;
        else if (coupon.type === "free_shipping") freeShipping = true;
        discount = Math.min(discount, subtotal);
        await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }

    const shipping = freeShipping || subtotal - discount > FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);

    const order = await tx.order.create({
      data: {
        customerId: customerSession?.customerId ?? null,
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
        discount,
        couponCode,
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

  return { orderId: result.id, total: result.total };
}

export async function trackOrder(orderId: string, email: string) {
  // Customers see a short code like "#AB12CD34" (the last 8 characters of the real id),
  // so accept either that short code or the full id. The email must also match.
  const code = orderId.trim().replace(/^#/, "").toLowerCase();
  if (code.length < 6 || !email.trim()) {
    return { ok: false as const, message: "Please enter your order ID and the email used at checkout." };
  }
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: code }, { id: { endsWith: code } }],
      email: { equals: email.trim(), mode: "insensitive" },
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  if (!order) return { ok: false as const, message: "No order found with that ID and email. Double-check both and try again." };
  return { ok: true as const, order };
}

// Loads live details for the slugs saved in a visitor's wishlist (published products only).
export async function getProductsBySlugs(slugs: string[]) {
  const clean = Array.isArray(slugs) ? slugs.filter((s) => typeof s === "string").slice(0, 100) : [];
  if (clean.length === 0) return [];
  return prisma.product.findMany({ where: { slug: { in: clean }, status: "published" } });
}

export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  try {
    await prisma.subscriber.upsert({ where: { email }, update: {}, create: { email } });
    return { ok: true, message: "Subscribed — thank you!" };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

// --- Customer accounts ---

export async function signupCustomer(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!name || !email || password.length < 8) {
    return { ok: false, message: "Please fill in your name, email, and a password of at least 8 characters." };
  }
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return { ok: false, message: "An account with this email already exists. Try signing in instead." };
  }
  const passwordHash = hashPassword(password);
  const customer = existing
    ? await prisma.customer.update({ where: { id: existing.id }, data: { passwordHash, name } })
    : await prisma.customer.create({ data: { name, email, passwordHash } });
  await createCustomerSession(customer.id, customer.email, customer.name);
  return { ok: true };
}

export async function loginCustomer(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !customer.passwordHash || !verifyPassword(password, customer.passwordHash)) {
    return { ok: false, message: "Incorrect email or password." };
  }
  await createCustomerSession(customer.id, customer.email, customer.name);
  return { ok: true };
}

export async function logoutCustomer() {
  await clearCustomerSession();
}
