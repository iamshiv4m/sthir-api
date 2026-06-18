import { z } from 'zod';

const draftAnswersSchema = z
  .object({
    goal: z.string().optional(),
    email: z.string().trim().optional(),
    name: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    age: z.coerce.number().optional(),
    gender: z.string().optional(),
    heightCm: z.coerce.number().optional(),
    bodyweightKg: z.coerce.number().optional(),
    weightClass: z.string().optional(),
    experience: z.string().optional(),
    federation: z.string().optional(),
    squat1rm: z.coerce.number().optional(),
    bench1rm: z.coerce.number().optional(),
    deadlift1rm: z.coerce.number().optional(),
    trainingDays: z.coerce.number().optional(),
    trainingStyle: z.string().optional(),
    meetDate: z.string().optional(),
    gymType: z.string().optional(),
    equipment: z.record(z.string(), z.boolean()).optional(),
    injuries: z.array(z.string()).optional(),
    injuryNotes: z.string().optional(),
    sleepQuality: z.coerce.number().optional(),
    recoveryNotes: z.string().optional(),
    referralCode: z.string().optional(),
  })
  .passthrough();

export const intakeDraftSchema = z
  .object({
    sessionId: z.string().uuid(),
    stepReached: z.number().int().min(0).max(5),
    stepName: z.string().min(1).max(40),
    answers: draftAnswersSchema,
    utm: z
      .object({
        utm_source: z.string().optional(),
        utm_medium: z.string().optional(),
        utm_campaign: z.string().optional(),
        ref: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      const { email, name, phone } = data.answers;
      const digits = (phone ?? '').replace(/\D/g, '');
      return (
        (email?.includes('@') ?? false) ||
        digits.length >= 10 ||
        (name?.trim().length ?? 0) >= 2
      );
    },
    { message: 'Need at least a name, email, or phone to save progress' },
  );
