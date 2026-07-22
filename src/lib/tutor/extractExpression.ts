import { compileExpression } from "@/lib/mathExpr";

const DEFAULT_EXPRESSION = "x^2";

// Matches "f(x) = ..." or "y = ..." definitions, capturing everything up to
// a sentence-ending punctuation mark, a newline, or the end of the string.
const EXPRESSION_PATTERN = /(?:f\s*\(\s*x\s*\)|y)\s*=\s*([^\n,;]{1,60}?)(?=[.,;]|$)/gi;

// A captured candidate can include trailing prose the regex's punctuation
// lookahead didn't catch (e.g. "2x + 3 juntos" before a comma-less "."]) —
// try it as-is, then progressively drop trailing words until one parses.
function shrinkToValidExpression(candidate: string): string | null {
  const words = candidate.split(/\s+/);
  for (let end = words.length; end >= 1; end--) {
    const attempt = words.slice(0, end).join(" ").trim();
    if (!attempt) continue;
    try {
      compileExpression(attempt);
      return attempt;
    } catch {
      continue;
    }
  }
  return null;
}

/** Scans an assistant reply for a plottable "y = ..." / "f(x) = ..." style
 * expression, validating candidates against the same parser the graphing
 * calculator uses. Picks the last valid match (closest to the point the
 * student is currently reading) and falls back to a sane default so the
 * calculator always has something to show when toggled open. */
export function extractPlottableExpression(text: string): string {
  const matches = [...text.matchAll(EXPRESSION_PATTERN)];
  for (let i = matches.length - 1; i >= 0; i--) {
    const candidate = matches[i][1].trim();
    if (!candidate) continue;
    const valid = shrinkToValidExpression(candidate);
    if (valid) return valid;
  }
  return DEFAULT_EXPRESSION;
}
