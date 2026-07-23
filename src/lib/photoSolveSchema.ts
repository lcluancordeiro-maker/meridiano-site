/** Structured-output schema for a solved math problem — shared between
 * /api/resolver-foto (solves a photographed problem) and
 * /api/exercicio-parecido (generates a fresh, similar practice problem),
 * since both return the same PhotoSolution shape. */
export const PHOTO_SOLUTION_SCHEMA = {
  type: "object" as const,
  properties: {
    enunciado: { type: "string" as const },
    passos: { type: "array" as const, items: { type: "string" as const } },
    resposta: { type: "string" as const },
  },
  required: ["enunciado", "passos", "resposta"],
  additionalProperties: false,
};
