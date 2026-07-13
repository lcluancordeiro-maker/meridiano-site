import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripeClient } from "@/lib/stripe/client";
import { isStripeConfigured, STRIPE_PREMIUM_PRICE_ID } from "@/lib/stripe/config";

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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PREMIUM_PRICE_ID, quantity: 1 }],
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
