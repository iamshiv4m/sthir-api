import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
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
import type { IntakeAnswers } from '../domain/types';

@Injectable()
export class IntakeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async create(body: unknown) {
    const parsed = intakeSchema.safeParse(body);
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
      spotsRemaining: foundingFree
        ? Math.max(0, FOUNDING_COHORT_SIZE - cohortCount)
        : null,
    };
  }

  async count() {
    const db = await this.db.readDb();
    return { count: db.intakes.length };
  }
}
