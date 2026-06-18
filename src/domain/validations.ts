import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  goal: z.string(),
  city: z.string().optional(),
  referralCode: z.string().optional(),
  payDeposit: z.boolean().optional(),
});

export const intakeSchema = z.object({
  goal: z.string(),
  secondaryGoal: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z
    .string()
    .min(10, 'WhatsApp number is required')
    .max(15)
    .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number'),
  age: z.coerce.number().min(14).max(70),
  gender: z.string(),
  heightCm: z.coerce.number().min(120).max(230),
  bodyweightKg: z.coerce.number().min(40).max(200),
  weightClass: z.string().optional(),
  experience: z.string(),
  federation: z.string(),
  squat1rm: z.coerce.number().min(20),
  bench1rm: z.coerce.number().min(20),
  deadlift1rm: z.coerce.number().min(20),
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
  sleepQuality: z.coerce.number().min(1).max(5),
  recoveryNotes: z.string().optional(),
  disclaimerAccepted: z.literal(true),
  referralCode: z.string().optional(),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
