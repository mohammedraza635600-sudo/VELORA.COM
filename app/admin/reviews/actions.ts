"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function setReviewApproved(id: string, approved: boolean) {
  const session = await requireAdminSession();
  await prisma.review.update({ where: { id }, data: { approved } });
  await logAudit(approved ? "REVIEW_APPROVED" : "REVIEW_UNPUBLISHED", "reviews", session?.name || "admin", { id });
  revalidatePath("/admin/reviews");
}
export async function deleteReview(id: string) {
  const session = await requireAdminSession();
  await prisma.review.delete({ where: { id } });
  await logAudit("REVIEW_DELETED", "reviews", session?.name || "admin", { id });
  revalidatePath("/admin/reviews");
}
