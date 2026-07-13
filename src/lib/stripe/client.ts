import "server-only";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./config";

let client: Stripe | null = null;

/** Server-only Stripe client, or null when no secret key is configured. */
export function getStripeClient(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  if (!client) {
    client = new Stripe(STRIPE_SECRET_KEY);
  }
  return client;
}
