import type { Locale } from "@/i18n/config";

type AiUsageRow = {
  student_user_id: string;
  display_name: string | null;
  tutor_messages: number;
  photos_resolved: number;
  last_ai_activity: string | null;
};

export default function TurmaAiUsage({
  rows,
  tutorMessagesLabel,
  photosResolvedLabel,
  lastActiveLabel,
  neverUsedAi,
  locale,
}: {
  rows: AiUsageRow[];
  tutorMessagesLabel: string;
  photosResolvedLabel: string;
  lastActiveLabel: string;
  neverUsedAi: string;
  locale: Locale;
}) {
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {rows.map((row) => {
        const hasActivity = row.tutor_messages > 0 || row.photos_resolved > 0;
        return (
          <li
            key={row.student_user_id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm"
          >
            <span className="font-medium text-foreground">{row.display_name ?? "—"}</span>
            {hasActivity ? (
              <span className="text-muted">
                {tutorMessagesLabel}: {row.tutor_messages} · {photosResolvedLabel}: {row.photos_resolved}
                {row.last_ai_activity &&
                  ` · ${lastActiveLabel}: ${new Date(row.last_ai_activity).toLocaleDateString(locale)}`}
              </span>
            ) : (
              <span className="text-xs text-muted">{neverUsedAi}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
