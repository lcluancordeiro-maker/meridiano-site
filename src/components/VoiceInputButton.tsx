"use client";

import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

export default function VoiceInputButton({
  locale,
  onResult,
  label,
  listeningLabel,
  className,
}: {
  locale: string;
  onResult: (transcript: string) => void;
  label: string;
  listeningLabel: string;
  className?: string;
}) {
  const { isSupported, isListening, start, stop } = useSpeechRecognition(locale);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      aria-pressed={isListening}
      onClick={() => (isListening ? stop() : start(onResult))}
      className={
        className ??
        `shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
          isListening ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary"
        }`
      }
    >
      {isListening ? `🎙️ ${listeningLabel}` : `🎤 ${label}`}
    </button>
  );
}
