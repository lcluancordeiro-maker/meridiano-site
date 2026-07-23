"use client";

import { useActionState } from "react";
import { hostLiveQuiz } from "@/app/actions/liveQuiz";
import { getLevel, getTopic, DIFFICULTY_LABELS, type Difficulty } from "@/data/curriculum";
import { useTranslation } from "@/i18n/LanguageContext";

type AssignmentOption = { id: string; level_id: string; topic_id: string; difficulty: Difficulty };

export default function HostLiveQuizForm({
  turmaId,
  assignments,
}: {
  turmaId: string;
  assignments: AssignmentOption[];
}) {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(hostLiveQuiz, undefined);

  if (assignments.length === 0) {
    return <p className="text-sm text-muted">{dict.liveQuiz.noAssignmentsToHost}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="turmaId" value={turmaId} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.liveQuiz.assignmentLabel}</label>
        <select
          name="assignmentId"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {assignments.map((assignment) => {
            const level = getLevel(assignment.level_id);
            const topic = getTopic(assignment.level_id, assignment.topic_id);
            return (
              <option key={assignment.id} value={assignment.id}>
                {level?.name} · {topic?.title ?? assignment.topic_id} · {DIFFICULTY_LABELS[assignment.difficulty]}
              </option>
            );
          })}
        </select>
      </div>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.liveQuiz.hostButton}
      </button>
    </form>
  );
}
