import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PracticeSection from "@/components/PracticeSection";
import FunctionGrapher from "@/components/FunctionGrapher";
import { getLevel, getTopic, getTopicsForLevel, levels } from "@/data/curriculum";
import { isPremiumUser } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

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

  const hasPremiumAccess = level.premium ? await isPremiumUser() : true;
  const locale = await getServerLocale();
  const { premium } = getDictionary(locale);

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

        {!hasPremiumAccess ? (
          <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {premium.paywallHeading}
            </h2>
            <p className="mt-2 text-sm text-muted">{premium.paywallBody}</p>
            <Link
              href="/assinatura"
              className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {premium.subscribeButton}
            </Link>
          </div>
        ) : (
          <>
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

            {topic.graphExpressions && (
              <div className="mt-10">
                <h2 className="mb-1 font-display text-xl font-semibold text-foreground">
                  Explore no gráfico
                </h2>
                <p className="mb-4 text-sm text-muted">
                  Mude a expressão abaixo e veja como o gráfico se transforma.
                </p>
                <FunctionGrapher initialExpressions={topic.graphExpressions} />
              </div>
            )}

            <div className="mt-12">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                Praticar
              </h2>
              <PracticeSection
                levelId={level.id}
                topicId={topic.id}
                exercises={topic.exercises}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
