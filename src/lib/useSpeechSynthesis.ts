"use client";

import { useCallback, useEffect, useState } from "react";
import { LOCALE_TO_SPEECH_LANG } from "./useSpeechRecognition";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Thin wrapper over the browser's SpeechSynthesis API (the "read this
 * aloud" counterpart to useSpeechRecognition's "type this by voice") —
 * supported in Chrome/Edge/Safari/Firefox, all client-side and free (no
 * TTS API cost). `isSupported` starts false and flips after mount to avoid
 * a server/client mismatch. */
export function useSpeechSynthesis(locale: string) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsSupported(isSpeechSynthesisSupported()));
  }, []);

  useEffect(() => {
    return () => {
      if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSpeechSynthesisSupported()) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LOCALE_TO_SPEECH_LANG[locale] ?? "pt-BR";
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    },
    [locale]
  );

  const pause = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return { isSupported, isSpeaking, isPaused, speak, pause, resume, stop };
}
