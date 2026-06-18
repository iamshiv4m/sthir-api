import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import { DatabaseService } from '../database/database.service';
import { SLA_HOURS, PRICING } from '../domain/constants';
import type { GoalId } from '../domain/constants';
import {
  FOUNDING_COHORT_SIZE,
  FOUNDING_FREE_WEEKS,
  countCohortIntakes,
  hasFreeFoundingSlot,
  isCohortFull,
  isFoundingFree,
} from '../domain/founding';
import { getPriceForGoal } from '../domain/pricing';
import { createOrder, getRazorpay } from '../domain/razorpay';
import {
  selectTemplate,
  selectFoundingTemplate,
  generateProgramBlocks,
  generateCoachNotes,
  validateLiftRatios,
} from '../domain/program-engine';
import { intakeSchema } from '../domain/validations';
import { intakeDraftSchema } from '../domain/draft-validations';
import type { IntakeAnswers } from '../domain/types';

function normalizePhone(value?: string): string {
  return (value ?? '').replace(/\D/g, '');
}

function isSubmittedContact(
  db: Awaited<ReturnType<DatabaseService['readDb']>>,
  email?: string,
  phone?: string,
): boolean {
  const emailKey = email?.trim().toLowerCase();
  const phoneKey = normalizePhone(phone);
  return db.intakes.some((intake) => {
    if (emailKey && intake.answers.email.toLowerCase() === emailKey) return true;
    if (phoneKey && normalizePhone(intake.answers.phone) === phoneKey) return true;
    return false;
  });
}

