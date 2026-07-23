"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** The Web Speech API isn't part of TypeScript's DOM lib — these are the
 * minimal shapes this hook actually touches. */
interface MinimalSpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
interface MinimalSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: MinimalSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => MinimalSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/** Maps this app's UI locales to a BCP-47 tag for speech recognition. Falls
 * back to Portuguese (Brazil) for any locale not listed. */
export const LOCALE_TO_SPEECH_LANG: Record<string, string> = {
  "pt-BR": "pt-BR",
  en: "en-US",
  es: "es-ES",
  zh: "zh-CN",
  it: "it-IT",
  ko: "ko-KR",
  de: "de-DE",
  fr: "fr-FR",
  ja: "ja-JP",
  ar: "ar-SA",
  ru: "ru-RU",
  hi: "hi-IN",
  vi: "vi-VN",
  pl: "pl-PL",
  tr: "tr-TR",
};

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/** Thin wrapper over the browser's SpeechRecognition API (Chrome/Edge/Safari
 * — not supported in Firefox). `isSupported` is only known client-side, so
 * it starts false and flips after mount to avoid a server/client mismatch. */
export function useSpeechRecognition(locale: string) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);

  useEffect(() => {
    // Deferred to a microtask so this doesn't set state synchronously
    // within the effect body — the value is still available before paint.
    queueMicrotask(() => setIsSupported(Boolean(getSpeechRecognitionConstructor())));
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const start = useCallback(
    (onResult: (transcript: string) => void) => {
      const Ctor = getSpeechRecognitionConstructor();
      if (!Ctor) return;

      const recognition = new Ctor();
      recognition.lang = LOCALE_TO_SPEECH_LANG[locale] ?? "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) onResult(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    },
    [locale]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, start, stop };
}
