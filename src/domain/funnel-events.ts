export const FUNNEL_EVENTS = [
  'page_view',
  'intake_started',
  'intake_step_viewed',
  'intake_step_completed',
  'intake_validation_failed',
  'intake_submitted',
  'intake_submit_failed',
  'waitlist_started',
  'waitlist_validation_failed',
  'waitlist_submitted',
  'waitlist_submit_failed',
  'cta_clicked',
] as const;

export type FunnelEventName = (typeof FUNNEL_EVENTS)[number];

export const INTAKE_STEP_NAMES = [
  'Goal',
  'Profile',
  'Lifts',
  'Training',
  'Health',
  'Review',
] as const;
