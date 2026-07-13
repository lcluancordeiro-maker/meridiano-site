import { BADGES } from "@/lib/gamification";

export default function BadgeGrid({ unlockedBadges }: { unlockedBadges: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {BADGES.map((badge) => {
        const unlocked = unlockedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center ${
              unlocked ? "border-border bg-surface" : "border-border bg-background opacity-50"
            }`}
          >
            <span className="text-2xl" aria-hidden>
              {unlocked ? badge.icon : "🔒"}
            </span>
            <span className="text-sm font-semibold text-foreground">{badge.name}</span>
            <span className="text-xs text-muted">{badge.description}</span>
          </div>
        );
      })}
    </div>
  );
}
