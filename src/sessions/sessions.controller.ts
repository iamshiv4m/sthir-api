import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Post()
  log(@Body() body: unknown) {
    return this.sessions.log(body as Parameters<SessionsService['log']>[0]);
  }

  @Get()
  list(@Query('email') email: string) {
    return this.sessions.list(email);
  }
}
