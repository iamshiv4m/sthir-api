import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  name: z.string().trim().min(2, 'Name is required'),
  goal: z.string().min(1, 'Goal is required'),
  city: z.string().trim().optional(),
  referralCode: z.string().trim().optional(),
  payDeposit: z.boolean().optional(),
});

export const intakeSchema = z.object({
  goal: z.string().min(1),
  secondaryGoal: z.string().optional(),
  email: z.string().trim().email('Enter a valid email address'),
  name: z.string().trim().min(2, 'Full name is required'),
  phone: z
    .string()
    .trim()
    .min(10, 'WhatsApp number is required')
    .max(15)
    .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number')
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
        if (digits.length === 12 && digits.startsWith('91')) {
          return /^91[6-9]\d{9}$/.test(digits);
        }
        return false;
      },
      { message: 'Enter a valid 10-digit Indian mobile number' },
    ),
  age: z.coerce.number().min(16).max(70),
  gender: z.string(),
  heightCm: z.coerce.number().min(120).max(230),
  bodyweightKg: z.coerce.number().min(40).max(200),
  weightClass: z.string().optional(),
  experience: z.string(),
  federation: z.string(),
  squat1rm: z.coerce.number().min(20).max(500),
  bench1rm: z.coerce.number().min(20).max(350),
  deadlift1rm: z.coerce.number().min(20).max(500),
  meetPrs: z
    .object({
      squat: z.coerce.number().optional(),
      bench: z.coerce.number().optional(),
      deadlift: z.coerce.number().optional(),
    })
    .optional(),
  trainingDays: z.coerce.number().min(2).max(6),
  trainingStyle: z.string(),
  meetDate: z.string().optional(),
  gymType: z.string(),
  equipment: z.record(z.string(), z.boolean()).default({}),
  injuries: z.array(z.string()).default([]),
  injuryNotes: z.string().optional(),
  cycleNotes: z.string().optional(),
  sleepQuality: z.coerce.number().min(1).max(5),
  recoveryNotes: z.string().optional(),
  proteinIntakeG: z.coerce.number().min(0).max(500).optional(),
  disclaimerAccepted: z.literal(true),
  referralCode: z.string().optional(),
  videoSquat: z.string().url().optional(),
  videoBench: z.string().url().optional(),
  videoDeadlift: z.string().url().optional(),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
