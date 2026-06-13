import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async list() {
    const db = await this.db.readDb();
    return { partners: db.gymPartners };
  }
}
