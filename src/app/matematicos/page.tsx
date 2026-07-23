import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MATHEMATICIANS } from "@/data/mathematicians";

export const metadata: Metadata = {
  title: "Grandes matemáticos — Meridiano Matemática",
  description:
    "Biografias dos grandes nomes da história da matemática: de Pitágoras e Hipátia a Euler e Gauss.",
};

export default function MatematicosPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Grandes matemáticos
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          A matemática que você estuda tem milhares de anos de história — e foi construída por
          pessoas. Conheça algumas das figuras que criaram as ideias das trilhas do app.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {MATHEMATICIANS.map((figure) => (
            <Link
              key={figure.id}
              href={`/matematicos/${figure.id}`}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {figure.portrait}
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {figure.name}
                  </h2>
                  <p className="text-xs text-muted">
                    {figure.years} · {figure.origin}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted">{figure.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
