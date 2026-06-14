import type { GoalId } from "./constants";

export type IntakeStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "pending_review"
  | "approved"
  | "delivered"
  | "rejected"
  | "refunded";

export type WaitlistEntry = {
  id: string;
  email: string;
  name: string;
  goal: GoalId;
  city?: string;
  depositPaid: boolean;
  depositAmountPaise: number;
  referralCode?: string;
  createdAt: string;
};

export type IntakeAnswers = {
  goal: GoalId;
  secondaryGoal?: GoalId;
  email: string;
  name: string;
  phone?: string;
  age: number;
  gender: string;
  heightCm: number;
  bodyweightKg: number;
  weightClass?: string;
  experience: string;
  federation: string;
  squat1rm: number;
  bench1rm: number;
  deadlift1rm: number;
  meetPrs?: { squat?: number; bench?: number; deadlift?: number };
  trainingDays: number;
  trainingStyle: string;
  meetDate?: string;
  gymType: string;
  equipment: Record<string, boolean>;
  injuries: string[];
  injuryNotes?: string;
  sleepQuality: number;
  recoveryNotes?: string;
  disclaimerAccepted: boolean;
  referralCode?: string;
};

export type ProgramBlock = {
  week: number;
  day: number;
  exercise: string;
  sets: number;
  reps: string;
  load: string;
  rpe?: string;
  notes?: string;
};

export type GeneratedProgram = {
  id: string;
  intakeId: string;
  templateId: string;
  templateName: string;
  coachNotes: string;
  blocks: ProgramBlock[];
  sheetUrl?: string;
  pdfPath?: string;
  csvExport?: string;
  version: number;
  reviewerId?: string;
  reviewedAt?: string;
  deliveredAt?: string;
  createdAt: string;
};

export type IntakeSubmission = {
  id: string;
  answers: IntakeAnswers;
  status: IntakeStatus;
  paymentId?: string;
  orderId?: string;
  amountPaise: number;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSet = {
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  rir?: number;
};

export type WorkoutSession = {
  id: string;
  intakeId?: string;
  email: string;
  week: number;
  day: number;
  exercise: string;
  sets: WorkoutSet[];
  completedAt: string;
};

export type PersonalRecord = {
  id: string;
  email: string;
  exercise: string;
  weight: number;
  reps: number;
  e1rm: number;
  achievedAt: string;
};

export type GymPartner = {
  id: string;
  name: string;
  city: string;
  contactName: string;
  contactEmail: string;
  referralCode: string;
  status: "prospect" | "signed" | "active";
  referrals: number;
  notes?: string;
};

export type ConciergeDelivery = {
  id: string;
  athleteName: string;
  email: string;
  goal: GoalId;
  deliveredAt: string;
  week4CheckIn?: boolean;
  npsScore?: number;
  notes?: string;
};

export type Database = {
  waitlist: WaitlistEntry[];
  intakes: IntakeSubmission[];
  programs: GeneratedProgram[];
  sessions: WorkoutSession[];
  prs: PersonalRecord[];
  gymPartners: GymPartner[];
  concierge: ConciergeDelivery[];
  auditLogs: Array<{
    id: string;
    entity: string;
    entityId: string;
    action: string;
    actorId: string;
    timestamp: string;
    diff?: Record<string, unknown>;
  }>;
};
