function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
}

/** Matches a spoken transcript against a multiple-choice exercise's options
 * — exact match first, then substring, then best word overlap. Returns null
 * if nothing matches well enough to guess. */
export function matchSpokenOption(transcript: string, options: string[]): string | null {
  const normalizedTranscript = normalizeForMatch(transcript);
  if (!normalizedTranscript) return null;

  const exact = options.find((option) => normalizeForMatch(option) === normalizedTranscript);
  if (exact) return exact;

  const substring = options.find((option) => {
    const normalizedOption = normalizeForMatch(option);
    return normalizedOption.length > 0 && (normalizedTranscript.includes(normalizedOption) || normalizedOption.includes(normalizedTranscript));
  });
  if (substring) return substring;

  const transcriptWords = new Set(normalizedTranscript.split(/\s+/).filter(Boolean));
  let best: { option: string; score: number } | null = null;
  for (const option of options) {
    const optionWords = normalizeForMatch(option).split(/\s+/).filter(Boolean);
    const score = optionWords.filter((word) => transcriptWords.has(word)).length;
    if (score > 0 && (!best || score > best.score)) best = { option, score };
  }
  return best?.option ?? null;
}

/** Pulls the first number out of a spoken transcript (e.g. "a resposta é 42"
 * → "42") so a numeric-answer field isn't stuck with filler words. Tries a
 * fraction pattern first ("2/3") before a plain decimal, since many
 * exercises in this app use fraction answers — matching the plain-number
 * pattern first would truncate "2/3" down to just "2". Falls back to the
 * trimmed transcript itself if no digit is found — speech engines often
 * already numeralize spoken digits, but this keeps working for exercises
 * whose answer isn't purely numeric characters (e.g. "16 pares"). */
export function extractSpokenNumber(transcript: string): string {
  const fraction = transcript.match(/-?\d+\/\d+/);
  if (fraction) return fraction[0];

  const number = transcript.match(/-?\d+(?:[.,]\d+)?/);
  return number ? number[0] : transcript.trim();
}
