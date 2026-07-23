"use client";

import type { Topic } from "@/data/curriculum";
import { useAllProgress } from "@/lib/useAllProgress";
import { isLevelComplete } from "@/lib/levelCompletion";

export default function LevelCertificateCta({
  levelId,
  levelName,
  topics,
}: {
  levelId: string;
  levelName: string;
  topics: Topic[];
}) {
  const allProgress = useAllProgress();
  if (!isLevelComplete(levelId, topics, allProgress)) return null;

  return (
    <div className="mt-6 rounded-2xl border border-success bg-success-bg p-5">
      <p className="font-display text-sm font-semibold text-success">🎉 Trilha completa!</p>
      <p className="mt-1 text-sm text-foreground/80">
        Você completou {levelName} — baixe um certificado para compartilhar.
      </p>
      <a
        href={`/certificado/${levelId}`}
        download={`certificado-${levelId}.png`}
        className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Baixar certificado
      </a>
    </div>
  );
}
