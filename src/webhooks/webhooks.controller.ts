import { Controller, Post, Req, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService } from '../database/database.service';
import { verifyWebhookSignature } from '../domain/razorpay';
import {
  selectTemplate,
  generateProgramBlocks,
  generateCoachNotes,
} from '../domain/program-engine';

@Controller('webhooks/razorpay')
export class WebhooksController {
  constructor(private readonly db: DatabaseService) {}

  @Post()
  async razorpay(@Req() req: RawBodyRequest<Request>) {
    const body = req.rawBody?.toString('utf-8') ?? '';
    const signature = (req.headers['x-razorpay-signature'] as string) ?? '';

    if (!verifyWebhookSignature(body, signature)) {
      throw new BadRequestException('Invalid signature');
    }

    const payload = JSON.parse(body) as {
      payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
    };
    const orderId = payload?.payload?.payment?.entity?.order_id;

    if (!orderId) {
      return { received: true };
    }

    await this.db.updateDb((db) => {
      const intake = db.intakes.find((i) => i.orderId === orderId);
      if (!intake || intake.status !== 'pending_payment') return;

      intake.status = 'pending_review';
      intake.paymentId = payload?.payload?.payment?.entity?.id;
      intake.updatedAt = new Date().toISOString();

      const existing = db.programs.find((p) => p.intakeId === intake.id);
      if (!existing) {
        const template = selectTemplate(intake.answers);
        db.programs.push({
          id: this.db.newId(),
          intakeId: intake.id,
          templateId: template.id,
          templateName: template.name,
          coachNotes: generateCoachNotes(template, intake.answers),
          blocks: generateProgramBlocks(template, intake.answers),
          version: 1,
          createdAt: new Date().toISOString(),
        });
      }
    });

    await this.db.auditLog('payment', orderId, 'webhook_paid', 'razorpay');
    return { received: true };
  }
}
