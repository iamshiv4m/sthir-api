import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { IntakeModule } from './intake/intake.module';
import { ProgramsModule } from './programs/programs.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SessionsModule } from './sessions/sessions.module';
import { PartnersModule } from './partners/partners.module';
import { HealthModule } from './health/health.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    WaitlistModule,
    IntakeModule,
    ProgramsModule,
    WebhooksModule,
    SessionsModule,
    PartnersModule,
    HealthModule,
    EventsModule,
  ],
})
export class AppModule {}
