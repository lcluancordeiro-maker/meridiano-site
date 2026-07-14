"use client";

import { useActionState } from "react";
import { deleteMyAccount } from "@/app/actions/account";

export default function DeleteAccountForm({ userEmail }: { userEmail: string }) {
  const [state, formAction, pending] = useActionState(deleteMyAccount, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="confirmation-email" className="text-sm text-foreground">
        Para confirmar, digite seu e-mail (<span className="font-mono">{userEmail}</span>):
      </label>
      <input
        id="confirmation-email"
        name="confirmationEmail"
        type="email"
        required
        autoComplete="off"
        className="w-full rounded-xl border border-error px-4 py-3 text-sm outline-none focus:border-error"
      />
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-error px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Excluir minha conta permanentemente
      </button>
    </form>
  );
}
