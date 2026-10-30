"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidAdminPassword, createSessionCookieValue, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { clientIp, isLockedOut, recordFailure } from "@/lib/rateLimit";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "Admin");
  const role = String(formData.get("role") || "SUPER_ADMIN");
  const ip = await clientIp();
  if (await isLockedOut("ADMIN_LOGIN_FAILED", ip)) {
    redirect("/velora-staff-k9x2m?error=locked");
  }
  if (!isValidAdminPassword(password)) {
    await recordFailure("ADMIN_LOGIN_FAILED", ip);
    redirect("/velora-staff-k9x2m?error=1");
  }
  const value = createSessionCookieValue(name, role);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE_NAME, value, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
  redirect("/admin");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE_NAME);
  redirect("/velora-staff-k9x2m");
}
