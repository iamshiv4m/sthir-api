import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  track(@Body() body: unknown) {
    return this.events.track(body);
  }
}
