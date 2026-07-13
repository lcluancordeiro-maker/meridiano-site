import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetProgressForTests,
  getAllProgressSnapshot,
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
