import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DiagnosticQuiz from "@/components/DiagnosticQuiz";
import { getLevel, getTopicsForLevel, levels } from "@/data/curriculum";

export const metadata = {
  title: "Teste de nivelamento",
  description: "Responda algumas perguntas e descubra por onde começar em uma trilha.",
};

export default async function DiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{ trilha?: string; boasVindas?: string }>;
}) {
  const { trilha, boasVindas } = await searchParams;

  if (!trilha) {
    // Premium tracks are skipped here — the diagnostic is a quick "where do
    // I start" pointer, not a substitute for the paywall/subscription flow.
    const options = levels.filter((l) => l.available && !l.premium);
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          {boasVindas === "1" && (
            <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
              <p className="font-semibold">Bem-vindo(a) ao Meridiano Matemática! 🎉</p>
              <p className="mt-1 text-muted">
                Antes de começar, que tal um teste rápido de nivelamento? Em poucos minutos a gente
                descobre por onde você deve começar em vez de você ter que adivinhar.
              </p>
              <Link href="/progresso" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                Pular por agora →
              </Link>
            </div>
          )}
          <h1 className="font-display text-3xl font-semibold text-foreground">Teste de nivelamento</h1>
          <p className="mt-2 text-muted">
            Escolha uma trilha e responda algumas perguntas — a gente sugere por onde começar em vez de
            você ter que adivinhar.
          </p>
          <ul className="mt-8 flex flex-col gap-2">
            {options.map((level) => (
              <li key={level.id}>
                <Link
                  href={`/diagnostico?trilha=${level.id}`}
                  className="block rounded-xl border border-border bg-surface p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                >
                  {level.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const level = getLevel(trilha);
  if (!level || !level.available || level.premium) notFound();
  const topics = getTopicsForLevel(trilha);
  if (topics.length === 0) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <Link href="/diagnostico" className="text-sm font-medium text-primary hover:underline">
          ← Escolher outra trilha
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">{level.name}</h1>
        <p className="mt-2 text-muted">
          {questionsCountLabel(topics.length)} — sem pressa, é só pra saber por onde começar.
        </p>
        <div className="mt-8">
          <DiagnosticQuiz levelId={level.id} levelName={level.name} topics={topics} />
        </div>
      </div>
    </div>
  );
}

function questionsCountLabel(topicCount: number): string {
  const sampled = Math.min(4, topicCount);
  const questions = sampled * 2;
  return `${questions} perguntas rápidas`;
}
