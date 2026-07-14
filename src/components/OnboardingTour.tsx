"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

const DISMISSED_KEY = "onboarding-tour-dismissed";
const TOTAL_STEPS = 6;

export default function OnboardingTour() {
  const { dict } = useTranslation();
  const { onboarding } = dict;
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Deferred to a microtask so this doesn't set state synchronously
    // within the effect body.
    queueMicrotask(() => {
      if (localStorage.getItem(DISMISSED_KEY) !== "1") setVisible(true);
    });
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  const steps = [
    { title: onboarding.step1Title, body: onboarding.step1Body },
    { title: onboarding.step2Title, body: onboarding.step2Body },
    { title: onboarding.step3Title, body: onboarding.step3Body },
    { title: onboarding.step4Title, body: onboarding.step4Body },
    { title: onboarding.step5Title, body: onboarding.step5Body },
    { title: onboarding.step6Title, body: onboarding.step6Body },
  ];
  const current = steps[step - 1];
  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {onboarding.stepIndicator.replace("{current}", String(step)).replace("{total}", String(TOTAL_STEPS))}
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold text-foreground">{current.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{current.body}</p>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={dismiss} className="text-xs font-semibold text-muted hover:text-foreground">
            {onboarding.skipButton}
          </button>
          <div className="flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
              >
                {onboarding.backButton}
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLastStep ? dismiss() : setStep((s) => s + 1))}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {isLastStep ? onboarding.finishButton : onboarding.nextButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
