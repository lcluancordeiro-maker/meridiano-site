import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdmin } from "@/lib/entitlements";
import { aggregateEventCounts, type AnalyticsEventRow } from "@/lib/analytics/aggregateEventCounts";

const WINDOW_DAYS = 7;

export default async function AnalyticsAdminPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/entrar");

  if (!(await isAdmin())) notFound();

  const since = new Date();
  since.setDate(since.getDate() - (WINDOW_DAYS - 1));
  const { data } = await supabase
    .from("analytics_events")
    .select("event_name, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(5000);
  const rows = (data as AnalyticsEventRow[] | null) ?? [];
  const table = aggregateEventCounts(rows, WINDOW_DAYS);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Analytics de produto</h1>
        <p className="mt-2 text-muted">
          Contagem diária de eventos de funil nos últimos {WINDOW_DAYS} dias — signup, primeiro
          exercício concluído, primeira mensagem ao Gauss, primeira foto resolvida.
        </p>

        {table.rows.length === 0 ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Nenhum evento registrado ainda nesse período.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-muted">
                  <th className="p-3 font-semibold">Evento</th>
                  {table.dates.map((date) => (
                    <th key={date} className="p-3 text-right font-semibold">
                      {date.slice(5)}
                    </th>
                  ))}
                  <th className="p-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.eventName} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{row.eventName}</td>
                    {table.dates.map((date) => (
                      <td key={date} className="p-3 text-right text-foreground/80">
                        {row.countsByDate[date] ?? 0}
                      </td>
                    ))}
                    <td className="p-3 text-right font-semibold text-foreground">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
