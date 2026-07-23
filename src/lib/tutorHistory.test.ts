import { describe, expect, it } from "vitest";
import { titleFromMessage } from "@/lib/tutorHistory";

describe("titleFromMessage", () => {
  it("returns the message as-is when short enough", () => {
    expect(titleFromMessage("Como resolvo 2x + 3 = 7?")).toBe("Como resolvo 2x + 3 = 7?");
  });

  it("trims surrounding whitespace and collapses internal newlines", () => {
    expect(titleFromMessage("  oi\n\n  tudo bem?  ")).toBe("oi tudo bem?");
  });

  it("truncates long messages with an ellipsis", () => {
    const long = "a".repeat(100);
    const title = titleFromMessage(long);
    expect(title.length).toBe(60);
    expect(title.endsWith("…")).toBe(true);
  });
});
