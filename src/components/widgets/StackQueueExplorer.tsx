"use client";

import { useState } from "react";

type Mode = "Pilha" | "Fila";

export default function StackQueueExplorer() {
  const [mode, setMode] = useState<Mode>("Pilha");
  const [items, setItems] = useState<number[]>([10, 20, 30]);
  const [nextValue, setNextValue] = useState(40);
  const [removed, setRemoved] = useState<number | null>(null);

  function add() {
    setItems((prev) => [...prev, nextValue]);
    setNextValue((v) => v + 10);
    setRemoved(null);
  }

  function remove() {
    if (items.length === 0) return;
    if (mode === "Pilha") {
      setRemoved(items[items.length - 1]);
      setItems((prev) => prev.slice(0, -1));
    } else {
      setRemoved(items[0]);
      setItems((prev) => prev.slice(1));
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {mode} · {removed !== null ? `removido: ${removed}` : "nada removido ainda"}
      </p>

      <div className="mt-4 flex items-center gap-3 text-sm text-foreground">
        <span className="font-medium">Estrutura:</span>
        <div className="flex gap-2">
          {(["Pilha", "Fila"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setRemoved(null);
              }}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                mode === m ? "bg-primary text-white" : "border border-border bg-surface text-foreground hover:bg-background"
              }`}
              aria-pressed={mode === m}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3">
        {items.length === 0 && <span className="text-xs text-muted">(vazia)</span>}
        {items.map((item, i) => {
          const isNext = mode === "Pilha" ? i === items.length - 1 : i === 0;
          return (
            <span
              key={i}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                isNext ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground"
              }`}
            >
              {item}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={add}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {mode === "Pilha" ? "empilhar" : "enfileirar"}({nextValue})
        </button>
        <button
          onClick={remove}
          disabled={items.length === 0}
          className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "Pilha" ? "desempilhar()" : "desenfileirar()"}
        </button>
      </div>
      <p className="mt-2 text-xs text-foreground">
        {mode === "Pilha"
          ? "Pilha (LIFO): o item destacado, o último a entrar, é o próximo a sair."
          : "Fila (FIFO): o item destacado, o primeiro a entrar, é o próximo a sair."}
      </p>
    </div>
  );
}
