/** Whole years elapsed between a birth date and a reference date (defaults to
 * now) — accounts for whether the birthday has already happened this year,
 * not just the difference in calendar years. */
export function calculateAge(dateOfBirth: string | Date, asOf: Date = new Date()): number {
  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;

  let age = asOf.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = asOf.getUTCMonth() - dob.getUTCMonth();
  const hasHadBirthdayThisYear = monthDiff > 0 || (monthDiff === 0 && asOf.getUTCDate() >= dob.getUTCDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
}

export function isMinor(age: number, thresholdYears: number): boolean {
  return age < thresholdYears;
}
