import { compileExpression } from "@/lib/mathExpr";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

// Photo-solved answers aren't curated to a single canonical string shape the
// way curriculum exercises are (e.g. Claude might write "x = 5" while the
// student just types "5", or "3/4" while the student types "0.75") — so this
// needs a looser comparison than the exercise engine's plain normalize().
function stripAssignmentPrefix(value: string): string {
  return value.replace(/^[a-z]\s*=\s*/i, "").trim();
}

/** Checks a student's free-typed answer against a photo-solved problem's
 * stored answer. Tries, in order: normalized string equality, then (if both
 * sides strip to a valid math expression) numeric equivalence — so "3/4"
 * matches "0.75" and "x = 5" matches "5". Falls back to false rather than
 * throwing when either side doesn't parse (e.g. multi-part answers like
 * "x = 2 ou x = -3"). */
export function checkPhotoAnswer(input: string, expected: string): boolean {
  const a = stripAssignmentPrefix(input);
  const b = stripAssignmentPrefix(expected);

  if (normalize(a) === normalize(b)) return true;

  try {
    const valueA = compileExpression(a)(0);
    const valueB = compileExpression(b)(0);
    if (Number.isFinite(valueA) && Number.isFinite(valueB)) {
      return Math.abs(valueA - valueB) < 1e-6 * Math.max(1, Math.abs(valueB));
    }
  } catch {
    // Either side isn't a bare math expression (units, multiple parts,
    // free text) — the normalized string comparison above is the best we
    // can do for those cases.
  }

  return false;
}
