import { BadRequestException, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { DatabaseService } from '../database/database.service';
import {
  FUNNEL_EVENTS,
  INTAKE_STEP_NAMES,
  type FunnelEventName,
} from '../domain/funnel-events';

const trackSchema = z.object({
  event: z.enum(FUNNEL_EVENTS),
  sessionId: z.string().uuid(),
  path: z.string().max(200).optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      ref: z.string().optional(),
    })
    .optional(),
});

@Injectable()
export class EventsService {
  constructor(private readonly db: DatabaseService) {}

  async track(body: unknown) {
    const parsed = trackSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { event, sessionId, path, properties, utm } = parsed.data;

    await this.db.auditLog('funnel', sessionId, event, 'anonymous', {
      path,
      ...properties,
      ...utm,
    });

    return { ok: true };
  }

  async funnelSummary() {
    const db = await this.db.readDb();
    const funnel = db.auditLogs.filter((log) => log.entity === 'funnel');

    const sessions = new Map<string, FunnelEventName[]>();
    for (const log of funnel) {
      const list = sessions.get(log.entityId) ?? [];
      list.push(log.action as FunnelEventName);
      sessions.set(log.entityId, list);
    }

    const sessionList = [...sessions.values()];
    const countSessionsWith = (event: FunnelEventName) =>
      sessionList.filter((events) => events.includes(event)).length;

    const stepViewed = (step: number) =>
      funnel.filter(
        (log) =>
          log.action === 'intake_step_viewed' &&
          log.diff?.step === step,
      ).length;

    const stepCompleted = (step: number) =>
      funnel.filter(
        (log) =>
          log.action === 'intake_step_completed' &&
          log.diff?.step === step,
      ).length;

    const stepValidationFailed = (step: number) =>
      funnel.filter(
        (log) =>
          log.action === 'intake_validation_failed' &&
          log.diff?.step === step,
      ).length;

    const intakeStarted = countSessionsWith('intake_started');
    const intakeSubmitted = countSessionsWith('intake_submitted');

    return {
      totals: {
        intakeStarted,
        intakeSubmitted,
        intakeSubmitFailed: countSessionsWith('intake_submit_failed'),
        waitlistStarted: countSessionsWith('waitlist_started'),
        waitlistSubmitted: countSessionsWith('waitlist_submitted'),
        conversionRate:
          intakeStarted > 0
            ? Math.round((intakeSubmitted / intakeStarted) * 100)
            : null,
      },
      intakeSteps: INTAKE_STEP_NAMES.map((name, step) => ({
        step,
        name,
        viewed: stepViewed(step),
        completed: stepCompleted(step),
        validationFailed: stepValidationFailed(step),
      })),
      recent: funnel.slice(-15).reverse().map((log) => ({
        event: log.action,
        sessionId: log.entityId.slice(0, 8),
        path: log.diff?.path,
        step: log.diff?.step,
        goal: log.diff?.goal,
        at: log.timestamp,
      })),
    };
  }
}
