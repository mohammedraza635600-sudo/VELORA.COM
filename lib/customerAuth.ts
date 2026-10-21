import { cookies } from "next/headers";
import crypto from "crypto";

// Customer accounts are a separate, lightweight auth system from the admin login
// (lib/auth.ts). Different cookie, different secret fallback — logging in as a
// customer never grants admin access and vice versa.
const COOKIE_NAME = "velora_customer_session";

function secret() {
  // Falls back to ADMIN_SECRET so this works even before a dedicated
  // CUSTOMER_SECRET env var is set on Vercel — set CUSTOMER_SECRET there
  // for a cleaner separation whenever convenient, it's not required.
  return process.env.CUSTOMER_SECRET || process.env.ADMIN_SECRET || "dev-secret-change-me";
}

function sign(value: string) {
  const hmac = crypto.createHmac("sha256", secret()).update(value).digest("hex");
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

// --- Password hashing (scrypt, salted) — every customer gets their own salt,
// unlike the admin login which is a single shared password. ---
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(check, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createCustomerSession(customerId: string, email: string, name: string) {
  const payload = JSON.stringify({ customerId, email, name, ts: Date.now() });
  const base = Buffer.from(payload).toString("base64url");
  const value = sign(base);
  const jar = await cookies();
  jar.set(COOKIE_NAME, value, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
}

export async function clearCustomerSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCustomerSession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const base = verify(raw);
  if (!base) return null;
  try {
    const payload = JSON.parse(Buffer.from(base, "base64url").toString("utf8"));
    return payload as { customerId: string; email: string; name: string; ts: number };
  } catch {
    return null;
  }
}

export async function requireCustomerSession() {
  const session = await getCustomerSession();
  if (!session) throw new Error("Please sign in to continue.");
  return session;
}
