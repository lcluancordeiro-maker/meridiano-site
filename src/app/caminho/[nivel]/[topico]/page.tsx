import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getLevel, getRelatedTopics, getTopic, getTopicsForLevel, levels } from "@/data/curriculum";
import { buildPathway } from "@/lib/knowledgePathway";
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

export default async function CaminhoPage({
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

  const locale = await getServerLocale();
  const { knowledgeGraph: dict } = getDictionary(locale);

  const ring1 = getRelatedTopics(topic);
  const pathway = buildPathway({ level, topic }, ring1);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          href={`/trilha/${level.id}/${topic.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {dict.pathwayBackButton}
        </Link>

        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {dict.pathwayHeading}
        </h1>

        <div className="mt-8 rounded-2xl border-2 border-primary bg-primary/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {dict.pathwayYouAreHere}
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-foreground">{topic.title}</h2>
          <p className="text-sm text-muted">{level.name}</p>
        </div>

        {pathway.length === 0 ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {dict.pathwayEmptyState}
          </p>
        ) : (
          <ol className="mt-8 flex flex-col gap-6">
            {pathway.map((node) => (
              <li
                key={`${node.level.id}/${node.topic.id}`}
                data-testid="pathway-node"
                className="flex flex-col gap-3 border-l-2 border-primary/30 pl-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      {node.level.name}
                    </p>
                    <p className="font-display text-base font-semibold text-foreground">
                      {node.topic.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/trilha/${node.level.id}/${node.topic.id}`}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      {dict.pathwayStudyButton}
                    </Link>
                    <Link
                      href={`/caminho/${node.level.id}/${node.topic.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
                    >
                      {dict.pathwayExploreButton}
                    </Link>
                  </div>
                </div>

                {node.children.length > 0 && (
                  <ul className="ml-4 flex flex-wrap gap-2" data-testid="pathway-ring2">
                    {node.children.map((child) => (
                      <li key={`${child.level.id}/${child.topic.id}`}>
                        <Link
                          href={`/caminho/${child.level.id}/${child.topic.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary"
                        >
                          <span aria-hidden>→</span>
                          {child.topic.title}
                          <span className="text-muted">· {child.level.shortName}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
