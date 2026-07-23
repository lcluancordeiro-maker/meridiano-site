import { describe, expect, it } from "vitest";
import { commit, createHistory, redo, undo } from "./boardHistory";

describe("boardHistory", () => {
  it("starts with the initial state and empty stacks", () => {
    const h = createHistory([1]);
    expect(h).toEqual({ past: [], present: [1], future: [] });
  });

  it("commit pushes the old present onto past and clears future", () => {
    let h = createHistory([1]);
    h = commit(h, [1, 2]);
    expect(h).toEqual({ past: [[1]], present: [1, 2], future: [] });
  });

  it("undo restores the previous present and stashes the current one in future", () => {
    let h = createHistory([1]);
    h = commit(h, [1, 2]);
    h = undo(h);
    expect(h).toEqual({ past: [], present: [1], future: [[1, 2]] });
  });

  it("redo re-applies an undone commit", () => {
    let h = createHistory([1]);
    h = commit(h, [1, 2]);
    h = undo(h);
    h = redo(h);
    expect(h).toEqual({ past: [[1]], present: [1, 2], future: [] });
  });

  it("undo on an empty past is a no-op", () => {
    const h = createHistory([1]);
    expect(undo(h)).toEqual(h);
  });

  it("redo on an empty future is a no-op", () => {
    const h = createHistory([1]);
    expect(redo(h)).toEqual(h);
  });

  it("a new commit after an undo discards the redo branch", () => {
    let h = createHistory([1]);
    h = commit(h, [1, 2]);
    h = undo(h);
    h = commit(h, [1, 3]);
    expect(h).toEqual({ past: [[1]], present: [1, 3], future: [] });
  });
});
