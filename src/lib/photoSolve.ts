/** Shape returned by the "resolver por foto" route — a step-by-step
 * solution to a math problem photographed by the user. */
export interface PhotoSolution {
  enunciado: string;
  passos: string[];
  resposta: string;
}

const JSON_FENCE = /```(?:json)?\s*([\s\S]*?)```/i;

function isPhotoSolution(value: unknown): value is PhotoSolution {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.enunciado === "string" &&
    Array.isArray(v.passos) &&
    v.passos.every((p) => typeof p === "string") &&
    typeof v.resposta === "string"
  );
}

/** Parses Claude's response text into a PhotoSolution. Claude is instructed
 * to reply with strict JSON, but may still wrap it in a markdown fence or
 * add stray whitespace — this tolerates both. If parsing fails entirely,
 * the raw text is preserved as a single step so nothing is silently lost. */
export function parsePhotoSolution(text: string): PhotoSolution {
  const fenced = text.match(JSON_FENCE);
  const candidate = (fenced ? fenced[1] : text).trim();

  try {
    const parsed: unknown = JSON.parse(candidate);
    if (isPhotoSolution(parsed)) return parsed;
  } catch {
    // fall through to the raw-text fallback below
  }

  return { enunciado: "", passos: [text.trim()], resposta: "" };
}
