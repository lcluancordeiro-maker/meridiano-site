"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchCurriculumAction } from "@/app/actions/search";
import type { CurriculumSearchResult } from "@/lib/curriculumSearch";

const DEBOUNCE_MS = 200;

export default function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CurriculumSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const found = await searchCurriculumAction(query);
        setResults(found);
        setActiveIndex(0);
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  function goTo(result: CurriculumSearchResult) {
    close();
    router.push(`/trilha/${result.levelId}/${result.topicId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      goTo(results[activeIndex]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar no currículo"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm transition-colors hover:border-primary"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-20"
          onClick={close}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-surface p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar tópicos em todas as trilhas..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />

            <div className="mt-3 max-h-96 overflow-y-auto">
              {!query.trim() ? (
                <p className="px-2 py-4 text-sm text-muted">
                  Digite para buscar um tópico em qualquer trilha — Fundamental, Médio, Estatística,
                  Programação e mais.
                </p>
              ) : isPending && results.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted">Buscando...</p>
              ) : results.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted">
                  Nenhum tópico encontrado para &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {results.map((result, index) => (
                    <li key={`${result.levelId}/${result.topicId}`}>
                      <button
                        type="button"
                        onClick={() => goTo(result)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex w-full flex-col rounded-xl px-3 py-2 text-left transition-colors ${
                          index === activeIndex ? "bg-background" : "hover:bg-background"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          {result.topicTitle}
                          {result.levelPremium && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              Premium
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted">{result.levelName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
