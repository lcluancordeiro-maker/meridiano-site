/** Matches the first email-looking token on a line — permissive by design
 * so it works whether the pasted content is a bare list of addresses or a
 * full CSV export (Google Classroom/Clever both put the student's email in
 * its own column alongside name/ID columns we don't care about). */
const EMAIL_REGEX = /[^\s,;<>"]+@[^\s,;<>"]+\.[^\s,;<>"]+/;

export type RosterParseResult = {
  emails: string[];
  skippedLines: number;
};

/** Pure: extracts unique, lowercased emails from a pasted roster export
 * (Google Classroom/Clever CSV, or just a line-per-student list) — one
 * header row or blank line becomes one skipped line, not an error, since
 * real exports always have a header. */
export function parseRosterEmails(text: string): RosterParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const seen = new Set<string>();
  const emails: string[] = [];
  let skippedLines = 0;

  for (const line of lines) {
    const match = line.match(EMAIL_REGEX);
    if (!match) {
      skippedLines++;
      continue;
    }
    const email = match[0].toLowerCase();
    if (!seen.has(email)) {
      seen.add(email);
      emails.push(email);
    }
  }

  return { emails, skippedLines };
}
