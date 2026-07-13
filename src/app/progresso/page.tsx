"use client";

import Navbar from "@/components/Navbar";
import StatTile from "@/components/StatTile";
import BadgeGrid from "@/components/BadgeGrid";
import AccuracyChart from "@/components/charts/AccuracyChart";
import XpTrendChart from "@/components/charts/XpTrendChart";
import { useGamification } from "@/lib/useGamification";
import { useAllProgress } from "@/lib/useAllProgress";
import { levelFromXp, getXpLast } from "@/lib/gamification";
import { fundamental2Topics } from "@/data/curriculum";

const TOPIC_SHORT_LABELS: Record<string, string> = {
  "numeros-inteiros": "Inteiros",
  fracoes: "Frações",
  "introducao-algebra": "Álgebra",
  "potenciacao-radiciacao": "Potências",
  "proporcionalidade-porcentagem": "Proporção",
  "equacoes-segundo-grau": "Eq. 2º grau",
  "geometria-plana": "Geometria",
};

// Fixed categorical order (validated for CVD-safety) — never reassigned per render.
const TOPIC_COLORS = [
  "#2a78d6", // blue
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
  "#e87ba4", // magenta
];

export default function ProgressoPage() {
  const gamification = useGamification();
  const allProgress = useAllProgress();
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(gamification.xp);
  const xpTrend = getXpLast(7);

  const accuracyData = fundamental2Topics.map((topic, i) => {
    const p = allProgress[`fundamental-2/${topic.id}`];
    return {
      label: TOPIC_SHORT_LABELS[topic.id] ?? topic.title,
      value: p ? Math.round((p.score / p.total) * 100) : null,
      color: TOPIC_COLORS[i % TOPIC_COLORS.length],
    };
  });

  const hasAnyActivity = gamification.xp > 0;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Seu progresso
        </h1>
        <p className="mt-2 text-muted">
          Acompanhe sua evolução, XP, sequência de estudos e conquistas.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatTile
            icon="⭐"
            label="Nível"
            value={String(level)}
            subtext={`${xpIntoLevel}/${xpForNextLevel} XP para o próximo nível`}
          />
          <StatTile
            icon="🔥"
            label="Sequência atual"
            value={`${gamification.streak.current} ${gamification.streak.current === 1 ? "dia" : "dias"}`}
            subtext={`Recorde: ${gamification.streak.longest} ${gamification.streak.longest === 1 ? "dia" : "dias"}`}
          />
          <StatTile icon="✨" label="XP total" value={String(gamification.xp)} />
        </div>

        {!hasAnyActivity ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center text-muted">
            Você ainda não completou nenhum exercício. Comece uma trilha para ver seu progresso
            aqui!
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Desempenho por tópico
              </h2>
              <p className="mt-1 text-xs text-muted">Ensino Fundamental II</p>
              <div className="mt-4">
                <AccuracyChart data={accuracyData} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">
                XP na última semana
              </h2>
              <p className="mt-1 text-xs text-muted">Últimos 7 dias</p>
              <div className="mt-4">
                <XpTrendChart data={xpTrend} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-foreground">Conquistas</h2>
          <div className="mt-4">
            <BadgeGrid unlockedBadges={gamification.unlockedBadges} />
          </div>
        </div>
      </div>
    </div>
  );
}
