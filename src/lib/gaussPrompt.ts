export const ASK_GAUSS_EVENT = "gauss:ask";

/** Opens the global Gauss tutor bubble (see TutorChat.tsx) with a starter
 * prompt already typed in, so a "Ask Gauss about this" button anywhere in
 * the app can hand off straight into a conversation. */
export function askGauss(prompt: string) {
  window.dispatchEvent(new CustomEvent<string>(ASK_GAUSS_EVENT, { detail: prompt }));
}
