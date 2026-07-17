"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "@/app/actions/profile";
import type { Profile } from "@/lib/database.types";

const initialState: ProfileState = { error: null };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-navy-deep">Tipo de conta</p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { value: "comprador", label: "Comprador" },
              { value: "vendedor", label: "Vendedor" },
              { value: "ambos", label: "Ambos" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-md border border-border px-3 py-2 text-center text-sm font-medium text-navy-deep has-[:checked]:border-navy-deep has-[:checked]:bg-navy-deep has-[:checked]:text-white"
            >
              <input
                type="radio"
                name="tipo"
                value={opt.value}
                defaultChecked={profile.tipo === opt.value}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Field label="Nome completo" name="nome" defaultValue={profile.nome} required />
      <Field label="Empresa (opcional)" name="empresa" defaultValue={profile.empresa ?? ""} />
      <Field label="Telefone (opcional)" name="telefone" defaultValue={profile.telefone ?? ""} />
      <Field label="CPF/CNPJ (opcional)" name="cpf_cnpj" defaultValue={profile.cpf_cnpj ?? ""} />

      {state.error && (
        <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-md bg-green/10 px-3 py-2 text-sm text-green">
          Perfil atualizado com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-navy-deep px-6 py-3 font-semibold text-white transition hover:bg-navy disabled:opacity-60"
      >
        {isPending ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy-deep">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
      />
    </div>
  );
}
