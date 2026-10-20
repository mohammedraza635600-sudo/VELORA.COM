import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "velora_admin_session";

function sign(value: string) {
  const secret = process.env.ADMIN_SECRET || "dev-secret-change-me";
  const hmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed: string) {
  const [value, hmac] = signed.split(".");
  if (!value || !hmac) return null;
  const expected = sign(value).split(".")[1];
  if (hmac.length !== expected.length) return null;
  const ok = crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  return ok ? value : null;
}

export function createSessionCookieValue(name: string, role: string) {
  const payload = JSON.stringify({ name, role, ts: Date.now() });
  const base = Buffer.from(payload).toString("base64url");
  return sign(base);
}

export function isValidAdminPassword(password: string) {
  return password === (process.env.ADMIN_PASSWORD || "");
}

export async function getAdminSession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const base = verify(raw);
  if (!base) return null;
  try {
    const payload = JSON.parse(Buffer.from(base, "base64url").toString("utf8"));
    return payload as { name: string; role: string; ts: number };
  } catch {
    return null;
  }
}

// Every admin server action must call this (not getAdminSession directly).
// Server Actions are callable POST endpoints on their own — without this check,
// anyone who discovers the action's reference could run it even while logged out,
// bypassing the page-level /admin redirect entirely.
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: admin session required");
  }
  return session;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
