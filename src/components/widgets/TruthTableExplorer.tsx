"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

type Connective = "p∧q" | "p∨q" | "p→q";

function evaluate(connective: Connective, p: boolean, q: boolean): boolean {
  if (connective === "p∧q") return p && q;
  if (connective === "p∨q") return p || q;
  return !p || q;
}

const ROWS: { p: boolean; q: boolean }[] = [
  { p: true, q: true },
  { p: true, q: false },
  { p: false, q: true },
  { p: false, q: false },
];

const CONNECTIVES: Connective[] = ["p∧q", "p∨q", "p→q"];

export default function TruthTableExplorer() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(true);
  const [connective, setConnective] = useState<Connective>("p∧q");

  const result = evaluate(connective, p, q);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Com p={p ? "V" : "F"} e q={q ? "V" : "F"}, {connective} = {result ? "V" : "F"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CONNECTIVES.map((c) => (
          <button
            key={c}
            onClick={() => setConnective(c)}
            aria-label={`Selecionar conectivo ${c}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              connective === c ? "bg-primary text-white" : "border border-border text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setP((v) => !v)}
          aria-label="Alternar valor lógico de p"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          p = {p ? "V" : "F"}
        </button>
        <button
          onClick={() => setQ((v) => !v)}
          aria-label="Alternar valor lógico de q"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          q = {q ? "V" : "F"}
        </button>
      </div>

      <table className="mt-4 w-full text-center text-sm" role="table" aria-label={`Tabela-verdade de ${connective}`}>
        <thead>
          <tr className="text-muted">
            <th className="py-1">p</th>
            <th className="py-1">q</th>
            <th className="py-1">{connective}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const isCurrent = row.p === p && row.q === q;
            const rowResult = evaluate(connective, row.p, row.q);
            return (
              <tr
                key={`${row.p}-${row.q}`}
                className={isCurrent ? "bg-primary/10 font-semibold text-foreground" : "text-foreground"}
              >
                <td className="py-1">{row.p ? "V" : "F"}</td>
                <td className="py-1">{row.q ? "V" : "F"}</td>
                <td className="py-1">{rowResult ? "V" : "F"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <WidgetChallenge
        goal="Selecione o condicional (p→q) e ajuste p e q até que o resultado seja falso."
        isMet={connective === "p→q" && !result}
      />
    </div>
  );
}
