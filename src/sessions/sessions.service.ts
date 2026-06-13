import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

function e1rm(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async log(body: {
    email?: string;
    week?: number;
    day?: number;
    exercise?: string;
    sets?: Array<{ setNumber: number; weight: number; reps: number; rpe?: number; rir?: number }>;
  }) {
    const { email, week, day, exercise, sets } = body;
    if (!email || !exercise || !sets?.length) {
      throw new BadRequestException('Invalid payload');
    }

    const sessionId = this.db.newId();

    await this.db.updateDb((db) => {
      db.sessions.push({
        id: sessionId,
        email,
        week: week ?? 1,
        day: day ?? 1,
        exercise,
        sets,
        completedAt: new Date().toISOString(),
      });

      const topSet = sets.reduce((best, s) =>
        e1rm(s.weight, s.reps) > e1rm(best.weight, best.reps) ? s : best,
      );

      const estimated = e1rm(topSet.weight, topSet.reps);
      const existingPr = db.prs.find((p) => p.email === email && p.exercise === exercise);

      if (!existingPr || estimated > existingPr.e1rm) {
        if (existingPr) {
          existingPr.weight = topSet.weight;
          existingPr.reps = topSet.reps;
          existingPr.e1rm = estimated;
          existingPr.achievedAt = new Date().toISOString();
        } else {
          db.prs.push({
            id: this.db.newId(),
            email,
            exercise,
            weight: topSet.weight,
            reps: topSet.reps,
            e1rm: estimated,
            achievedAt: new Date().toISOString(),
          });
        }
      }
    });

    await this.db.auditLog('session', sessionId, 'logged', email);
    return { id: sessionId, ok: true };
  }

  async list(email: string) {
    if (!email) throw new BadRequestException('email required');
    const db = await this.db.readDb();
    return {
      sessions: db.sessions.filter((s) => s.email === email),
      prs: db.prs.filter((p) => p.email === email),
    };
  }
}
