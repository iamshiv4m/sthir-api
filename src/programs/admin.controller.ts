import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { ProgramsService } from './programs.service';
import { EventsService } from '../events/events.service';
import { IntakeService } from '../intake/intake.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly programs: ProgramsService,
    private readonly events: EventsService,
    private readonly intake: IntakeService,
  ) {}

  @Get('queue')
  queue() {
    return this.programs.getQueue();
  }

  @Get('funnel')
  funnel() {
    return this.events.funnelSummary();
  }

  @Get('leads')
  leads() {
    return this.intake.getAbandonedLeads();
  }

  @Post('programs/:id')
  review(
    @Param('id') id: string,
    @Body()
    body: {
      action: 'approve' | 'deliver' | 'reject';
      coachNotes?: string;
      reviewerId?: string;
    },
  ) {
    return this.programs.reviewProgram(id, body);
  }
}
