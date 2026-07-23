import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import StudyPlanView from "@/components/StudyPlanView";
import { getLevel, getTopicsForLevel } from "@/data/curriculum";
import { STUDY_PLAN_GOALS, getStudyPlanGoal } from "@/lib/studyPlan";

export const metadata = {
  title: "Plano de estudos",
  description: 'Escolha um objetivo (ex: "ENEM em 8 semanas") e receba um plano semana a semana.',
};

export default async function PlanoDeEstudosPage({
  searchParams,
}: {
  searchParams: Promise<{ meta?: string }>;
}) {
  const { meta } = await searchParams;

  if (!meta) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-foreground">Plano de estudos</h1>
          <p className="mt-2 text-muted">
            Escolha um objetivo e receba um plano semana a semana com os tópicos e níveis de
            dificuldade a praticar — em vez de decidir sozinho por onde começar.
          </p>
          <ul className="mt-8 flex flex-col gap-2">
            {STUDY_PLAN_GOALS.map((goal) => {
              const level = getLevel(goal.levelId);
              return (
                <li key={goal.id}>
                  <Link
                    href={`/plano-de-estudos?meta=${goal.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                  >
                    {goal.label}
                    {level?.premium && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        Premium
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  const goal = getStudyPlanGoal(meta);
  if (!goal) notFound();
  const level = getLevel(goal.levelId);
  if (!level || !level.available) notFound();
  const topics = getTopicsForLevel(goal.levelId);
  if (topics.length === 0) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <Link href="/plano-de-estudos" className="text-sm font-medium text-primary hover:underline">
          ← Escolher outro objetivo
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">{goal.label}</h1>
        <p className="mt-2 text-muted">{level.name}</p>
        <div className="mt-8">
          <StudyPlanView
            key={goal.id}
            goal={goal}
            topics={topics.map((t) => ({ id: t.id, title: t.title }))}
          />
        </div>
      </div>
    </div>
  );
}
