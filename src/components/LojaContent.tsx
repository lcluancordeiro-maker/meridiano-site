"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useGamification } from "@/lib/useGamification";
import {
  buyAccentTheme,
  buyStreakFreeze,
  buyXpBoost,
  GEM_COST_ACCENT_THEME,
  GEM_COST_STREAK_FREEZE,
  GEM_COST_XP_BOOST,
  MAX_STREAK_FREEZES,
  type AccentTheme,
} from "@/lib/gamification";
import { accentThemeStore } from "@/lib/accentTheme";

const ACCENT_THEME_INFO: Record<AccentTheme, { label: string; swatch: string }> = {
  oceano: { label: "Oceano", swatch: "#0891b2" },
  floresta: { label: "Floresta", swatch: "#059669" },
  "por-do-sol": { label: "Pôr do sol", swatch: "#ea580c" },
};

function formatBoostRemaining(until: number, now: number): string {
  const ms = until - now;
  const minutes = Math.max(0, Math.round(ms / 60_000));
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest > 0 ? `${hours}h${rest}min` : `${hours}h`;
  }
  return `${minutes}min`;
}

export default function LojaContent() {
  const gamification = useGamification();
  const activeAccent = useSyncExternalStore(
    accentThemeStore.subscribe,
    accentThemeStore.getSnapshot,
    accentThemeStore.getServerSnapshot
  );
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const freezesMaxed = gamification.streak.freezes >= MAX_STREAK_FREEZES;
  const canAffordFreeze = gamification.gems >= GEM_COST_STREAK_FREEZE;
  const canAffordBoost = gamification.gems >= GEM_COST_XP_BOOST;
  const boostActive = gamification.xpBoostUntil !== null && gamification.xpBoostUntil > now;

  function handleBuyFreeze() {
    const ok = buyStreakFreeze();
    setMessage(ok ? "Congelamento extra comprado!" : "Não foi possível comprar o congelamento.");
  }

  function handleBuyBoost() {
    const ok = buyXpBoost();
    setMessage(ok ? "Impulso de XP ativado!" : "Gemas insuficientes para o impulso de XP.");
  }

  function handleThemeClick(theme: AccentTheme) {
    if (gamification.unlockedAccentThemes.includes(theme)) {
      accentThemeStore.setAccentTheme(activeAccent === theme ? null : theme);
      return;
    }
    const ok = buyAccentTheme(theme);
    if (ok) {
      accentThemeStore.setAccentTheme(theme);
      setMessage(`Tema "${ACCENT_THEME_INFO[theme].label}" desbloqueado e aplicado!`);
    } else {
      setMessage("Gemas insuficientes para esse tema.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-foreground">Loja</h1>
      <p className="mt-2 text-muted">
        Gemas são ganhas automaticamente a cada nível que você sobe, e podem ser trocadas por
        congelamentos extras de sequência, temas de cor e um impulso temporário de XP.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground">
        💎 {gamification.gems} {gamification.gems === 1 ? "gema" : "gemas"}
      </div>

      {message && (
        <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-6">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">
            ❄️ Congelamento de sequência extra
          </h2>
          <p className="mt-1 text-sm text-muted">
            Protege sua sequência caso você perca um dia. Além do congelamento automático a cada 7
            dias seguidos, você pode comprar um extra aqui.
          </p>
          <p className="mt-2 text-xs text-muted">
            Congelamentos: {gamification.streak.freezes}/{MAX_STREAK_FREEZES}
          </p>
          <button
            type="button"
            onClick={handleBuyFreeze}
            disabled={freezesMaxed || !canAffordFreeze}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Comprar por {GEM_COST_STREAK_FREEZE} 💎
          </button>
          {freezesMaxed && (
            <p className="mt-2 text-xs text-muted">Você já está no limite de congelamentos.</p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">⚡ Impulso de XP</h2>
          <p className="mt-1 text-sm text-muted">
            Dobra o XP ganho por 1 hora. Comprar de novo enquanto um impulso está ativo estende o
            tempo em vez de reiniciar.
          </p>
          {boostActive && gamification.xpBoostUntil && (
            <p className="mt-2 text-xs font-semibold text-primary">
              Ativo por mais {formatBoostRemaining(gamification.xpBoostUntil, now)}
            </p>
          )}
          <button
            type="button"
            onClick={handleBuyBoost}
            disabled={!canAffordBoost}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Comprar por {GEM_COST_XP_BOOST} 💎
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">🎨 Temas de cor</h2>
          <p className="mt-1 text-sm text-muted">
            Troca a cor de destaque do app. Uma compra única por tema — depois é só alternar.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {(Object.keys(ACCENT_THEME_INFO) as AccentTheme[]).map((theme) => {
              const info = ACCENT_THEME_INFO[theme];
              const owned = gamification.unlockedAccentThemes.includes(theme);
              const active = activeAccent === theme;
              return (
                <button
                  key={theme}
                  type="button"
                  onClick={() => handleThemeClick(theme)}
                  disabled={!owned && gamification.gems < GEM_COST_ACCENT_THEME}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    active ? "border-primary bg-primary/10" : "border-border hover:border-primary"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: info.swatch }}
                    />
                    <span className="font-semibold text-foreground">{info.label}</span>
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    {active ? "Ativo" : owned ? "Aplicar" : `${GEM_COST_ACCENT_THEME} 💎`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
