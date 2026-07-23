"use client";

import { useMemo, useState } from "react";

const WIDTH = 320;
const HEIGHT = 150;
const MARGIN_BOTTOM = 20;
const MARGIN_TOP = 10;

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function SacScheduleExplorer() {
  const [principal, setPrincipal] = useState(12000);
  const [rate, setRate] = useState(2);
  const [installments, setInstallments] = useState(6);

  const amortization = principal / installments;

  const schedule = useMemo(() => {
    const list: { period: number; balance: number; interest: number; payment: number }[] = [];
    let balance = principal;
    for (let i = 1; i <= installments; i++) {
      const interest = balance * (rate / 100);
      const payment = amortization + interest;
      list.push({ period: i, balance, interest, payment });
      balance -= amortization;
    }
    return list;
  }, [principal, rate, installments, amortization]);

  const firstPayment = schedule[0]?.payment ?? 0;
  const lastPayment = schedule[schedule.length - 1]?.payment ?? 0;
  const maxPayment = Math.max(firstPayment, 1);
  const barWidth = (WIDTH - 20) / installments;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        1ª parcela: R$ {formatCurrency(firstPayment)} · última: R$ {formatCurrency(lastPayment)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Valor: R$ {principal}</span>
          <input
            type="range"
            min={1000}
            max={30000}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor financiado"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Taxa: {rate}% a.m.</span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Taxa de juros ao mês"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Parcelas: {installments}</span>
          <input
            type="range"
            min={2}
            max={12}
            step={1}
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de parcelas"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-36 w-full"
          role="img"
          aria-label={`Parcelas do SAC decrescendo de R$${formatCurrency(firstPayment)} até R$${formatCurrency(lastPayment)} em ${installments} meses`}
        >
          <line x1={10} x2={WIDTH - 10} y1={HEIGHT - MARGIN_BOTTOM} y2={HEIGHT - MARGIN_BOTTOM} stroke="var(--color-muted)" strokeWidth={1.5} />
          {schedule.map((row, i) => {
            const h = (row.payment / maxPayment) * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP);
            const x = 10 + i * barWidth;
            return (
              <rect
                key={row.period}
                x={x + 1}
                y={HEIGHT - MARGIN_BOTTOM - h}
                width={Math.max(barWidth - 2, 1)}
                height={h}
                fill="#2a78d6"
              />
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Amortização constante = {formatCurrency(amortization)}. Como o saldo devedor cai a cada mês, os
        juros — e a parcela — diminuem mês a mês.
      </p>
    </div>
  );
}
