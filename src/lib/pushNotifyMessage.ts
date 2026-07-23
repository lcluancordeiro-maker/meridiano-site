/** Fire-and-forget: asks /api/push/notify-message to push-notify the other
 * participants/members about a message that was just inserted. Errors and
 * "not configured" responses are silently ignored — this is a best-effort
 * side effect, never something the sender should wait on or see fail. */
export function notifyNewMessage(table: "dm_messages" | "community_messages", messageId: string) {
  fetch("/api/push/notify-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, messageId }),
  }).catch(() => {});
}
