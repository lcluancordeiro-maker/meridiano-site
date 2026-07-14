"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

export default function ConfusionMatrixExplorer() {
  const [vp, setVp] = useState(40);
  const [fp, setFp] = useState(10);
  const [fn, setFn] = useState(5);
  const [vn, setVn] = useState(45);

  const total = vp + fp + vn + fn;
  const precision = vp + fp === 0 ? 0 : vp / (vp + fp);
  const recall = vp + fn === 0 ? 0 : vp / (vp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const accuracy = total === 0 ? 0 : (vp + vn) / total;

  const sliders = [
    { key: "vp", label: "VP", value: vp, setValue: setVp },
    { key: "fp", label: "FP", value: fp, setValue: setFp },
    { key: "fn", label: "FN", value: fn, setValue: setFn },
    { key: "vn", label: "VN", value: vn, setValue: setVn },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Precisão = {formatNumber(precision * 100)}% · Revocação = {formatNumber(recall * 100)}% · F1 ={" "}
        {formatNumber(f1 * 100)}%
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {sliders.map((s) => (
          <label key={s.key} className="flex items-center gap-3 text-sm text-foreground">
            <span className="w-28 shrink-0 font-medium">
              {s.label}: {s.value}
            </span>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={s.value}
              onChange={(e) => s.setValue(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
            />
          </label>
        ))}
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-2"
        role="img"
        aria-label={`Matriz de confusão: VP=${vp}, FP=${fp}, FN=${fn}, VN=${vn}`}
      >
        <div className="rounded-lg border border-success bg-success-bg p-3 text-center">
          <p className="text-xs text-muted">Verdadeiro Positivo</p>
          <p className="font-display text-lg font-semibold text-success">{vp}</p>
        </div>
        <div className="rounded-lg border border-error bg-error-bg p-3 text-center">
          <p className="text-xs text-muted">Falso Positivo</p>
          <p className="font-display text-lg font-semibold text-error">{fp}</p>
        </div>
        <div className="rounded-lg border border-error bg-error-bg p-3 text-center">
          <p className="text-xs text-muted">Falso Negativo</p>
          <p className="font-display text-lg font-semibold text-error">{fn}</p>
        </div>
        <div className="rounded-lg border border-success bg-success-bg p-3 text-center">
          <p className="text-xs text-muted">Verdadeiro Negativo</p>
          <p className="font-display text-lg font-semibold text-success">{vn}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">Acurácia = {formatNumber(accuracy * 100)}%</p>
    </div>
  );
}
