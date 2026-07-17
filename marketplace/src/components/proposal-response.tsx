"use client";

import { useState } from "react";
import { updateProposalStatusAction } from "@/app/actions/proposals";

export function ProposalResponse({ proposalId }: { proposalId: string }) {
  const [showCounter, setShowCounter] = useState(false);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <form action={updateProposalStatusAction.bind(null, proposalId, "aceita", undefined)}>
          <button
            type="submit"
            className="rounded-md bg-green/10 px-3 py-1.5 text-xs font-semibold text-green hover:bg-green/20"
          >
            Aceitar
          </button>
        </form>
        <form action={updateProposalStatusAction.bind(null, proposalId, "recusada", undefined)}>
          <button
            type="submit"
            className="rounded-md bg-red/10 px-3 py-1.5 text-xs font-semibold text-red hover:bg-red/20"
          >
            Recusar
          </button>
        </form>
        <button
          type="button"
          onClick={() => setShowCounter((v) => !v)}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy-deep hover:border-navy-light"
        >
          Contraproposta
        </button>
      </div>

      {showCounter && (
        <form
          action={async (formData: FormData) => {
            const resposta = String(formData.get("resposta") ?? "");
            await updateProposalStatusAction(proposalId, "contraproposta", resposta);
            setShowCounter(false);
          }}
          className="flex gap-2"
        >
          <input
            name="resposta"
            required
            placeholder="Ex: aceito por R$ 350.000"
            className="flex-1 rounded-md border border-border px-3 py-1.5 text-sm outline-none focus:border-navy-light"
          />
          <button
            type="submit"
            className="rounded-md bg-navy-deep px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy"
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}
