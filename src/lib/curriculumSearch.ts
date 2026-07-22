import { levels, getTopicsForLevel } from "@/data/curriculum";

export type CurriculumSearchResult = {
  levelId: string;
  levelName: string;
  levelPremium: boolean;
  topicId: string;
  topicTitle: string;
  summary: string;
};

const MAX_RESULTS = 20;
const COMBINING_MARKS = /[\u0300-\u036f]/g;

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "");
}

/** Searches every available track's topics by title/summary, accent- and
 * case-insensitive. Locked (`!available`) tracks are excluded — a result
 * linking to a track the student can't open yet isn't useful. Premium
 * tracks ARE included (clicking through hits the same paywall the track
 * page itself already shows, so the search doesn't need to special-case
 * it beyond flagging `levelPremium` for a UI badge). */
export function searchCurriculum(query: string): CurriculumSearchResult[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const results: CurriculumSearchResult[] = [];
  for (const level of levels) {
    if (!level.available) continue;
    for (const topic of getTopicsForLevel(level.id)) {
      const titleMatch = normalize(topic.title).includes(q);
      const summaryMatch = normalize(topic.summary).includes(q);
      if (titleMatch || summaryMatch) {
        results.push({
          levelId: level.id,
          levelName: level.name,
          levelPremium: level.premium,
          topicId: topic.id,
          topicTitle: topic.title,
          summary: topic.summary,
        });
      }
    }
  }

  results.sort((a, b) => {
    const aTitleMatch = normalize(a.topicTitle).includes(q);
    const bTitleMatch = normalize(b.topicTitle).includes(q);
    if (aTitleMatch !== bTitleMatch) return aTitleMatch ? -1 : 1;
    return a.topicTitle.localeCompare(b.topicTitle, "pt-BR");
  });

  return results.slice(0, MAX_RESULTS);
}
