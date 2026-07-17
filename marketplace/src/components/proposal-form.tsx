"use client";

import { useActionState } from "react";
import { createProposalAction, type ProposalState } from "@/app/actions/proposals";

const initialState: ProposalState = { error: null };

export function ProposalForm({ listingId }: { listingId: string }) {
  const [state, formAction, isPending] = useActionState(createProposalAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-green/30 bg-green/10 p-5 text-sm text-green">
        Proposta enviada! Acompanhe a resposta em{" "}
        <a href="/dashboard/propostas" className="font-semibold underline">
          Minhas propostas
        </a>
        .
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="listing_id" value={listingId} />

      <div>
        <label htmlFor="valor_proposto" className="mb-1.5 block text-sm font-medium text-navy-deep">
          Valor da proposta (R$)
        </label>
        <input
          id="valor_proposto"
          name="valor_proposto"
          type="number"
          min={1}
          step="0.01"
          required
          className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
        />
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-navy-deep">
          Mensagem (opcional)
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-gold px-4 py-3 font-semibold text-navy-deep transition hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Enviando…" : "Enviar proposta"}
      </button>
    </form>
  );
}
