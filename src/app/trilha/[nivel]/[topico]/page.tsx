import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ExerciseQuiz from "@/components/ExerciseQuiz";
import { fundamental2Topics, getLevel, getTopic } from "@/data/curriculum";

export function generateStaticParams() {
  return fundamental2Topics.map((topic) => ({
    nivel: "fundamental-2",
    topico: topic.id,
  }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ nivel: string; topico: string }>;
}) {
  const { nivel, topico } = await params;
  const level = getLevel(nivel);
  const topic = getTopic(nivel, topico);

  if (!level || !level.available || !topic) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          href={`/trilha/${level.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Voltar para {level.name}
        </Link>

        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-2 text-muted">{topic.summary}</p>

        <div className="mt-10 flex flex-col gap-8">
          {topic.theory.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {section.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.example && (
                <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Exemplo: {section.example.problem}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {section.example.solution}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
            Praticar
          </h2>
          <ExerciseQuiz
            levelId={level.id}
            topicId={topic.id}
            exercises={topic.exercises}
          />
        </div>
      </div>
    </div>
  );
}
