"use server";

import { randomUUID } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { getAuthedSupabase } from "@/lib/actionAuth";
import { sendEmail } from "@/lib/email/resend";

export type ConsentFormState = { error?: string; sent?: boolean } | undefined;

/** Requests parental consent for the current (verified-as-minor) user —
 * generates a fresh confirmation token, stores it, and emails the parent a
 * link to /consentimento/[token]. Without RESEND_API_KEY configured, the
 * link is still generated and stored (so it works if you look it up
 * manually), but no email actually goes out — see src/lib/email/resend.ts. */
export async function requestParentalConsent(_prevState: ConsentFormState, formData: FormData): Promise<ConsentFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured"
      ? { error: "Esse recurso ainda não está disponível." }
      : { error: "Faça login para continuar." };
  }
  const { user } = auth;

  const parentEmail = String(formData.get("parentEmail") ?? "").trim();
  if (!parentEmail || !parentEmail.includes("@")) {
    return { error: "Informe um e-mail válido do responsável." };
  }

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) return { error: "Esse recurso ainda não está disponível." };

  const token = randomUUID();

  const { error } = await serviceRole.from("parent_consents").upsert({
    user_id: user.id,
    parent_email: parentEmail,
    token,
    confirmed_at: null,
    created_at: new Date().toISOString(),
  });

  if (error) return { error: "Não foi possível enviar o pedido de consentimento. Tente novamente." };

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const confirmUrl = `${origin.replace(/\/$/, "")}/consentimento/${token}`;

  await sendEmail(
    parentEmail,
    "Autorização para uso do Meridiano Matemática",
    `<p>Olá,</p>
     <p>Seu filho(a) pediu para usar os recursos sociais (chat, comunidades e aulas ao vivo) do Meridiano Matemática, um app de ensino de matemática.</p>
     <p>Se você autoriza, confirme clicando no link abaixo:</p>
     <p><a href="${confirmUrl}">${confirmUrl}</a></p>
     <p>Se você não reconhece esse pedido, pode ignorar este e-mail com segurança.</p>`
  );

  return { sent: true };
}
