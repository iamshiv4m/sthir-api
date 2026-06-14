import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { PRICING } from '../domain/constants';
import { waitlistSchema } from '../domain/validations';
import { createOrder } from '../domain/razorpay';
import { FOUNDING_COHORT_SIZE } from '../domain/founding';

@Injectable()
export class WaitlistService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async create(body: unknown) {
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { email, name, goal, city, referralCode, payDeposit } = parsed.data;
    const db = await this.db.readDb();
    const existing = db.waitlist.find(
      (w) => w.email.toLowerCase() === email.toLowerCase(),
    );
    if (existing) {
      throw new ConflictException({ error: 'Already on waitlist', id: existing.id });
    }

    if (db.waitlist.length >= FOUNDING_COHORT_SIZE) {
      throw new ConflictException({
        error: 'Waitlist full',
        message: `All ${FOUNDING_COHORT_SIZE} waitlist spots are taken. Follow us on Instagram for the next cohort.`,
      });
    }

    const id = this.db.newId();
    let orderId: string | undefined;
    let mock = true;

    if (payDeposit) {
      const order = await createOrder(PRICING.waitlist_deposit, `waitlist_${id.slice(0, 8)}`, {
        type: 'waitlist_deposit',
        email,
      });
      orderId = order.orderId;
      mock = order.mock;
    }

    await this.db.updateDb((db) => {
      db.waitlist.push({
        id,
        email,
        name,
        goal: goal as never,
        city,
        referralCode,
        depositPaid: !payDeposit,
        depositAmountPaise: payDeposit ? PRICING.waitlist_deposit : 0,
        createdAt: new Date().toISOString(),
      });
    });

    await this.db.auditLog('waitlist', id, 'created', 'system');

    return {
      id,
      orderId,
      mock,
      message: payDeposit
        ? 'Complete ₹99 refundable deposit to secure founding lifter spot'
        : 'Added to waitlist',
    };
  }

  async stats() {
    const db = await this.db.readDb();
    const count = db.waitlist.length;
    return {
      count,
      target: FOUNDING_COHORT_SIZE,
      full: count >= FOUNDING_COHORT_SIZE,
      depositsPaid: db.waitlist.filter((w) => w.depositPaid).length,
    };
  }
}
