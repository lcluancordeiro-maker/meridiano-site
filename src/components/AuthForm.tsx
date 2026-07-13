"use client";

import { useActionState } from "react";
import type { AuthFormState } from "@/app/actions/auth";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AuthForm({
  action,
  mode,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  mode: "login" | "signup";
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const { dict } = useTranslation();
  const { auth } = dict;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-foreground">
            {auth.nome}
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          {auth.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          {auth.senha}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? auth.enviando : mode === "login" ? auth.entrarButton : auth.criarContaButton}
      </button>
    </form>
  );
}
