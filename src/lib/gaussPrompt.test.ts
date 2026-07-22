import { describe, expect, it } from "vitest";
import { ASK_GAUSS_EVENT, GAUSS_CONTEXT_EVENT, askGauss, setTutorContext } from "./gaussPrompt";

describe("askGauss", () => {
  it("dispatches ASK_GAUSS_EVENT with the prompt as detail", () => {
    let received: string | undefined;
    const listener = (event: Event) => {
      received = (event as CustomEvent<string>).detail;
    };
    window.addEventListener(ASK_GAUSS_EVENT, listener);
    askGauss("explain slope again");
    window.removeEventListener(ASK_GAUSS_EVENT, listener);

    expect(received).toBe("explain slope again");
  });
});

describe("setTutorContext", () => {
  it("dispatches GAUSS_CONTEXT_EVENT with the level/topic as detail", () => {
    let received: unknown;
    const listener = (event: Event) => {
      received = (event as CustomEvent).detail;
    };
    window.addEventListener(GAUSS_CONTEXT_EVENT, listener);
    setTutorContext({ levelName: "Ensino Médio", topicTitle: "Função Quadrática" });
    window.removeEventListener(GAUSS_CONTEXT_EVENT, listener);

    expect(received).toEqual({ levelName: "Ensino Médio", topicTitle: "Função Quadrática" });
  });

  it("dispatches a nullish detail to clear the context (CustomEvent normalizes undefined to null)", () => {
    let received: unknown = "not yet cleared";
    const listener = (event: Event) => {
      received = (event as CustomEvent).detail;
    };
    window.addEventListener(GAUSS_CONTEXT_EVENT, listener);
    setTutorContext(undefined);
    window.removeEventListener(GAUSS_CONTEXT_EVENT, listener);

    expect(received).toBeNull();
  });
});
