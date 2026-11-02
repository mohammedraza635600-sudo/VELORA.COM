import webpush from "web-push";
import { prisma } from "./prisma";

// Web Push sender. Needs three environment variables on Vercel (see setup notes):
// NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT. If they are missing,
// notifications are simply skipped — nothing else on the site is affected.
let configured = false;
function configure() {
  if (configured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@velora.com";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export async function sendPush(audience: "admin" | "customer", payload: { title: string; body: string; url?: string }) {
  if (!configure()) return { sent: 0, failed: 0, skipped: true };
  const subs = await prisma.pushSubscription.findMany({ where: { audience } });
  let sent = 0;
  let failed = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload));
        sent++;
      } catch (err: any) {
        failed++;
        // 404/410 = the device unsubscribed or the app was removed — clean it up.
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } }).catch(() => {});
        }
      }
    })
  );
  return { sent, failed, skipped: false };
}
