/** Midnight UTC of the Monday on/before `now` — the same week boundary
 * Postgres's `date_trunc('week', ...)` uses, so this lines up with
 * `get_weekly_leaderboard()`'s SQL in supabase/schema.sql. */
export function startOfWeekUTC(now: Date): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay(); // 0=Sun..6=Sat
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diffToMonday);
  return d;
}

/** Sums the "YYYY-MM-DD" -> xp entries of a gamification_state.xp_log that
 * fall within the current week (Monday through today). */
export function sumWeeklyXp(xpLog: Record<string, number>, now: Date = new Date()): number {
  const weekStart = startOfWeekUTC(now);
  let total = 0;
  for (const [dateStr, xp] of Object.entries(xpLog)) {
    const entryDate = new Date(`${dateStr}T00:00:00Z`);
    if (entryDate >= weekStart) total += xp;
  }
  return total;
}

export type WeeklyDigestData = {
  studentName: string;
  weeklyXp: number;
  exercisesCompletedThisWeek: number;
  streakCurrent: number;
};

/** Builds the HTML body for the weekly parent/guardian digest email. Plain
 * hardcoded PT-BR, same as the parental-consent email in actions/identity.ts
 * — this app's other transactional emails aren't translated either. */
export function buildWeeklyDigestEmail(data: WeeklyDigestData): string {
  const { studentName, weeklyXp, exercisesCompletedThisWeek, streakCurrent } = data;
  return `<p>Olá,</p>
<p>Aqui está o resumo desta semana de <strong>${studentName}</strong> no Meridiano Matemática:</p>
<ul>
  <li><strong>${weeklyXp} XP</strong> ganho esta semana</li>
  <li><strong>${exercisesCompletedThisWeek}</strong> ${exercisesCompletedThisWeek === 1 ? "exercício concluído" : "exercícios concluídos"} esta semana</li>
  <li><strong>${streakCurrent}</strong> ${streakCurrent === 1 ? "dia seguido" : "dias seguidos"} de sequência atual</li>
</ul>
<p>Você está recebendo este e-mail porque autorizou o uso dos recursos sociais do app para essa conta. Para parar de receber, entre em contato com quem administra a conta do aluno.</p>`;
}
