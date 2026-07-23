import "server-only";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

/** True once a transactional email provider is configured. When false,
 * sendEmail() is a no-op (returns false) — used today for the parental
 * consent link, so without this configured a minor's verification simply
 * stays pending until an admin follows up some other way. */
export const isEmailConfigured = Boolean(RESEND_API_KEY && RESEND_FROM_EMAIL);

/** Sends a transactional email via the Resend HTTP API (no SDK dependency —
 * this app only sends a couple of plain-HTML emails, so a single fetch call
 * is simpler than adding a package). Returns whether the send succeeded. */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!isEmailConfigured) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
  });

  return response.ok;
}
