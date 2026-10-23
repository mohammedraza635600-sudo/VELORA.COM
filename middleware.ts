import { NextRequest, NextResponse } from "next/server";

// Second line of defence for the admin panel. The admin layout also checks the session,
// but Next.js can skip re-running a layout when moving between pages, so the check must
// ALSO happen here — before any /admin page or server action is allowed to run.
// Uses the Web Crypto API because middleware runs on the Edge runtime (no Node "crypto").
const COOKIE_NAME = "velora_admin_session";
const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function isValidSession(raw: string | undefined) {
  if (!raw) return false;
  const [value, hmac] = raw.split(".");
  if (!value || !hmac) return false;
  const secret = process.env.ADMIN_SECRET || "dev-secret-change-me";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  if (expected.length !== hmac.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ hmac.charCodeAt(i);
  if (diff !== 0) return false;
  try {
    const json = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(json, (c) => c.charCodeAt(0))));
    return typeof payload.ts === "number" && Date.now() - payload.ts <= MAX_AGE_MS;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  if (await isValidSession(req.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/velora-staff-k9x2m";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
