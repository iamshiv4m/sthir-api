import { Controller, Get, Post, Body } from '@nestjs/common';
import { IntakeService } from './intake.service';

@Controller('intake')
export class IntakeController {
  constructor(private readonly intake: IntakeService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.intake.create(body);
  }

  @Get('stats')
  stats() {
    return this.intake.stats();
  }

  @Get()
  count() {
    return this.intake.count();
  }
}
