"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function SubscriptionActionButton({
  endpoint,
  label,
}: {
  endpoint: "/api/stripe/checkout" | "/api/stripe/portal";
  label: string;
}) {
  const { dict } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(endpoint, { method: "POST" });
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
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "..." : label}
      </button>
      {error && <p className="text-sm text-error">{dict.premium.actionError}</p>}
    </div>
  );
}
