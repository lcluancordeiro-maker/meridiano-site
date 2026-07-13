export type PixPaymentSchedule = "weekly" | "monthly" | "quarterly" | "halfyearly" | "yearly";

/** Maps a Stripe Price's billing interval to the payment_schedule values
 * accepted by Pix Automático mandates (Stripe.Checkout.SessionCreateParams
 * .PaymentMethodOptions.Pix.MandateOptions.PaymentSchedule). Falls back to
 * "monthly" for interval/interval_count combinations Pix doesn't have a
 * matching cadence for (e.g. daily billing). */
export function mapIntervalToPixSchedule(interval: string, intervalCount: number): PixPaymentSchedule {
  if (interval === "week") return "weekly";
  if (interval === "year") return "yearly";
  if (interval === "month") {
    if (intervalCount === 3) return "quarterly";
    if (intervalCount === 6) return "halfyearly";
    return "monthly";
  }
  return "monthly";
}
