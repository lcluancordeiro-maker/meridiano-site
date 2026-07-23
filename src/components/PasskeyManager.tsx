"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Passkey = {
  id: string;
  friendly_name?: string;
  created_at: string;
};

/** Manage this account's passkeys (Face ID / Touch ID / Windows Hello /
 * Android biometrics) — register a new one for this device, or remove an
 * existing one. Lives on /conta, which requires an authenticated session
 * already (see ContaPage), so registerPasskey()/passkey.list() work
 * without any extra auth check here. */
export default function PasskeyManager() {
  const [supported, setSupported] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) return;
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      .then(setSupported)
      .catch(() => setSupported(false));

    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.passkey
      .list()
      .then(({ data }) => setPasskeys(data ?? []))
      .catch(() => setPasskeys([]));
  }, []);

  async function handleRegister() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { data, error: registerError } = await supabase.auth.registerPasskey();
    setBusy(false);
    if (registerError || !data) {
      setError("Não foi possível registrar a biometria neste dispositivo. Tente novamente.");
      return;
    }
    setPasskeys((prev) => [...(prev ?? []), data]);
  }

  async function handleDelete(passkeyId: string) {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: deleteError } = await supabase.auth.passkey.delete({ passkeyId });
    setBusy(false);
    if (deleteError) {
      setError("Não foi possível remover essa biometria. Tente novamente.");
      return;
    }
    setPasskeys((prev) => (prev ?? []).filter((p) => p.id !== passkeyId));
  }

  return (
    <section className="mt-8 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-semibold text-foreground">Login biométrico</h2>
      <p className="mt-1 text-sm text-muted">
        Entre com Face ID, Touch ID, Windows Hello ou a biometria do seu Android, sem digitar senha.
      </p>

      {passkeys && passkeys.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {passkeys.map((passkey) => (
            <li
              key={passkey.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="text-foreground">
                {passkey.friendly_name || "Dispositivo sem nome"} ·{" "}
                <span className="text-muted">
                  adicionado em {new Date(passkey.created_at).toLocaleDateString("pt-BR")}
                </span>
              </span>
              <button
                onClick={() => handleDelete(passkey.id)}
                disabled={busy}
                className="shrink-0 text-xs font-semibold text-error hover:underline disabled:opacity-60"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      {supported ? (
        <button
          onClick={handleRegister}
          disabled={busy}
          className="mt-4 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:opacity-60"
        >
          Adicionar biometria neste dispositivo
        </button>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Este dispositivo ou navegador não tem Face ID, Touch ID ou biometria disponível.
        </p>
      )}

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </section>
  );
}
