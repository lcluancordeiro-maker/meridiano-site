import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import TopicCard from "@/components/TopicCard";
import { getLevel, getTopicsForLevel, levels } from "@/data/curriculum";

export function generateStaticParams() {
  return levels.map((level) => ({ nivel: level.id }));
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ nivel: string }>;
}) {
  const { nivel } = await params;
  const level = getLevel(nivel);

  if (!level || !level.available) {
    notFound();
  }

  const topics = getTopicsForLevel(nivel);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Voltar para os níveis
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
          {level.name}
        </h1>
        <p className="mt-2 max-w-xl text-muted">{level.description}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {topics.map((topic) => (
            <TopicCard key={topic.id} levelId={level.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
