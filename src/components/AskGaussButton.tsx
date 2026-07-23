"use client";

import { askGauss } from "@/lib/gaussPrompt";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AskGaussButton({ topicTitle }: { topicTitle: string }) {
  const { dict } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => askGauss(dict.knowledgeGraph.gaussPromptTemplate.replace("{topic}", topicTitle))}
      className="self-start rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
    >
      {dict.knowledgeGraph.askGaussButton}
    </button>
  );
}
