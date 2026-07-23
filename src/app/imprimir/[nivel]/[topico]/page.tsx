import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import {
  DIFFICULTY_LABELS,
  getLevel,
  getTopic,
  getTopicsForLevel,
  levels,
} from "@/data/curriculum";
import { isPremiumUser } from "@/lib/entitlements";

export function generateStaticParams() {
  return levels
    .filter((level) => level.available)
    .flatMap((level) =>
      getTopicsForLevel(level.id).map((topic) => ({
        nivel: level.id,
        topico: topic.id,
      }))
    );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nivel: string; topico: string }>;
}): Promise<Metadata> {
  const { nivel, topico } = await params;
  const level = getLevel(nivel);
  const topic = getTopic(nivel, topico);
  if (!level || !topic) return {};
  return { title: `Exercícios para imprimir — ${topic.title}` };
}

export default async function ImprimirPage({
  params,
}: {
  params: Promise<{ nivel: string; topico: string }>;
}) {
  const { nivel, topico } = await params;
  const level = getLevel(nivel);
  const topic = getTopic(nivel, topico);

  if (!level || !level.available || !topic) notFound();

  // Same paywall boundary as the topic page itself — the printable sheet
  // isn't a way to read premium exercises without a subscription.
  const hasPremiumAccess = level.premium ? await isPremiumUser() : true;
  if (!hasPremiumAccess) notFound();

  const exercises = topic.exercises;

  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-10 print:px-0 print:py-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link
          href={`/trilha/${level.id}/${topic.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Voltar para o tópico
        </Link>
        <PrintButton />
      </div>

      <header className="mb-8 border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Meridiano Matemática — {level.name}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">{topic.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Lista de exercícios — {exercises.length}{" "}
          {exercises.length === 1 ? "questão" : "questões"}
        </p>
        <p className="mt-4 text-sm text-muted">Nome: _______________________________________</p>
      </header>

      <ol className="flex flex-col gap-6">
        {exercises.map((exercise, i) => (
          <li key={exercise.id}>
            <p className="text-sm font-semibold text-foreground">
              {i + 1}.{" "}
              <span className="font-normal text-muted">
                ({DIFFICULTY_LABELS[exercise.difficulty]})
              </span>{" "}
              {exercise.prompt}
            </p>
            {exercise.type === "multiple-choice" && exercise.options ? (
              <ul className="mt-2 flex flex-col gap-1 pl-6 text-sm text-foreground">
                {exercise.options.map((option, oi) => (
                  <li key={oi}>
                    {String.fromCharCode(65 + oi)}) {option}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">Resposta: _______________________________</p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-12 border-t border-border pt-8" style={{ breakBefore: "page" }}>
        <h2 className="font-display text-xl font-semibold text-foreground">Gabarito</h2>
        <ol className="mt-4 flex flex-col gap-1 text-sm text-foreground">
          {exercises.map((exercise, i) => (
            <li key={exercise.id}>
              {i + 1}. {exercise.answer}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
