import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SkillPath from "@/components/SkillPath";
import { getLevel, getTopicsForLevel, levels } from "@/data/curriculum";
import { isPremiumUser } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

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
  const hasPremiumAccess = level.premium ? await isPremiumUser() : true;
  const locale = await getServerLocale();
  const { premium } = getDictionary(locale);

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

        {level.premium && !hasPremiumAccess && (
          <p className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
            {premium.paywallBody}{" "}
            <Link href="/assinatura" className="font-semibold text-primary hover:underline">
              {premium.subscribeButton}
            </Link>
          </p>
        )}

        <SkillPath levelId={level.id} topics={topics} chapters={level.chapters} />
      </div>
    </div>
  );
}
