import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addHours } from 'date-fns';
import { DatabaseService } from '../database/database.service';
import { SLA_HOURS } from '../domain/constants';
import type { GoalId } from '../domain/constants';
import { getPriceForGoal } from '../domain/pricing';
import { createOrder } from '../domain/razorpay';
import {
  selectTemplate,
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

    const answers = parsed.data as IntakeAnswers;
    const warnings = validateLiftRatios(answers);
    const id = this.db.newId();
    const amountPaise = getPriceForGoal(answers.goal as GoalId);
    const order = await createOrder(amountPaise, `intake_${id.slice(0, 8)}`, {
      email: answers.email,
      goal: answers.goal,
    });

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
        const template = selectTemplate(answers);
        const blocks = generateProgramBlocks(template, answers);
        db.programs.push({
          id: this.db.newId(),
          intakeId: id,
          templateId: template.id,
          templateName: template.name,
          coachNotes: generateCoachNotes(template, answers),
          blocks,
          version: 1,
          createdAt: new Date().toISOString(),
        });
        const intake = db.intakes.find((i) => i.id === id);
        if (intake) intake.status = 'pending_review';
      }
    });

    await this.db.auditLog('intake', id, 'created', answers.email, { warnings });

    return {
      id,
      orderId: order.orderId,
      amountPaise,
      mock: order.mock,
      warnings,
      razorpayKey: this.config.get<string>('RAZORPAY_KEY_ID') ?? null,
    };
  }

  async count() {
    const db = await this.db.readDb();
    return { count: db.intakes.length };
  }
}
