import { Module } from '@nestjs/common';
import { ProgramsController } from './programs.controller';
import { AdminController } from './admin.controller';
import { ProgramsService } from './programs.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  controllers: [ProgramsController, AdminController],
  providers: [ProgramsService, AdminGuard],
})
export class ProgramsModule {}
