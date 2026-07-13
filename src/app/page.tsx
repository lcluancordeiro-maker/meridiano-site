import Link from "next/link";
import Navbar from "@/components/Navbar";
import LevelCard from "@/components/LevelCard";
import { levels } from "@/data/curriculum";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-20 sm:py-28">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-primary">
            Do fundamental ao superior
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Aprenda matemática no seu ritmo, com teoria clara e exercícios
            que dão feedback na hora.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Trilhas organizadas por nível de ensino, explicações objetivas e
            prática guiada — tudo direto no navegador, sem precisar instalar
            nada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#niveis"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Ver trilhas disponíveis
            </Link>
            <Link
              href="/trilha/fundamental-2"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Começar Fundamental II
            </Link>
          </div>
        </div>
      </section>

      <section id="niveis" className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Escolha seu nível de ensino
          </h2>
          <p className="mt-2 text-muted">
            Estamos começando pelo Ensino Fundamental II — os demais níveis
            chegam em breve.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {levels.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>
      </section>

      <section id="sobre" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Sobre o Meridiano Matemática
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Um app web instalável (PWA) que funciona em qualquer dispositivo
            — computador, celular ou tablet — e pode ser adicionado à tela
            inicial no iOS e Android como um app nativo. Cada trilha combina
            teoria objetiva com exercícios corrigidos na hora para consolidar
            o aprendizado.
          </p>
        </div>
      </section>

      <footer className="mt-auto border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-6 text-sm text-muted">
          © {new Date().getFullYear()} Meridiano Matemática.
        </div>
      </footer>
    </div>
  );
}
