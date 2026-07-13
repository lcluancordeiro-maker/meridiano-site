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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || null } },
  });
  if (error) return { error: friendlyAuthError(error.message) };

  redirect("/progresso");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}

async function startOAuth(provider: "google" | "azure"): Promise<void> {
  if (!isSupabaseConfigured) redirect("/entrar");
  const supabase = await createClient();
  if (!supabase) redirect("/entrar");

  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error || !data.url) redirect("/entrar?erro=oauth");

  redirect(data.url);
}

export async function signInWithGoogle(): Promise<void> {
  await startOAuth("google");
}

export async function signInWithMicrosoft(): Promise<void> {
  await startOAuth("azure");
}
