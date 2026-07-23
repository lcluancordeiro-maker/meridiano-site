"use client";

import Link from "next/link";
import { useGamification } from "@/lib/useGamification";
import { levelFromXp } from "@/lib/gamification";

export default function NavbarXpBadge() {
  const gamification = useGamification();
  if (gamification.xp === 0 && gamification.streak.current === 0) return null;

  const { level } = levelFromXp(gamification.xp);

  return (
    <Link
      href="/progresso"
      className="flex items-center gap-2.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
    >
      <span className="flex items-center gap-1 text-primary">⭐ Nv. {level}</span>
      {gamification.streak.current > 0 && (
        <span className="flex items-center gap-1 text-accent">
          🔥 {gamification.streak.current}
        </span>
      )}
    </Link>
  );
}
