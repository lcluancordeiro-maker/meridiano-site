import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { STRIPE_WEBHOOK_SECRET, isStripeConfigured } from "@/lib/stripe/config";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

async function syncSubscription(
  serviceRole: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  subscription: Stripe.Subscription
) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const userId = subscription.metadata?.supabase_user_id;
  const periodEndSeconds = subscription.items.data[0]?.current_period_end;

  const payload = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_end: periodEndSeconds ? new Date(periodEndSeconds * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    await serviceRole.from("subscriptions").upsert({ user_id: userId, ...payload });
  } else {
    await serviceRole.from("subscriptions").update(payload).eq("stripe_customer_id", customerId);
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const stripe = getStripeClient();
  const serviceRole = createServiceRoleClient();
  if (!stripe || !serviceRole) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing stripe-signature header");
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (typeof session.subscription === "string") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await syncSubscription(serviceRole, subscription);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(serviceRole, event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
