import { beforeEach, describe, expect, it } from "vitest";
import { isFirstOccurrence } from "./firstTimeGate";

describe("isFirstOccurrence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("is true the first time an event name is checked", () => {
    expect(isFirstOccurrence("exercicio_concluido")).toBe(true);
  });

  it("is false on every later call for the same event name", () => {
    expect(isFirstOccurrence("exercicio_concluido")).toBe(true);
    expect(isFirstOccurrence("exercicio_concluido")).toBe(false);
    expect(isFirstOccurrence("exercicio_concluido")).toBe(false);
  });

  it("tracks each event name independently", () => {
    expect(isFirstOccurrence("exercicio_concluido")).toBe(true);
    expect(isFirstOccurrence("gauss_mensagem")).toBe(true);
    expect(isFirstOccurrence("exercicio_concluido")).toBe(false);
    expect(isFirstOccurrence("gauss_mensagem")).toBe(false);
  });
});
