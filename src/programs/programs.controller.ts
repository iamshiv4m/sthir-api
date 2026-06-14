import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AdminGuard } from '../common/guards/admin.guard';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programs: ProgramsService) {}

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.programs.getProgram(id);
  }

  @Get(':id/csv')
  @UseGuards(AdminGuard)
  async csv(@Param('id') id: string, @Res() res: Response) {
    await this.programs.downloadCsv(id, res);
  }
}
