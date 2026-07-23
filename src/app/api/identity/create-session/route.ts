import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripeClient } from "@/lib/stripe/client";
import { isIdentityConfigured } from "@/lib/identity/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isIdentityConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stripe = getStripeClient();
  const serviceRole = createServiceRoleClient();
  if (!stripe || !serviceRole) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const origin = new URL(request.url).origin;

  const session = await stripe.identity.verificationSessions.create({
    type: "document",
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
    options: { document: { require_matching_selfie: true } },
    return_url: `${origin}/verificar-identidade?concluido=true`,
  });

  await serviceRole.from("identity_verifications").upsert({
    user_id: user.id,
    stripe_verification_session_id: session.id,
    status: "pending",
    updated_at: new Date().toISOString(),
  });

  if (!session.url) {
    return NextResponse.json({ error: "session_error" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
