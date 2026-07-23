import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { isIdentityConfigured, STRIPE_IDENTITY_WEBHOOK_SECRET, MINIMUM_AGE_WITHOUT_PARENTAL_CONSENT } from "@/lib/identity/config";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { calculateAge, isMinor } from "@/lib/identity/age";

function dobToIsoDate(dob: { day: number | null; month: number | null; year: number | null }): string | null {
  if (!dob.day || !dob.month || !dob.year) return null;
  const mm = String(dob.month).padStart(2, "0");
  const dd = String(dob.day).padStart(2, "0");
  return `${dob.year}-${mm}-${dd}`;
}

export async function POST(request: Request) {
  if (!isIdentityConfigured || !STRIPE_IDENTITY_WEBHOOK_SECRET) {
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
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_IDENTITY_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "identity.verification_session.verified": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      const userId = session.client_reference_id ?? session.metadata?.supabase_user_id;
      if (!userId) break;

      const dob = session.verified_outputs?.dob;
      const dateOfBirth = dob ? dobToIsoDate(dob) : null;
      const status = dateOfBirth && isMinor(calculateAge(dateOfBirth), MINIMUM_AGE_WITHOUT_PARENTAL_CONSENT)
        ? "verified_minor"
        : "verified";

      await serviceRole.from("identity_verifications").upsert({
        user_id: userId,
        stripe_verification_session_id: session.id,
        status,
        date_of_birth: dateOfBirth,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      break;
    }
    case "identity.verification_session.requires_input":
    case "identity.verification_session.canceled": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      const userId = session.client_reference_id ?? session.metadata?.supabase_user_id;
      if (!userId) break;

      await serviceRole
        .from("identity_verifications")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
