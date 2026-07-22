"use client";

import { useSpeechSynthesis } from "@/lib/useSpeechSynthesis";

export default function TheoryNarration({
  sections,
  locale,
}: {
  sections: { heading: string; body: string[] }[];
  locale: string;
}) {
  const { isSupported, isSpeaking, isPaused, speak, pause, resume, stop } = useSpeechSynthesis(locale);

  if (!isSupported) return null;

  function handlePlay() {
    const text = sections.map((s) => `${s.heading}. ${s.body.join(" ")}`).join("\n\n");
    speak(text);
  }

  return (
    <div className="mb-6 flex items-center gap-2">
      {!isSpeaking ? (
        <button
          type="button"
          onClick={handlePlay}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
        >
          🔊 Ouvir teoria
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={isPaused ? resume : pause}
            className="flex items-center gap-1.5 rounded-full border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
          >
            {isPaused ? "▶️ Continuar" : "⏸️ Pausar"}
          </button>
          <button
            type="button"
            onClick={stop}
            aria-label="Parar narração"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-error hover:text-error"
          >
            ⏹ Parar
          </button>
        </>
      )}
    </div>
  );
}
