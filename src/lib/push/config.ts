export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
export const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
export const CRON_SECRET = process.env.CRON_SECRET;

/** True once VAPID keys are configured. When false, the notification opt-in
 * is hidden and /api/push/* routes no-op — the rest of the app keeps
 * working without push notifications. */
export const isPushConfigured = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && VAPID_SUBJECT);
