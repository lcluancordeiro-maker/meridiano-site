"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

const DISMISSED_KEY = "pwa-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPwaPrompt() {
  const { dict } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (isStandalone || localStorage.getItem(DISMISSED_KEY) === "1") return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!visible || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:right-4">
      <div>
        <p className="font-display text-sm font-semibold text-foreground">{dict.pwa.installTitle}</p>
        <p className="mt-1 text-sm text-muted">{dict.pwa.installBody}</p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
        >
          {dict.pwa.dismissButton}
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {dict.pwa.installButton}
        </button>
      </div>
    </div>
  );
}
