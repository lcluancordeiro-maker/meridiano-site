"use client";

import { useState } from "react";

const ENTRIES = [
  { key: "maçã", value: 3 },
  { key: "banana", value: 7 },
  { key: "laranja", value: 5 },
  { key: "uva", value: 12 },
];

export default function DictionaryExplorer() {
  const [selected, setSelected] = useState(1);
  const entry = ENTRIES[selected];
  const position = selected + 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        estoque[&quot;{entry.key}&quot;] = {entry.value} · dicionário: 1 comparação (O(1)) · lista: {position}{" "}
        comparações (O(n))
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ENTRIES.map((e, i) => (
          <button
            key={e.key}
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              i === selected
                ? "bg-primary text-white"
                : "border border-border bg-surface text-foreground hover:bg-background"
            }`}
          >
            {e.key}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-surface p-4 font-mono text-sm">
          <p className="mb-2 text-xs font-semibold text-muted">Dicionário — acesso direto</p>
          <p className="text-foreground">
            estoque[&quot;{entry.key}&quot;] → {entry.value}
          </p>
          <p className="mt-2 text-primary">1 comparação, sempre — O(1)</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-surface p-4 font-mono text-sm">
          <p className="mb-2 text-xs font-semibold text-muted">Lista — busca sequencial</p>
          {ENTRIES.map((e, i) => (
            <p
              key={e.key}
              className={i <= selected ? (i === selected ? "font-semibold text-primary" : "text-foreground") : "text-muted"}
            >
              {i + 1}. {e.key}: {e.value}
              {i === selected ? " ← encontrado" : ""}
            </p>
          ))}
          <p className="mt-2 text-primary">{position} comparação(ões) até encontrar — O(n)</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Quanto mais para o fim da lista a chave estiver, mais comparações a busca sequencial exige. O dicionário
        encontra qualquer chave em uma única operação, não importa quantos itens existam.
      </p>
    </div>
  );
}
