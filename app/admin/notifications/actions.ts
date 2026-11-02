"use server";
import { requireAdminSession } from "@/lib/auth";
import { logAudit } from "@/lib/settings";
import { sendPush } from "@/lib/push";

export async function sendBroadcast(formData: FormData) {
  const session = await requireAdminSession();
  const title = String(formData.get("title") || "").trim().slice(0, 80);
  const body = String(formData.get("body") || "").trim().slice(0, 200);
  const rawUrl = String(formData.get("url") || "/shop").trim();
  // Only allow links inside the site.
  const url = rawUrl.startsWith("/") ? rawUrl : "/shop";
  if (!title || !body) return { ok: false, message: "Please fill in the title and the message." };
  const res = await sendPush("customer", { title, body, url });
  if (res.skipped) return { ok: false, message: "Notifications are not set up yet (missing keys on Vercel)." };
  await logAudit("PUSH_BROADCAST", "notifications", session.name || "admin", { title, sent: res.sent, failed: res.failed });
  return { ok: true, message: `Sent to ${res.sent} device(s)${res.failed ? `, ${res.failed} failed` : ""}.` };
}
