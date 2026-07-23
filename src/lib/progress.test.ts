import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetProgressForTests,
  getAllProgressSnapshot,
  getMostRecentTopic,
  getTopicProgressSnapshot,
  saveTopicProgress,
} from "./progress";

beforeEach(() => {
  window.localStorage.clear();
  __resetProgressForTests();
});

describe("saveTopicProgress / getTopicProgressSnapshot", () => {
  it("returns undefined before anything is saved", () => {
    expect(getTopicProgressSnapshot("fundamental-2", "fracoes", "medio")).toBeUndefined();
  });

  it("round-trips a saved score", () => {
    saveTopicProgress("fundamental-2", "fracoes", "medio", 5, 6);
    const p = getTopicProgressSnapshot("fundamental-2", "fracoes", "medio");
    expect(p).toMatchObject({ completed: true, score: 5, total: 6 });
  });

  it("keeps each difficulty tier of the same topic independent", () => {
    saveTopicProgress("fundamental-2", "fracoes", "facil", 6, 6);
    saveTopicProgress("fundamental-2", "fracoes", "dificil", 2, 6);
    expect(getTopicProgressSnapshot("fundamental-2", "fracoes", "facil")?.score).toBe(6);
    expect(getTopicProgressSnapshot("fundamental-2", "fracoes", "dificil")?.score).toBe(2);
  });

  it("persists across a simulated reload (cache reset + reread from localStorage)", () => {
    saveTopicProgress("fundamental-2", "numeros-inteiros", "olimpiada", 6, 6);
    __resetProgressForTests();
    expect(getTopicProgressSnapshot("fundamental-2", "numeros-inteiros", "olimpiada")?.score).toBe(6);
  });

  it("returns a new object reference on every write, for useSyncExternalStore", () => {
    const before = getAllProgressSnapshot();
    saveTopicProgress("fundamental-2", "fracoes", "medio", 5, 6);
    const after = getAllProgressSnapshot();
    expect(after).not.toBe(before);
  });
});

describe("getMostRecentTopic", () => {
  it("returns undefined for a visitor with no progress", () => {
    expect(getMostRecentTopic()).toBeUndefined();
  });

  it("returns the only topic touched so far", () => {
    saveTopicProgress("fundamental-2", "fracoes", "medio", 5, 6);
    expect(getMostRecentTopic()).toMatchObject({ levelId: "fundamental-2", topicId: "fracoes" });
  });

  it("returns the most recently updated topic across levels, not just the last save", () => {
    saveTopicProgress("fundamental-2", "fracoes", "medio", 5, 6);
    saveTopicProgress("medio", "funcao-primeiro-grau", "facil", 6, 6);
    expect(getMostRecentTopic()).toMatchObject({ levelId: "medio", topicId: "funcao-primeiro-grau" });
  });

  it("keeps returning the most recent topic even after an older tier of the same topic is saved again", () => {
    saveTopicProgress("medio", "funcao-primeiro-grau", "facil", 6, 6);
    saveTopicProgress("fundamental-2", "fracoes", "medio", 5, 6);
    // Re-saving an easier tier of the topic touched first must not make it "most recent".
    expect(getMostRecentTopic()).toMatchObject({ levelId: "fundamental-2", topicId: "fracoes" });
  });
});
