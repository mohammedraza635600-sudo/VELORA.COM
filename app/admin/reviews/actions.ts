"use server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function setReviewApproved(id: string, approved: boolean) {
  const session = await getAdminSession();
  await prisma.review.update({ where: { id }, data: { approved } });
  await logAudit(approved ? "REVIEW_APPROVED" : "REVIEW_UNPUBLISHED", "reviews", session?.name || "admin", { id });
  revalidatePath("/admin/reviews");
}
export async function deleteReview(id: string) {
  const session = await getAdminSession();
  await prisma.review.delete({ where: { id } });
  await logAudit("REVIEW_DELETED", "reviews", session?.name || "admin", { id });
  revalidatePath("/admin/reviews");
}
