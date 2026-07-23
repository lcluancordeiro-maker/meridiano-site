"use client";

import { useActionState, useState } from "react";
import { createAssignment } from "@/app/actions/turmas";
import { levels, getTopicsForLevel, DIFFICULTY_ORDER, DIFFICULTY_LABELS } from "@/data/curriculum";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CreateAssignmentForm({ turmaId }: { turmaId: string }) {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(createAssignment, undefined);

  const availableLevels = levels.filter((l) => l.available);
  const [levelId, setLevelId] = useState(availableLevels[0]?.id ?? "");
  const topics = getTopicsForLevel(levelId);
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const topic = topics.find((t) => t.id === topicId);
  const availableDifficulties = DIFFICULTY_ORDER.filter(
    (d) => (topic?.exercises.filter((e) => e.difficulty === d).length ?? 0) > 0
  );

  function handleLevelChange(next: string) {
    setLevelId(next);
    const nextTopics = getTopicsForLevel(next);
    setTopicId(nextTopics[0]?.id ?? "");
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="turmaId" value={turmaId} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.turmas.levelLabel}</label>
        <select
          name="levelId"
          value={levelId}
          onChange={(e) => handleLevelChange(e.target.value)}
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {availableLevels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.turmas.topicLabel}</label>
        <select
          name="topicId"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.turmas.difficultyLabel}</label>
        <select
          name="difficulty"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {availableDifficulties.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>
      </div>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending || !topicId}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.turmas.assignButton}
      </button>
    </form>
  );
}
