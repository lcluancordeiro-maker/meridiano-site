/**
 * Generates/refreshes embeddings for every curriculum topic, used by the
 * knowledge graph's semantic-matching upgrade path (see "Sobre a
 * integração de conhecimento" in the README). Run manually after editing
 * curriculum.ts — this isn't wired into CI or any build step, since it
 * costs a Voyage AI API call per changed topic and needs
 * SUPABASE_SERVICE_ROLE_KEY, which shouldn't run automatically in CI.
 *
 * Usage: npm run generate-embeddings
 * Requires: VOYAGE_API_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL.
 */
import { levels, getTopicsForLevel } from "../src/data/curriculum";
import { topicToEmbeddingText, hashEmbeddingText } from "../src/lib/embeddings/topicText";
import { embedTexts, isEmbeddingsConfigured } from "../src/lib/embeddings/voyage";
import { createServiceRoleClient } from "../src/lib/supabase/serviceRole";

async function main() {
  if (!isEmbeddingsConfigured) {
    console.error("VOYAGE_API_KEY não configurada — abortando.");
    process.exit(1);
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    console.error("Supabase (URL + SUPABASE_SERVICE_ROLE_KEY) não configurado — abortando.");
    process.exit(1);
  }

  const { data: existingRows, error: fetchError } = await supabase
    .from("topic_embeddings")
    .select("level_id, topic_id, content_hash");

  if (fetchError) {
    console.error("Falha ao ler topic_embeddings existentes:", fetchError.message);
    process.exit(1);
  }

  const existingHashes = new Map<string, string>();
  for (const row of existingRows ?? []) {
    existingHashes.set(`${row.level_id}/${row.topic_id}`, row.content_hash);
  }

  const pending: { level_id: string; topic_id: string; text: string; content_hash: string }[] = [];

  for (const level of levels) {
    for (const topic of getTopicsForLevel(level.id)) {
      const text = topicToEmbeddingText(topic);
      const contentHash = hashEmbeddingText(text);
      const key = `${level.id}/${topic.id}`;

      if (existingHashes.get(key) === contentHash) continue;
      pending.push({ level_id: level.id, topic_id: topic.id, text, content_hash: contentHash });
    }
  }

  if (pending.length === 0) {
    console.log("Nada para atualizar — todos os embeddings já estão em dia.");
    return;
  }

  console.log(`Gerando embeddings para ${pending.length} tópico(s) novo(s)/alterado(s)...`);

  const BATCH_SIZE = 32;
  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    const embeddings = await embedTexts(
      batch.map((item) => item.text),
      "document"
    );

    if (!embeddings) {
      console.error("Falha ao chamar a API da Voyage — abortando o restante do lote.");
      process.exit(1);
    }

    const rows = batch.map((item, idx) => ({
      level_id: item.level_id,
      topic_id: item.topic_id,
      content_hash: item.content_hash,
      embedding: embeddings[idx],
      updated_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase.from("topic_embeddings").upsert(rows, {
      onConflict: "level_id,topic_id",
    });

    if (upsertError) {
      console.error("Falha ao gravar embeddings:", upsertError.message);
      process.exit(1);
    }

    console.log(`  ${Math.min(i + BATCH_SIZE, pending.length)}/${pending.length} concluídos`);
  }

  console.log("Pronto.");
}

main();
