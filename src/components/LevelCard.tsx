import Link from "next/link";
import type { Level } from "@/data/curriculum";

export default function LevelCard({ level }: { level: Level }) {
  const content = (
    <div
      className={`group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all ${
        level.available
          ? "hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
          : "opacity-60"
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
            {level.shortName}
          </span>
          {!level.available && (
            <span className="rounded-full bg-border px-2.5 py-1 text-xs font-medium text-muted">
              Em breve
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
          {level.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {level.description}
        </p>
      </div>
      {level.available && (
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Começar trilha
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </div>
  );

  if (!level.available) {
    return <div aria-disabled>{content}</div>;
  }

  return <Link href={`/trilha/${level.id}`}>{content}</Link>;
}
