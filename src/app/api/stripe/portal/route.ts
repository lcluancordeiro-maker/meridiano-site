import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripeClient } from "@/lib/stripe/client";
import { isStripeConfigured } from "@/lib/stripe/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isStripeConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const customerId = data?.stripe_customer_id as string | undefined;
  if (!customerId) {
    return NextResponse.json({ error: "no_customer" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/assinatura`,
  });

  return NextResponse.json({ url: session.url });
}
