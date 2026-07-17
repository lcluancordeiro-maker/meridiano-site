"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: null };

export function SigninForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-deep">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-deep">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-navy-deep px-4 py-3 font-semibold text-white transition hover:bg-navy disabled:opacity-60"
      >
        {isPending ? "Entrando…" : "Entrar"}
      </button>

      <p className="text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-navy-deep hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
