import { getRelatedTopics, type Level, type Topic } from "@/data/curriculum";

export type PathwayNode = { level: Level; topic: Topic };
export type PathwayNodeWithChildren = PathwayNode & { children: PathwayNode[] };

/** Builds the pathway one hop past the center topic (ring 1: its curated
 * relatedTopics) and one hop past *that* (ring 2: each ring-1 topic's own
 * relatedTopics) — the second hop is what actually shows the "spiral
 * outward across tracks" idea (e.g. Geometria Analítica → Regressão Linear
 * → Machine Learning), not just a flat related-topics list. A shared `seen`
 * set (mirroring the pattern in KnowledgeGraph.tsx) keeps the center topic
 * and every ring-1 node from also showing up as somebody's ring-2 child —
 * and keeps the same ring-2 topic from appearing under two different
 * ring-1 parents if more than one links to it. */
export function buildPathway(center: PathwayNode, ring1: PathwayNode[]): PathwayNodeWithChildren[] {
  const seen = new Set([`${center.level.id}/${center.topic.id}`]);
  for (const node of ring1) seen.add(`${node.level.id}/${node.topic.id}`);

  const result: PathwayNodeWithChildren[] = [];
  for (const node of ring1) {
    const children: PathwayNode[] = [];
    for (const child of getRelatedTopics(node.topic)) {
      const key = `${child.level.id}/${child.topic.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      children.push(child);
    }
    result.push({ ...node, children });
  }
  return result;
}
