/** A generic linear undo/redo history — present state plus two stacks.
 * Used for the objects layer (shapes/text/images), which is plain JSON
 * (unlike ink, which keeps its own ImageData-based undo in DrawingCanvas).
 * `commit` is how every user edit (add/move/resize/delete) enters history;
 * `undo`/`redo` just walk the stacks without touching `commit`'s trimming. */
export type BoardHistory<T> = { past: T[]; present: T; future: T[] };

const MAX_HISTORY = 50;

export function createHistory<T>(initial: T): BoardHistory<T> {
  return { past: [], present: initial, future: [] };
}

/** Records a new present state, pushing the old one onto `past` and
 * clearing `future` — the standard "any new edit invalidates redo"
 * behavior of every undo/redo editor. */
export function commit<T>(history: BoardHistory<T>, next: T): BoardHistory<T> {
  const past = [...history.past, history.present];
  if (past.length > MAX_HISTORY) past.shift();
  return { past, present: next, future: [] };
}

export function undo<T>(history: BoardHistory<T>): BoardHistory<T> {
  if (history.past.length === 0) return history;
  const present = history.past[history.past.length - 1];
  return { past: history.past.slice(0, -1), present, future: [history.present, ...history.future] };
}

export function redo<T>(history: BoardHistory<T>): BoardHistory<T> {
  if (history.future.length === 0) return history;
  const [present, ...future] = history.future;
  return { past: [...history.past, history.present], present, future };
}
