"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/app/actions/auth";
import type { ProfileTipo } from "@/lib/database.types";

const initialState: AuthState = { error: null };

export function SignupForm({ defaultTipo }: { defaultTipo: ProfileTipo }) {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);
  const [tipo, setTipo] = useState<ProfileTipo>(defaultTipo);

  if (state.success) {
    return (
      <div className="rounded-lg border border-green/30 bg-green/10 p-5 text-sm text-green">
        {state.success}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-navy-deep">Quero:</p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { value: "comprador", label: "Comprar" },
              { value: "vendedor", label: "Vender" },
              { value: "ambos", label: "Ambos" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
                tipo === opt.value
                  ? "border-navy-deep bg-navy-deep text-white"
                  : "border-border bg-white text-navy-deep hover:border-navy-light"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={opt.value}
                checked={tipo === opt.value}
                onChange={() => setTipo(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Field label="Nome completo" name="nome" type="text" required autoComplete="name" />
      <Field label="Empresa (opcional)" name="empresa" type="text" autoComplete="organization" />
      <Field label="Telefone (opcional)" name="telefone" type="tel" autoComplete="tel" />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" />
      <Field
        label="Senha"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        hint="Mínimo de 8 caracteres."
      />

      {state.error && (
        <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-navy-deep px-4 py-3 font-semibold text-white transition hover:bg-navy disabled:opacity-60"
      >
        {isPending ? "Criando conta…" : "Criar conta"}
      </button>

      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-medium text-navy-deep hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy-deep">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        minLength={name === "password" ? 8 : undefined}
        className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
