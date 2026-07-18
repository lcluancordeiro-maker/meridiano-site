import Link from "next/link";
import type { WeakSpot } from "@/lib/weakSpots";

const ACCURACY_THRESHOLD = 0.8;

export default function WeakSpotsCard({ weakSpots }: { weakSpots: WeakSpot[] }) {
  const toReview = weakSpots.filter((s) => s.accuracy < ACCURACY_THRESHOLD).slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-semibold text-foreground">Pontos de atenção</h2>
      <p className="mt-1 text-xs text-muted">
        Tópicos com menor acerto entre os que você já praticou — bons candidatos pra revisar.
      </p>
      {toReview.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          {weakSpots.length === 0
            ? "Continue praticando — assim que você tiver pelo menos 3 exercícios respondidos num tópico, ele pode aparecer aqui."
            : "Nenhum tópico abaixo de 80% de acerto agora. Mandou bem! 🎉"}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {toReview.map((spot) => (
            <li key={`${spot.levelId}/${spot.topicId}`}>
              <Link
                href={`/trilha/${spot.levelId}/${spot.topicId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">
                    {spot.topicTitle}
                  </span>
                  <span className="text-xs text-muted">{spot.levelName}</span>
                </span>
                <span className="shrink-0 rounded-full bg-error-bg px-2.5 py-1 text-xs font-semibold text-error">
                  {Math.round(spot.accuracy * 100)}% ({spot.score}/{spot.total})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
