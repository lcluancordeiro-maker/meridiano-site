export default function StatTile({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
      {subtext && <p className="mt-1 text-xs text-muted">{subtext}</p>}
    </div>
  );
}
