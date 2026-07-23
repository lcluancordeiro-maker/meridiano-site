"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function IdentityVerificationButton({ label }: { label: string }) {
  const { dict } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/identity/create-session", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(true);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "..." : label}
      </button>
      {error && <p className="text-sm text-error">{dict.identity.failedMessage}</p>}
    </div>
  );
}
