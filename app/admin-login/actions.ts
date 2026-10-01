"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidAdminPassword, createSessionCookieValue, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "Admin");
  const role = String(formData.get("role") || "SUPER_ADMIN");
  if (!isValidAdminPassword(password)) {
    redirect("/admin-login?error=1");
  }
  const value = createSessionCookieValue(name, role);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE_NAME, value, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
  redirect("/admin");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE_NAME);
  redirect("/admin-login");
}
