import Link from "next/link";
import Navbar from "@/components/Navbar";
import LevelCard from "@/components/LevelCard";
import DailyChallenge from "@/components/DailyChallenge";
import { levels } from "@/data/curriculum";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const { home, premium } = dict;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-20 sm:py-28">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-primary">
            {home.heroTag}
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {home.heroTitle}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{home.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#niveis"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {home.verTrilhas}
            </Link>
            <Link
              href="/trilha/fundamental-2"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {home.comecarFundamental2}
            </Link>
          </div>
        </div>
      </section>

      <DailyChallenge />

      <section id="niveis" className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {home.escolhaNivel}
          </h2>
          <p className="mt-2 text-muted">{home.niveisDisponiveis}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {levels
            .filter((level) => level.group === "serie")
            .map((level) => (
              <LevelCard key={level.id} level={level} emBreve={home.emBreve} comecarTrilha={home.comecarTrilha} premiumBadge={premium.navBadge} />
            ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {home.estatisticaHeading}
            </h2>
            <p className="mt-2 text-muted">{home.estatisticaSubtitle}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {levels
              .filter((level) => level.group === "estatistica")
              .map((level) => (
                <LevelCard key={level.id} level={level} emBreve={home.emBreve} comecarTrilha={home.comecarTrilha} premiumBadge={premium.navBadge} />
              ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {home.programacaoHeading}
            </h2>
            <p className="mt-2 text-muted">{home.programacaoSubtitle}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {levels
              .filter((level) => level.group === "programacao")
              .map((level) => (
                <LevelCard key={level.id} level={level} emBreve={home.emBreve} comecarTrilha={home.comecarTrilha} premiumBadge={premium.navBadge} />
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {home.econometriaHeading}
          </h2>
          <p className="mt-2 text-muted">{home.econometriaSubtitle}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {levels
            .filter((level) => level.group === "econometria")
            .map((level) => (
              <LevelCard key={level.id} level={level} emBreve={home.emBreve} comecarTrilha={home.comecarTrilha} premiumBadge={premium.navBadge} />
            ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {home.financasHeading}
            </h2>
            <p className="mt-2 text-muted">{home.financasSubtitle}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {levels
              .filter((level) => level.group === "financas")
              .map((level) => (
                <LevelCard key={level.id} level={level} emBreve={home.emBreve} comecarTrilha={home.comecarTrilha} premiumBadge={premium.navBadge} />
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {home.vestibularesHeading}
          </h2>
          <p className="mt-2 text-muted">{home.vestibularesSubtitle}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {levels
            .filter((level) => level.group === "vestibulares")
            .map((level) => (
              <LevelCard key={level.id} level={level} emBreve={home.emBreve} comecarTrilha={home.comecarTrilha} premiumBadge={premium.navBadge} />
            ))}
        </div>
      </section>

      <section id="sobre" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {home.sobreHeading}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{home.sobreBody}</p>
        </div>
      </section>

      <footer className="mt-auto border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-muted">
          <span>
            © {new Date().getFullYear()} {home.footer}
          </span>
          <Link href="/privacidade" className="hover:text-foreground hover:underline">
            {home.privacyLink}
          </Link>
        </div>
      </footer>
    </div>
  );
}
