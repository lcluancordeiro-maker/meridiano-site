import "server-only";
import webpush from "web-push";
import { CRON_SECRET, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT, isPushConfigured } from "./config";

let configured = false;

function ensureConfigured() {
  if (configured || !isPushConfigured) return;
  webpush.setVapidDetails(VAPID_SUBJECT!, VAPID_PUBLIC_KEY!, VAPID_PRIVATE_KEY!);
  configured = true;
}

export type PushSubscriptionJSON = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

/** Sends a push notification, returning whether the subscription is still
 * valid. A false return (410/404 from the push service) means the caller
 * should delete that subscription — the browser unsubscribed it. */
export async function sendPushNotification(
  subscription: PushSubscriptionJSON,
  payload: { title: string; body: string; url?: string }
): Promise<boolean> {
  ensureConfigured();
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 404 || statusCode === 410) return false;
    throw error;
  }
}

/** Constant-time-ish check for the cron secret header. Not cryptographically
 * constant-time, but good enough for a shared secret guarding a single
 * internal endpoint (not a public auth boundary). */
export function isValidCronSecret(headerValue: string | null): boolean {
  return Boolean(CRON_SECRET) && headerValue === CRON_SECRET;
}
