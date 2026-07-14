import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { setLeaderboardOptIn } from "@/app/actions/leaderboard";

type LeaderboardRow = { display_name: string; weekly_xp: number; rank: number };

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default async function LigaPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!isSupabaseConfigured || !supabase || !user) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-foreground">Liga semanal</h1>
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {!isSupabaseConfigured ? (
              "A liga semanal ainda não está disponível neste app."
            ) : (
              <>
                Faça login para participar da liga semanal.{" "}
                <Link href="/entrar" className="font-semibold text-primary hover:underline">
                  Entrar
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("leaderboard_opt_in")
    .eq("id", user.id)
    .single();
  const optedIn = Boolean(profile?.leaderboard_opt_in);

  const { data } = optedIn ? await supabase.rpc("get_weekly_leaderboard") : { data: null };
  const rows = (data ?? []) as LeaderboardRow[];

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Liga semanal</h1>
        <p className="mt-2 text-muted">
          Um ranking amistoso do XP ganho nesta semana. Só participa (e vê a liga) quem entra por
          vontade própria — e apenas o nome de exibição aparece.
        </p>

        <form action={setLeaderboardOptIn} className="mt-6">
          <input type="hidden" name="optIn" value={optedIn ? "false" : "true"} />
          <button
            type="submit"
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
              optedIn
                ? "border border-border text-muted hover:border-error hover:text-error"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {optedIn ? "Sair da liga" : "Entrar na liga"}
          </button>
        </form>

        {optedIn && (
          <div className="mt-8">
            {rows.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
                Ninguém pontuou nesta semana ainda — resolva exercícios para abrir o placar!
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {rows.map((row) => (
                  <li
                    key={`${row.rank}-${row.display_name}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 text-center font-display text-sm font-semibold text-muted">
                        {MEDALS[row.rank] ?? `${row.rank}º`}
                      </span>
                      <span className="text-sm font-medium text-foreground">{row.display_name}</span>
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {row.weekly_xp} XP
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-xs text-muted">
              A semana começa na segunda-feira. O XP conta a partir do que é sincronizado quando
              você usa o app logado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
