"use client";

import { useActionState } from "react";
import type { ListingState } from "@/app/actions/listings";
import { ESFERAS, ESTADOS, NATUREZAS, TIPOS_ATIVO } from "@/lib/constants";
import type { Listing } from "@/lib/database.types";

const initialState: ListingState = { error: null };

export function ListingForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ListingState, formData: FormData) => Promise<ListingState>;
  defaultValues?: Partial<Listing>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          name="tipo_ativo"
          label="Tipo de ativo"
          defaultValue={defaultValues?.tipo_ativo ?? "precatorio"}
          options={TIPOS_ATIVO}
        />
        <SelectField
          name="esfera"
          label="Esfera"
          defaultValue={defaultValues?.esfera}
          options={ESFERAS}
          placeholder="Selecione"
        />
      </div>

      <TextField
        name="ente_devedor"
        label="Ente devedor"
        defaultValue={defaultValues?.ente_devedor}
        placeholder="Ex: União Federal, Estado de São Paulo, Município de Campinas"
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="tribunal"
          label="Tribunal"
          defaultValue={defaultValues?.tribunal}
          placeholder="Ex: TRF-3, TJSP"
          required
        />
        <TextField
          name="numero_processo"
          label="Número do processo (opcional)"
          defaultValue={defaultValues?.numero_processo ?? undefined}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          name="natureza"
          label="Natureza do crédito"
          defaultValue={defaultValues?.natureza ?? "comum"}
          options={NATUREZAS}
        />
        <SelectField
          name="estado"
          label="Estado"
          defaultValue={defaultValues?.estado}
          options={ESTADOS.map((uf) => ({ value: uf, label: uf }))}
          placeholder="Selecione"
        />
        <TextField
          name="comarca"
          label="Comarca (opcional)"
          defaultValue={defaultValues?.comarca ?? undefined}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="valor_de_face"
          label="Valor de face (R$)"
          type="number"
          step="0.01"
          min={0.01}
          defaultValue={defaultValues?.valor_de_face}
          required
        />
        <TextField
          name="valor_pedido"
          label="Valor pedido (R$)"
          type="number"
          step="0.01"
          min={0.01}
          defaultValue={defaultValues?.valor_pedido}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="data_expedicao"
          label="Data de expedição (opcional)"
          type="date"
          defaultValue={defaultValues?.data_expedicao ?? undefined}
        />
        <TextField
          name="previsao_pagamento"
          label="Previsão de pagamento (opcional)"
          placeholder="Ex: 2027"
          defaultValue={defaultValues?.previsao_pagamento ?? undefined}
        />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1.5 block text-sm font-medium text-navy-deep">
          Descrição (opcional)
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={4}
          defaultValue={defaultValues?.descricao ?? undefined}
          className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-navy-deep px-6 py-3 font-semibold text-white transition hover:bg-navy disabled:opacity-60"
      >
        {isPending ? "Salvando…" : submitLabel}
      </button>
    </form>
  );
}

function TextField({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
  step,
  min,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: number;
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
        step={step}
        min={min}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy-deep">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={!placeholder}
        className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-light focus:ring-2 focus:ring-navy-light/20"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
