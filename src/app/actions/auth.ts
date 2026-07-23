"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthFormState = { error?: string } | undefined;

function friendlyAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (message.includes("already registered")) return "Já existe uma conta com esse e-mail.";
  if (message.includes("Password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  return message;
}

export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) {
    return { error: "Contas ainda não estão configuradas neste app." };
  }
  const supabase = await createClient();
  if (!supabase) return { error: "Contas ainda não estão configuradas neste app." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: friendlyAuthError(error.message) };

  redirect("/progresso");
}

export async function signup(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) {
    return { error: "Contas ainda não estão configuradas neste app." };
  }
  const supabase = await createClient();
  if (!supabase) return { error: "Contas ainda não estão configuradas neste app." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || null } },
  });
  if (error) return { error: friendlyAuthError(error.message) };

  // Best-effort — a signed-up-but-not-yet-authenticated session (e.g. email
  // confirmation required) can't pass analytics_events' RLS check, and
  // that's fine: this is a product-analytics count, not a critical path.
  if (data.user) {
    await supabase
      .from("analytics_events")
      .insert({ event_name: "signup", user_id: data.user.id, metadata: {} });
  }

  // Send brand-new accounts to the placement quiz instead of the (still
  // empty) progress dashboard — it was previously only reachable via the
  // "Mais" nav menu, easy to miss right after creating an account.
  redirect("/diagnostico?boasVindas=1");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}

type OAuthIntent = "login" | "signup";

async function startOAuth(
  provider: "google" | "azure" | "github" | "apple",
  intent: OAuthIntent
): Promise<void> {
  if (!isSupabaseConfigured) redirect("/entrar");
  const supabase = await createClient();
  if (!supabase) redirect("/entrar");

  const origin = (await headers()).get("origin");
  const redirectTo =
    intent === "signup" ? `${origin}/auth/callback?intent=signup` : `${origin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error || !data.url) redirect("/entrar?erro=oauth");

  redirect(data.url);
}

export async function signInWithGoogle(intent: OAuthIntent): Promise<void> {
  await startOAuth("google", intent);
}

export async function signInWithMicrosoft(intent: OAuthIntent): Promise<void> {
  await startOAuth("azure", intent);
}

export async function signInWithGitHub(intent: OAuthIntent): Promise<void> {
  await startOAuth("github", intent);
}

export async function signInWithApple(intent: OAuthIntent): Promise<void> {
  await startOAuth("apple", intent);
}
