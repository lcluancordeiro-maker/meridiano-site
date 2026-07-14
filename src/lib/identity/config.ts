import { STRIPE_SECRET_KEY } from "@/lib/stripe/config";

// Stripe Identity uses its own webhook endpoint/signing secret, separate
// from the checkout/subscription webhook in src/lib/stripe/config.ts —
// Stripe recommends one endpoint per event category.
export const STRIPE_IDENTITY_WEBHOOK_SECRET = process.env.STRIPE_IDENTITY_WEBHOOK_SECRET;

/** True once real Stripe Identity credentials are configured. When false,
 * identity verification (and everything gated behind it — chat, communities,
 * lives) is unavailable, but the rest of the app keeps working. */
export const isIdentityConfigured = Boolean(STRIPE_SECRET_KEY && STRIPE_IDENTITY_WEBHOOK_SECRET);

/** The age (in whole years) below which social features (chat, communities,
 * lives) require confirmed parental consent even after identity is verified. */
export const MINIMUM_AGE_WITHOUT_PARENTAL_CONSENT = 18;
