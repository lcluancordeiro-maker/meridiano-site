import type { TutorContext } from "@/lib/tutor/systemPrompt";

export const ASK_GAUSS_EVENT = "gauss:ask";

/** Opens the global Gauss tutor bubble (see TutorChat.tsx) with a starter
 * prompt already typed in, so a "Ask Gauss about this" button anywhere in
 * the app can hand off straight into a conversation. */
export function askGauss(prompt: string) {
  window.dispatchEvent(new CustomEvent<string>(ASK_GAUSS_EVENT, { detail: prompt }));
}

export const GAUSS_CONTEXT_EVENT = "gauss:context";

/** Tells the global Gauss tutor bubble (rendered once in the root layout,
 * with no way to know which page it's on) which level/topic the student is
 * currently studying, so its replies can be scoped without asking. Fired by
 * <SetTutorContext> on a topic page; a `context: undefined` call (e.g. on
 * unmount) clears it back to "unknown" rather than leaving stale state from
 * a page the student has since left. */
export function setTutorContext(context: TutorContext | undefined) {
  window.dispatchEvent(new CustomEvent<TutorContext | undefined>(GAUSS_CONTEXT_EVENT, { detail: context }));
}