@Injectable()
export class IntakeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async create(body: unknown) {
    const raw = (body ?? {}) as Record<string, unknown>;
    const sessionId =
      typeof raw.sessionId === 'string' ? raw.sessionId : undefined;
    const { sessionId: _drop, ...intakeBody } = raw;
    const parsed = intakeSchema.safeParse(intakeBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const db = await this.db.readDb();
    const answers = parsed.data as IntakeAnswers;
    const warnings = validateLiftRatios(answers);
    const id = this.db.newId();
    const freeSlot = hasFreeFoundingSlot(db.intakes);
    const amountPaise = freeSlot
      ? 0
      : isFoundingFree()
        ? PRICING.founding_program
        : getPriceForGoal(answers.goal as GoalId);
    const order = await this.resolveOrder(
      amountPaise,
      `intake_${id.slice(0, 8)}`,
      { email: answers.email, goal: answers.goal },
      freeSlot,
    );

    const slaDeadline = addHours(new Date(), SLA_HOURS).toISOString();

    await this.db.updateDb((db) => {
      db.intakes.push({
        id,
        answers,
        status: order.mock ? 'paid' : 'pending_payment',
        orderId: order.orderId,
        amountPaise,
        slaDeadline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (order.mock) {
        this.attachDraftProgram(db, id, answers, freeSlot);
        const intake = db.intakes.find((i) => i.id === id);
        if (intake) intake.status = 'pending_review';
      }

      this.removeMatchingDrafts(db, sessionId, answers.email, answers.phone);
    });

    await this.db.auditLog('intake', id, 'created', answers.email, {
      warnings,
      freeSlot,
      foundingFree: isFoundingFree(),
    });

    return {
      id,
      orderId: order.orderId,
      amountPaise,
      mock: order.mock,
      foundingFree: isFoundingFree(),
      freeSlot,
      freeWeeks: freeSlot ? FOUNDING_FREE_WEEKS : null,
      warnings,
      razorpayKey: this.config.get<string>('RAZORPAY_KEY_ID') ?? null,
    };
  }

  private async resolveOrder(
    amountPaise: number,
    receipt: string,
    notes: Record<string, string>,
    skipPayment: boolean,
  ) {
    if (skipPayment || !getRazorpay()) {
      return {
        orderId: skipPayment
          ? `founding_${randomUUID().slice(0, 8)}`
          : `mock_order_${randomUUID().slice(0, 8)}`,
        amount: amountPaise,
        currency: 'INR',
        mock: true,
      };
    }
    return createOrder(amountPaise, receipt, notes);
  }

  async saveDraft(body: unknown) {
    const parsed = intakeDraftSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { sessionId, stepReached, stepName, answers, utm } = parsed.data;
    const db = await this.db.readDb();

    if (
      isSubmittedContact(
        db,
        typeof answers.email === 'string' ? answers.email : undefined,
        typeof answers.phone === 'string' ? answers.phone : undefined,
      )
    ) {
      return { ok: true, skipped: true, reason: 'already_submitted' };
    }

    const now = new Date().toISOString();
    let draftId = this.db.newId();

    await this.db.updateDb((db) => {
      if (!db.intakeDrafts) db.intakeDrafts = [];
      const idx = db.intakeDrafts.findIndex((d) => d.sessionId === sessionId);
      if (idx >= 0) {
        draftId = db.intakeDrafts[idx].id;
        db.intakeDrafts[idx] = {
          ...db.intakeDrafts[idx],
          stepReached: Math.max(db.intakeDrafts[idx].stepReached, stepReached),
          stepName,
          answers: { ...db.intakeDrafts[idx].answers, ...answers },
          utm: utm ?? db.intakeDrafts[idx].utm,
          updatedAt: now,
        };
      } else {
        db.intakeDrafts.push({
          id: draftId,
          sessionId,
          stepReached,
          stepName,
          answers,
          utm,
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    await this.db.auditLog('intake_draft', draftId, 'saved', sessionId, {
      stepReached,
      stepName,
      hasPhone: !!answers.phone,
      hasEmail: !!answers.email,
    });

    return { ok: true, id: draftId };
  }

  async getAbandonedLeads() {
    const db = await this.db.readDb();
    const drafts = db.intakeDrafts ?? [];

    const leads = drafts
      .filter(
        (draft) =>
          !isSubmittedContact(
            db,
            typeof draft.answers.email === 'string'
              ? draft.answers.email
              : undefined,
            typeof draft.answers.phone === 'string'
              ? draft.answers.phone
              : undefined,
          ),
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .map((draft) => ({
        id: draft.id,
        name: String(draft.answers.name ?? '—'),
        email: String(draft.answers.email ?? '—'),
        phone: String(draft.answers.phone ?? '—'),
        goal: String(draft.answers.goal ?? '—'),
        stepReached: draft.stepReached,
        stepName: draft.stepName,
        updatedAt: draft.updatedAt,
        utm: draft.utm,
      }));

    return {
      count: leads.length,
      leads,
    };
  }

  private removeMatchingDrafts(
    db: Awaited<ReturnType<DatabaseService['readDb']>>,
    sessionId: string | undefined,
    email: string,
    phone?: string,
  ) {
    if (!db.intakeDrafts?.length) return;
    const emailKey = email.trim().toLowerCase();
    const phoneKey = normalizePhone(phone);
    db.intakeDrafts = db.intakeDrafts.filter((draft) => {
      if (sessionId && draft.sessionId === sessionId) return false;
      if (
        emailKey &&
        typeof draft.answers.email === 'string' &&
        draft.answers.email.trim().toLowerCase() === emailKey
      ) {
        return false;
      }
      if (
        phoneKey &&
        typeof draft.answers.phone === 'string' &&
        normalizePhone(draft.answers.phone) === phoneKey
      ) {
        return false;
      }
      return true;
    });
  }

  private attachDraftProgram(
    db: Awaited<ReturnType<DatabaseService['readDb']>>,
    intakeId: string,
    answers: IntakeAnswers,
    freeSlot: boolean,
  ) {
    const template = freeSlot
      ? selectFoundingTemplate(answers)
      : selectTemplate(answers);
    const blocks = generateProgramBlocks(template, answers);
    db.programs.push({
      id: this.db.newId(),
      intakeId,
      templateId: template.id,
      templateName: template.name,
      coachNotes: generateCoachNotes(template, answers),
      blocks,
      version: 1,
      createdAt: new Date().toISOString(),
    });
  }

  async stats() {
    const db = await this.db.readDb();
    const foundingFree = isFoundingFree();
    const cohortCount = countCohortIntakes(db.intakes);
    const cohortFull = isCohortFull(db.intakes);
    const delivered = db.intakes.filter((i) => i.status === 'delivered').length;

    return {
      foundingFree,
      cohortSize: FOUNDING_COHORT_SIZE,
      cohortCount,
      cohortFull,
      freeSlotAvailable: hasFreeFoundingSlot(db.intakes),
      freeWeeks: FOUNDING_FREE_WEEKS,
      foundingPricePaise: 49900,
      delivered,
      spotsRemaining: Math.max(0, FOUNDING_COHORT_SIZE - cohortCount),
    };
  }

  async count() {
    const db = await this.db.readDb();
    return { count: db.intakes.length };
  }
}
