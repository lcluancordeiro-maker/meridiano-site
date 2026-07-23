const MAX_TITLE_CHARS = 60;

/** Derives a short conversation title from its first user message — used
 * when persisting a new gauss_conversations row so /historico has
 * something readable to list instead of a raw uuid. */
export function titleFromMessage(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= MAX_TITLE_CHARS) return trimmed;
  return `${trimmed.slice(0, MAX_TITLE_CHARS - 1).trimEnd()}…`;
}
