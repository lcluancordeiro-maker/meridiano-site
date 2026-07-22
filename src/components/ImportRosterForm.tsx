"use client";

import { useActionState, useState } from "react";
import { importTurmaRoster } from "@/app/actions/turmas";

// Hardcoded Portuguese — same convention as other recently-added
// interactive controls (ReportContentButton.tsx, FriendsLeague.tsx) that
// ship before full 15-locale i18n.
export default function ImportRosterForm({ turmaId }: { turmaId: string }) {
  const [state, formAction, pending] = useActionState(importTurmaRoster, undefined);
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-3">
      <input type="hidden" name="turmaId" value={turmaId} />
      <input type="hidden" name="roster" value={csvText} />
      <p className="text-xs text-muted">
        Exporte a lista de alunos como CSV no Google Classroom ou no Clever e envie o arquivo aqui
        — quem já tem conta no app entra direto na turma pelo e-mail; quem ainda não tem conta
        continua podendo entrar pelo código acima.
      </p>
      <input
        type="file"
        accept=".csv,.txt"
        onChange={handleFile}
        className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-foreground"
      />
      {fileName && <p className="text-xs text-success">Arquivo carregado: {fileName}</p>}
      <button
        type="submit"
        disabled={pending || !csvText}
        className="w-fit rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Importar turma
      </button>
      {state?.error && <p className="text-sm text-error">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}
    </form>
  );
}
