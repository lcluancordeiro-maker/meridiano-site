"use client";

import StatTile from "@/components/StatTile";
import BadgeGrid from "@/components/BadgeGrid";
import WeakSpotsCard from "@/components/WeakSpotsCard";
import AccuracyChart from "@/components/charts/AccuracyChart";
import XpTrendChart from "@/components/charts/XpTrendChart";
import { useGamification } from "@/lib/useGamification";
import { useAllProgress } from "@/lib/useAllProgress";
import { levelFromXp, getXpLast } from "@/lib/gamification";
import { getWeakSpots } from "@/lib/weakSpots";
import {
  DIFFICULTY_ORDER,
  estatisticaAvancadoTopics,
  estatisticaInicianteTopics,
  estatisticaIntermediarioTopics,
  fundamental2Topics,
} from "@/data/curriculum";
import type { ProgressStore } from "@/lib/progress";

const TOPIC_SHORT_LABELS: Record<string, string> = {
  "numeros-inteiros": "Inteiros",
  fracoes: "Frações",
  "introducao-algebra": "Álgebra",
  "potenciacao-radiciacao": "Potências",
  "proporcionalidade-porcentagem": "Proporção",
  "equacoes-segundo-grau": "Eq. 2º grau",
  "geometria-plana": "Geometria",
  "medidas-tendencia-central": "Tend. Central",
  "probabilidade-basica": "Probabilidade",
  "distribuicao-normal": "Dist. Normal",
};

// Fixed categorical order (validated for CVD-safety) — never reassigned per render.
// Each independent chart below starts back at slot 1 since they're never compared
// side by side in a shared legend.
const CATEGORICAL_COLORS = [
  "#2a78d6", // blue
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
  "#e87ba4", // magenta
];

function buildAccuracyData(
  entries: { levelId: string; topicId: string; label: string }[],
  allProgress: ProgressStore
) {
  return entries.map(({ levelId, topicId, label }, i) => {
    let score = 0;
    let total = 0;
    for (const d of DIFFICULTY_ORDER) {
      const p = allProgress[`${levelId}/${topicId}/${d}`];
      if (p) {
        score += p.score;
        total += p.total;
      }
    }
    return {
      label,
      value: total > 0 ? Math.round((score / total) * 100) : null,
      color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
    };
  });
}

export default function ProgressoContent() {
  const gamification = useGamification();
  const allProgress = useAllProgress();
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(gamification.xp);
  const xpTrend = getXpLast(7);

  const fund2AccuracyData = buildAccuracyData(
    fundamental2Topics.map((topic) => ({
      levelId: "fundamental-2",
      topicId: topic.id,
      label: TOPIC_SHORT_LABELS[topic.id] ?? topic.title,
    })),
    allProgress
  );

  const estatisticaAccuracyData = buildAccuracyData(
    [
      { levelId: "estatistica-iniciante", topic: estatisticaInicianteTopics[0] },
      { levelId: "estatistica-intermediario", topic: estatisticaIntermediarioTopics[0] },
      { levelId: "estatistica-avancado", topic: estatisticaAvancadoTopics[0] },
    ].map(({ levelId, topic }) => ({
      levelId,
      topicId: topic.id,
      label: TOPIC_SHORT_LABELS[topic.id] ?? topic.title,
    })),
    allProgress
  );

  const hasAnyActivity = gamification.xp > 0;
  const weakSpots = getWeakSpots(allProgress, { limit: 8 });

  return (
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
              <AccuracyChart data={fund2AccuracyData} />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Desempenho por tópico
            </h2>
            <p className="mt-1 text-xs text-muted">Estatística</p>
            <div className="mt-4">
              <AccuracyChart data={estatisticaAccuracyData} />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2">
            <h2 className="font-display text-lg font-semibold text-foreground">
              XP na última semana
            </h2>
            <p className="mt-1 text-xs text-muted">Últimos 7 dias</p>
            <div className="mt-4">
              <XpTrendChart data={xpTrend} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <WeakSpotsCard weakSpots={weakSpots} />
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
  );
}
