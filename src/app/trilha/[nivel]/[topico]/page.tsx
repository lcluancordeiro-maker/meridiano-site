import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SetTutorContext from "@/components/SetTutorContext";
import PracticeSection from "@/components/PracticeSection";
import LazyFunctionGrapher from "@/components/LazyFunctionGrapher";
import InteractiveWidgetRenderer from "@/components/widgets/InteractiveWidgetRenderer";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import TheoryCheckQuestion from "@/components/TheoryCheckQuestion";
import { getLevel, getTopic, getTopicsForLevel, levels } from "@/data/curriculum";
import { getMathematician } from "@/data/mathematicians";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nivel: string; topico: string }>;
}): Promise<Metadata> {
  const { nivel, topico } = await params;
  const level = getLevel(nivel);
  const topic = getTopic(nivel, topico);
  if (!level || !topic) return {};
  return {
    title: `${topic.title} — ${level.name}`,
    description: topic.summary,
    alternates: { canonical: `/trilha/${level.id}/${topic.id}` },
  };
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
  const { premium, knowledgeGraph } = getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <SetTutorContext levelName={level.name} topicTitle={topic.title} />
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
                      <p className="whitespace-pre-line text-sm font-semibold text-foreground">
                        Exemplo: {section.example.problem}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {section.example.solution}
                      </p>
                    </div>
                  )}
                  {section.interactiveWidget && (
                    <div className="mt-4">
                      <InteractiveWidgetRenderer widget={section.interactiveWidget} />
                    </div>
                  )}
                  {section.checkQuestion && (
                    <TheoryCheckQuestion question={section.checkQuestion} />
                  )}
                </div>
              ))}
            </div>

            {topic.historicalNote && (
              <aside className="mt-10 rounded-2xl border border-warning/30 bg-warning-bg p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-warning">
                  📜 Um pouco de história
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                  {topic.historicalNote.title}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {topic.historicalNote.body.map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-foreground/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {topic.historicalNote.mathematicians && (
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium text-muted">Conheça:</span>
                    {topic.historicalNote.mathematicians.map((id) => {
                      const figure = getMathematician(id);
                      if (!figure) return null;
                      return (
                        <Link
                          key={id}
                          href={`/matematicos/${figure.id}`}
                          className="rounded-full border border-warning/40 bg-surface px-3 py-1 font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          {figure.portrait} {figure.name}
                        </Link>
                      );
                    })}
                  </p>
                )}
              </aside>
            )}

            {topic.graphExpressions && (
              <div className="mt-10">
                <h2 className="mb-1 font-display text-xl font-semibold text-foreground">
                  Explore no gráfico
                </h2>
                <p className="mb-4 text-sm text-muted">
                  Mude a expressão abaixo e veja como o gráfico se transforma.
                </p>
                <LazyFunctionGrapher initialExpressions={topic.graphExpressions} />
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

            <KnowledgeGraph levelId={level.id} topic={topic} dict={knowledgeGraph} />
          </>
        )}
      </div>
    </div>
  );
}
