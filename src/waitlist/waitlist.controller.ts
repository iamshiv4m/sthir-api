import { Controller, Get, Post, Body } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlist: WaitlistService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.waitlist.create(body);
  }

  @Get()
  stats() {
    return this.waitlist.stats();
  }
}
