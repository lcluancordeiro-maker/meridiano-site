import type { SupabaseClient } from "@supabase/supabase-js";
import type { PhotoSolution } from "@/lib/photoSolve";

/** Records a solved problem to /historico — shared by /api/resolver-foto
 * and /api/exercicio-parecido since both return the same PhotoSolution
 * shape. Best-effort: a DB hiccup here must never fail a request that
 * already successfully solved the problem, so failures are swallowed. */
export async function recordPhotoSolveHistory(
  supabase: SupabaseClient,
  userId: string,
  solution: PhotoSolution
): Promise<void> {
  if (!solution.enunciado.trim()) return;

  try {
    await supabase.from("photo_solve_history").insert({
      user_id: userId,
      enunciado: solution.enunciado,
      passos: solution.passos,
      resposta: solution.resposta,
    });
  } catch {
    // best-effort
  }
}
