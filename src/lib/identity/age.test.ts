import { describe, expect, it } from "vitest";
import { calculateAge, isMinor } from "./age";

describe("calculateAge", () => {
  it("counts a birthday that already happened this year", () => {
    expect(calculateAge("2000-01-15", new Date("2024-06-01"))).toBe(24);
  });

  it("does not count a birthday that hasn't happened yet this year", () => {
    expect(calculateAge("2000-12-15", new Date("2024-06-01"))).toBe(23);
  });

  it("counts the birthday itself as already turned", () => {
    expect(calculateAge("2000-06-01", new Date("2024-06-01"))).toBe(24);
  });

  it("handles the day before a birthday", () => {
    expect(calculateAge("2000-06-01", new Date("2024-05-31"))).toBe(23);
  });
});

describe("isMinor", () => {
  it("is true when age is below the threshold", () => {
    expect(isMinor(17, 18)).toBe(true);
  });

  it("is false when age equals the threshold", () => {
    expect(isMinor(18, 18)).toBe(false);
  });

  it("is false when age is above the threshold", () => {
    expect(isMinor(25, 18)).toBe(false);
  });
});
