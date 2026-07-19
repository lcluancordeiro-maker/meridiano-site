"use client";

import { useState } from "react";

export default function DecisionTreeExplorer() {
  const [nublado, setNublado] = useState(true);
  const [umidoAlto, setUmidoAlto] = useState(true);

  const prediction = nublado ? (umidoAlto ? "Chove" : "Não chove") : "Não chove";

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">Previsão: {prediction}</p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center justify-between gap-3 text-sm text-foreground">
          <span className="font-medium">Está nublado?</span>
          <button
            onClick={() => setNublado((v) => !v)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              nublado ? "bg-primary text-white" : "border border-border bg-surface text-foreground hover:bg-background"
            }`}
            aria-pressed={nublado}
            aria-label="Está nublado?"
          >
            {nublado ? "Sim" : "Não"}
          </button>
        </label>
        {nublado && (
          <label className="flex items-center justify-between gap-3 text-sm text-foreground">
            <span className="font-medium">Umidade &gt; 70%?</span>
            <button
              onClick={() => setUmidoAlto((v) => !v)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                umidoAlto ? "bg-primary text-white" : "border border-border bg-surface text-foreground hover:bg-background"
              }`}
              aria-pressed={umidoAlto}
              aria-label="Umidade maior que 70%?"
            >
              {umidoAlto ? "Sim" : "Não"}
            </button>
          </label>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg viewBox="0 0 280 140" className="h-32 w-full" role="img" aria-label={`Árvore de decisão percorrida até a folha: ${prediction}`}>
          <rect x={100} y={5} width={80} height={26} rx={6} fill="#2a78d6" fillOpacity={0.2} stroke="#2a78d6" strokeWidth={2} />
          <text x={140} y={22} fontSize={10} fill="var(--color-foreground)" textAnchor="middle">Nublado?</text>

          <line x1={140} y1={31} x2={70} y2={65} stroke={nublado ? "#2a78d6" : "var(--color-border)"} strokeWidth={2} />
          <line x1={140} y1={31} x2={210} y2={65} stroke={!nublado ? "#2a78d6" : "var(--color-border)"} strokeWidth={2} />
          <text x={95} y={50} fontSize={9} fill="var(--color-muted)">sim</text>
          <text x={185} y={50} fontSize={9} fill="var(--color-muted)">não</text>

          <rect x={30} y={65} width={80} height={26} rx={6} fill={nublado ? "#2a78d6" : "var(--color-border)"} fillOpacity={0.2} stroke={nublado ? "#2a78d6" : "var(--color-muted)"} strokeWidth={2} />
          <text x={70} y={82} fontSize={9} fill="var(--color-foreground)" textAnchor="middle">Umidade&gt;70%?</text>

          <rect x={170} y={65} width={80} height={26} rx={6} fill={!nublado ? "#e34948" : "var(--color-border)"} fillOpacity={0.2} stroke={!nublado ? "#e34948" : "var(--color-muted)"} strokeWidth={2} />
          <text x={210} y={82} fontSize={10} fill="var(--color-foreground)" textAnchor="middle">Não chove</text>

          <line x1={70} y1={91} x2={40} y2={120} stroke={nublado && umidoAlto ? "#1baf7a" : "var(--color-border)"} strokeWidth={2} />
          <line x1={70} y1={91} x2={100} y2={120} stroke={nublado && !umidoAlto ? "#e34948" : "var(--color-border)"} strokeWidth={2} />

          <rect x={5} y={120} width={70} height={20} rx={6} fill={nublado && umidoAlto ? "#1baf7a" : "var(--color-border)"} fillOpacity={0.3} stroke={nublado && umidoAlto ? "#1baf7a" : "var(--color-muted)"} strokeWidth={2} />
          <text x={40} y={134} fontSize={9} fill="var(--color-foreground)" textAnchor="middle">Chove</text>

          <rect x={75} y={120} width={70} height={20} rx={6} fill={nublado && !umidoAlto ? "#e34948" : "var(--color-border)"} fillOpacity={0.3} stroke={nublado && !umidoAlto ? "#e34948" : "var(--color-muted)"} strokeWidth={2} />
          <text x={110} y={134} fontSize={9} fill="var(--color-foreground)" textAnchor="middle">Não chove</text>
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        O caminho destacado mostra as respostas escolhidas até chegar na folha com a previsão final.
      </p>
    </div>
  );
}
