import type { Topic } from "@/data/curriculum";
import { createHash } from "crypto";

/** Flattens a topic's title, summary and theory into a single text blob to
 * embed — exercises are deliberately left out (they're drill variations of
 * the same underlying idea already captured by the theory, and including
 * all of them would dilute the embedding with repetitive phrasing). */
export function topicToEmbeddingText(topic: Topic): string {
  const theoryText = topic.theory.map((section) => `${section.heading}\n${section.body.join(" ")}`).join("\n\n");
  return `${topic.title}\n${topic.summary}\n\n${theoryText}`;
}

/** Stable hash of the embeddable text, used to skip re-embedding a topic
 * whose content hasn't changed since the last run of
 * scripts/generate-topic-embeddings.ts. */
export function hashEmbeddingText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
