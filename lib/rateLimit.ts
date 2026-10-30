import { headers } from "next/headers";
import { prisma } from "./prisma";

// Simple brute-force protection for logins. Failed attempts are written to the AuditLog table
// (shared by every server instance, unlike in-memory counters) and counted over a time window.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

export async function isLockedOut(action: string, key: string) {
  const since = new Date(Date.now() - WINDOW_MS);
  const fails = await prisma.auditLog.count({ where: { action, by: key, ts: { gte: since } } });
  return fails >= MAX_FAILS;
}

export async function recordFailure(action: string, key: string) {
  await prisma.auditLog.create({ data: { action, resource: "auth", by: key } });
}
