import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripeClient } from "@/lib/stripe/client";
import { isStripeConfigured, STRIPE_PREMIUM_PRICE_ID } from "@/lib/stripe/config";
import { mapIntervalToPixSchedule } from "@/lib/stripe/pixSchedule";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isStripeConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user || !user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stripe = getStripeClient();
  const serviceRole = createServiceRoleClient();
  if (!stripe || !serviceRole) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await serviceRole.from("subscriptions").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      status: "none",
    });
  }

  const origin = new URL(request.url).origin;

  // "card" covers débito/crédito and international cards out of the box —
  // Stripe doesn't distinguish debit vs. credit as separate payment methods,
  // that's determined by the card's issuer. Boleto and Pix are Brazil/BRL-only,
  // so they're only offered when the Premium price itself is billed in BRL.
  const price = await stripe.prices.retrieve(STRIPE_PREMIUM_PRICE_ID!);
  const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card"];
  let paymentMethodOptions: Stripe.Checkout.SessionCreateParams.PaymentMethodOptions | undefined;

  if (price.currency === "brl") {
    paymentMethodTypes.push("boleto", "pix");

    if (price.recurring && price.unit_amount) {
      // Pix Automático: the customer authorizes a recurring mandate in their
      // bank app. Unlike boleto (a one-off voucher the customer must pay by
      // hand each cycle — Stripe has no auto-debit option for it), Pix
      // mandates DO auto-renew, but confirmation can take up to a few days
      // after each billing date, so Premium access may lag briefly after a
      // renewal compared to card.
      paymentMethodOptions = {
        pix: {
          mandate_options: {
            amount_type: "fixed",
            amount: price.unit_amount,
            currency: "brl",
            payment_schedule: mapIntervalToPixSchedule(price.recurring.interval, price.recurring.interval_count),
            reference: "Meridiano Matematica Premium",
          },
        },
      };
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PREMIUM_PRICE_ID, quantity: 1 }],
    payment_method_types: paymentMethodTypes,
    payment_method_options: paymentMethodOptions,
    success_url: `${origin}/assinatura?success=true`,
    cancel_url: `${origin}/assinatura?canceled=true`,
    metadata: { supabase_user_id: user.id },
    subscription_data: { metadata: { supabase_user_id: user.id } },
  });

  if (!session.url) {
    return NextResponse.json({ error: "checkout_error" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
