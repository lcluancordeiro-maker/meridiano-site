import "server-only";

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_MODEL = "voyage-4";

/** Output dimension requested from Voyage — must match the `vector(1024)`
 * column in `topic_embeddings` (see supabase/schema.sql). */
export const EMBEDDING_DIMENSION = 1024;

/** True once a Voyage AI API key is configured. When false, semantic
 * matching for the knowledge graph is unavailable and KnowledgeGraph.tsx
 * falls back to the manually curated `relatedTopics` links only. */
export const isEmbeddingsConfigured = Boolean(VOYAGE_API_KEY);

type VoyageEmbeddingResponse = {
  data: { embedding: number[]; index: number }[];
};

/** Embeds a batch of texts via the Voyage AI HTTP API (no SDK dependency —
 * same "plain fetch" pattern used for Resend). `inputType` should be
 * "document" when embedding curriculum content to be searched, or "query"
 * when embedding a search query — Voyage prepends a different internal
 * prompt for each, which measurably improves retrieval quality. Returns
 * null if not configured or the request fails. */
export async function embedTexts(texts: string[], inputType: "query" | "document"): Promise<number[][] | null> {
  if (!isEmbeddingsConfigured) return null;

  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: inputType,
      output_dimension: EMBEDDING_DIMENSION,
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as VoyageEmbeddingResponse;
  return [...data.data].sort((a, b) => a.index - b.index).map((d) => d.embedding);
}
