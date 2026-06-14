/** Founding cohort — free beta before public pricing. Set on Render alongside frontend flag. */
export const FOUNDING_COHORT_SIZE = 20;

/** Free founding offer is a single 4-week block only. */
export const FOUNDING_FREE_WEEKS = 4;

export function isFoundingFree(): boolean {
  return process.env.FOUNDING_FREE === 'true';
}

export function countCohortIntakes(
  intakes: { status: string }[],
): number {
  return intakes.filter((i) => i.status !== 'rejected').length;
}

export function isCohortFull(intakes: { status: string }[]): boolean {
  return isFoundingFree() && countCohortIntakes(intakes) >= FOUNDING_COHORT_SIZE;
}

/** True when this intake qualifies for a free founding slot (not paid ₹499). */
export function hasFreeFoundingSlot(intakes: { status: string }[]): boolean {
  return isFoundingFree() && !isCohortFull(intakes);
}
