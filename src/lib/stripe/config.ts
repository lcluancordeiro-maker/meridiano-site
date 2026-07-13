export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const STRIPE_PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID;

/** True once real Stripe credentials are configured. When false, checkout is
 * unavailable and every level marked `premium` shows a paywall to everyone —
 * the rest of the app keeps working in free mode. */
export const isStripeConfigured = Boolean(STRIPE_SECRET_KEY && STRIPE_PREMIUM_PRICE_ID);
