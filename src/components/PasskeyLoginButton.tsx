"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function FaceIdIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M2 5V3.5A1.5 1.5 0 0 1 3.5 2H5" strokeLinecap="round" />
      <path d="M13 2h1.5A1.5 1.5 0 0 1 16 3.5V5" strokeLinecap="round" />
      <path d="M16 13v1.5a1.5 1.5 0 0 1-1.5 1.5H13" strokeLinecap="round" />
      <path d="M5 16H3.5A1.5 1.5 0 0 1 2 14.5V13" strokeLinecap="round" />
      <circle cx="6.5" cy="7.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="7.5" r="0.75" fill="currentColor" stroke="none" />
      <path d="M9 7.5v2.5h-0.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12.2c.7.6 1.8 1 3 1s2.3-.4 3-1" strokeLinecap="round" />
    </svg>
  );
}

/** "Entrar com Face ID / Touch ID / Windows Hello" — a WebAuthn passkey
 * sign-in, only rendered when the browser reports a platform authenticator
 * (the thing that actually shows the Face ID/Touch ID/Windows Hello/Android
 * biometric prompt) is available. Registering a passkey happens separately,
 * from an authenticated session — see PasskeyManager on /conta. */
export default function PasskeyLoginButton({
  label,
  errorLabel,
}: {
  label: string;
  errorLabel: string;
}) {
  const [supported, setSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) return;
    if (!createClient()) return;
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      .then(setSupported)
      .catch(() => setSupported(false));
  }, []);

  async function handleClick() {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPasskey();
    setLoading(false);
    if (signInError || !data?.session) {
      setError(errorLabel);
      return;
    }
    router.push("/progresso");
    router.refresh();
  }

  if (!supported) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:opacity-60"
      >
        <FaceIdIcon />
        {label}
      </button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
