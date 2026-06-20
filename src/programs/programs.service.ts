import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import path from 'path';
import { Response } from 'express';
import { DatabaseService } from '../database/database.service';
import { countCohortIntakes, isFoundingFree } from '../domain/founding';
import { exportProgramCsv } from '../domain/sheet-export';
import { generateProgramPdf } from '../domain/pdf';

@Injectable()
export class ProgramsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  private apiBase() {
    return (this.config.get<string>('API_PUBLIC_URL') ?? 'http://localhost:4000').replace(/\/$/, '');
  }

  async getProgram(id: string) {
    const db = await this.db.readDb();
    const program = db.programs.find((p) => p.id === id);
    if (!program) throw new NotFoundException('Not found');
    const intake = db.intakes.find((i) => i.id === program.intakeId);
    return { program, intake };
  }

  async downloadCsv(id: string, res: Response) {
    const db = await this.db.readDb();
    const program = db.programs.find((p) => p.id === id);
    if (!program) throw new NotFoundException('Not found');

    if (program.csvExport) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sthir_program.csv"',
      );
      res.send(program.csvExport);
      return;
    }

    const csvPath = path.join(
      process.cwd(),
      'data',
      'exports',
      `program_${program.intakeId.slice(0, 8)}.csv`,
    );

    try {
      const content = await fs.readFile(csvPath, 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="sthir_program.csv"',
      );
      res.send(content);
    } catch {
      throw new NotFoundException('Export not ready');
    }
  }

  private static readonly VALID_REVIEWERS = ['manthan', 'dharmesh', 'founder'];

  async reviewProgram(
    intakeId: string,
    body: {
      action: 'approve' | 'deliver' | 'reject';
      coachNotes?: string;
      reviewerId?: string;
    },
  ) {
    const { action, coachNotes, reviewerId = 'founder' } = body;
    if (!ProgramsService.VALID_REVIEWERS.includes(reviewerId)) {
      throw new BadRequestException('Invalid reviewerId');
    }
    const db = await this.db.readDb();
    const intake = db.intakes.find((i) => i.id === intakeId);
    if (!intake) throw new NotFoundException('Intake not found');

    const program = db.programs.find((p) => p.intakeId === intakeId);
    if (!program) throw new NotFoundException('Program not found');

    let result: Record<string, unknown> = {};

    if (action === 'approve') {
      if (!['paid', 'pending_review'].includes(intake.status)) {
        throw new BadRequestException(
          'Intake must be pending review before approval',
        );
      }
      if (!program.draftSummary && program.coachNotes) {
        program.draftSummary = program.coachNotes;
      }
      program.coachNotes = coachNotes ?? '';
      program.reviewerId = reviewerId;
      program.reviewedAt = new Date().toISOString();
      intake.status = 'approved';
      intake.updatedAt = new Date().toISOString();
      result = { status: 'approved' };
    }

    if (action === 'deliver') {
      if (intake.status !== 'approved') {
        throw new BadRequestException(
          'Intake must be approved before delivery',
        );
      }
      program.coachNotes = coachNotes ?? program.coachNotes;
      const { filepath, content } = await exportProgramCsv(
        program,
        intake.answers,
      );
      const pdfPath = await generateProgramPdf(program, intake.answers);
      program.csvExport = content;
      program.pdfPath = pdfPath;
      program.sheetUrl = `${this.apiBase()}/api/v1/programs/${program.id}/csv`;
      program.deliveredAt = new Date().toISOString();
      intake.status = 'delivered';
      intake.updatedAt = new Date().toISOString();
      result = {
        status: 'delivered',
        csvPath: filepath,
        pdfPath,
        sheetUrl: program.sheetUrl,
      };
    }

    if (action === 'reject') {
      if (['delivered', 'rejected', 'refunded'].includes(intake.status)) {
        throw new BadRequestException('Intake cannot be rejected in current status');
      }
      intake.status = 'rejected';
      intake.updatedAt = new Date().toISOString();
      result = { status: 'rejected' };
    }

    await this.db.writeDb(db);
    await this.db.auditLog('program', intakeId, action, reviewerId);
    return result;
  }

  async getQueue() {
    const db = await this.db.readDb();
    const now = Date.now();

    const queue = db.intakes
      .filter((i) => ['paid', 'pending_review', 'approved'].includes(i.status))
      .map((intake) => {
        const program = db.programs.find((p) => p.intakeId === intake.id);
        const slaMs = new Date(intake.slaDeadline).getTime() - now;
        const { videoSquat, videoBench, videoDeadlift } = intake.answers;
        return {
          ...intake,
          program,
          videos: {
            squat: videoSquat ?? null,
            bench: videoBench ?? null,
            deadlift: videoDeadlift ?? null,
          },
          slaHoursRemaining: Math.max(0, slaMs / (1000 * 60 * 60)),
          urgent: slaMs < 4 * 60 * 60 * 1000,
        };
      })
      .sort((a, b) => a.slaHoursRemaining - b.slaHoursRemaining);

    return {
      queue,
      stats: {
        pendingReview: queue.filter((q) => q.status === 'pending_review').length,
        delivered: db.intakes.filter((i) => i.status === 'delivered').length,
        waitlist: db.waitlist.length,
        cohortCount: isFoundingFree() ? countCohortIntakes(db.intakes) : null,
      },
    };
  }
}
