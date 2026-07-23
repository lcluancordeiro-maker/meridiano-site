import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MATHEMATICIANS, getMathematician } from "@/data/mathematicians";
import { getLevel, getTopic } from "@/data/curriculum";

export function generateStaticParams() {
  return MATHEMATICIANS.map((figure) => ({ figura: figure.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ figura: string }>;
}): Promise<Metadata> {
  const { figura } = await params;
  const figure = getMathematician(figura);
  if (!figure) return {};
  return {
    title: `${figure.name} — Grandes matemáticos — Meridiano Matemática`,
    description: `${figure.name} (${figure.years}): ${figure.tagline}.`,
  };
}

export default async function MatematicoPage({
  params,
}: {
  params: Promise<{ figura: string }>;
}) {
  const { figura } = await params;
  const figure = getMathematician(figura);
  if (!figure) notFound();

  const related = (figure.relatedTopics ?? [])
    .map((ref) => {
      const level = getLevel(ref.levelId);
      const topic = getTopic(ref.levelId, ref.topicId);
      return level && topic ? { level, topic } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link href="/matematicos" className="text-sm font-medium text-primary hover:underline">
          ← Todos os matemáticos
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-5xl" aria-hidden>
            {figure.portrait}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {figure.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {figure.years} · {figure.origin}
            </p>
          </div>
        </div>
        <p className="mt-4 font-display text-lg font-medium text-primary">{figure.tagline}</p>

        <div className="mt-6 flex flex-col gap-4">
          {figure.bio.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
          Principais contribuições
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {figure.contributions.map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground/85"
            >
              {item}
            </li>
          ))}
        </ul>

        {related.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
              Estude as ideias de {figure.name} no app
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {related.map(({ level, topic }) => (
                <Link
                  key={`${level.id}/${topic.id}`}
                  href={`/trilha/${level.id}/${topic.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary"
                >
                  <span>
                    {topic.title}
                    <span className="ml-2 text-xs font-normal text-muted">{level.shortName}</span>
                  </span>
                  <span aria-hidden className="text-primary">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
