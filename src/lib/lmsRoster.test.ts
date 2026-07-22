import { describe, expect, it } from "vitest";
import { parseRosterEmails } from "./lmsRoster";

describe("parseRosterEmails", () => {
  it("extracts emails from a bare list", () => {
    const result = parseRosterEmails("maria@escola.edu\njoao@escola.edu");
    expect(result.emails).toEqual(["maria@escola.edu", "joao@escola.edu"]);
    expect(result.skippedLines).toBe(0);
  });

  it("extracts emails from a Google Classroom-style CSV, skipping the header", () => {
    const csv = [
      "Last Name,First Name,Email Address",
      "Silva,Maria,maria.silva@escola.edu",
      "Souza,João,joao.souza@escola.edu",
    ].join("\n");
    const result = parseRosterEmails(csv);
    expect(result.emails).toEqual(["maria.silva@escola.edu", "joao.souza@escola.edu"]);
    expect(result.skippedLines).toBe(1);
  });

  it("lowercases and deduplicates emails", () => {
    const result = parseRosterEmails("Maria@Escola.edu\nmaria@escola.edu");
    expect(result.emails).toEqual(["maria@escola.edu"]);
  });

  it("ignores blank lines without counting them as skipped", () => {
    const result = parseRosterEmails("maria@escola.edu\n\n\njoao@escola.edu");
    expect(result.emails).toHaveLength(2);
    expect(result.skippedLines).toBe(0);
  });

  it("counts lines with no email as skipped", () => {
    const result = parseRosterEmails("header only\nmaria@escola.edu\nnotes: absent today");
    expect(result.emails).toEqual(["maria@escola.edu"]);
    expect(result.skippedLines).toBe(2);
  });

  it("returns no emails for empty input", () => {
    expect(parseRosterEmails("")).toEqual({ emails: [], skippedLines: 0 });
  });
});
