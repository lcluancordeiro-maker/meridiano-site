"use server";

import { searchCurriculum, type CurriculumSearchResult } from "@/lib/curriculumSearch";

/** Thin server-only wrapper so the curriculum data (theory/exercises for
 * every track, ~1MB) never gets pulled into client JS just to power a
 * search box that's mounted on every page via the Navbar — only this
 * small RPC stub ships to the client. */
export async function searchCurriculumAction(query: string): Promise<CurriculumSearchResult[]> {
  return searchCurriculum(query);
}
