import { DIFFICULTY_LABELS, getLevel, getTopic, type Difficulty } from "@/data/curriculum";

type AssignmentRow = { id: string; level_id: string; topic_id: string; difficulty: Difficulty };
type StudentRow = { student_user_id: string; display_name: string | null };
type ProgressRow = { student_user_id: string; score: number | null; total: number | null; completed: boolean | null };

export default function TurmaPerformanceMatrix({
  assignments,
  students,
  progressByAssignment,
  notAttemptedLabel,
  studentColumnLabel,
}: {
  assignments: AssignmentRow[];
  students: StudentRow[];
  progressByAssignment: Record<string, ProgressRow[]>;
  notAttemptedLabel: string;
  studentColumnLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="sticky left-0 bg-surface px-3 py-2 text-left font-semibold text-foreground">
              {studentColumnLabel}
            </th>
            {assignments.map((assignment) => {
              const topic = getTopic(assignment.level_id, assignment.topic_id);
              const level = getLevel(assignment.level_id);
              return (
                <th key={assignment.id} className="px-3 py-2 text-left font-medium text-muted">
                  <div className="whitespace-nowrap">{topic?.title ?? assignment.topic_id}</div>
                  <div className="whitespace-nowrap text-xs font-normal">
                    {level?.name} · {DIFFICULTY_LABELS[assignment.difficulty]}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_user_id} className="border-b border-border last:border-0">
              <td className="sticky left-0 bg-background px-3 py-2 font-medium text-foreground">
                {student.display_name ?? "—"}
              </td>
              {assignments.map((assignment) => {
                const progress = progressByAssignment[assignment.id]?.find(
                  (p) => p.student_user_id === student.student_user_id
                );
                const attempted = progress && progress.total != null && progress.total > 0;
                const pct = attempted ? Math.round(((progress!.score ?? 0) / progress!.total!) * 100) : null;

                return (
                  <td key={assignment.id} className="px-3 py-2">
                    {attempted ? (
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          pct! >= 70
                            ? "bg-success-bg text-success"
                            : pct! >= 50
                              ? "bg-warning-bg text-warning"
                              : "bg-error-bg text-error"
                        }`}
                      >
                        {progress!.score}/{progress!.total} ({pct}%)
                      </span>
                    ) : (
                      <span className="text-xs text-muted">{notAttemptedLabel}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
