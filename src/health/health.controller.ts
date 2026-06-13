import { Controller, Get } from '@nestjs/common';
import { getDbBackend } from '../database';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      ok: true,
      service: 'sthir-api',
      db: getDbBackend(),
    };
  }
}
