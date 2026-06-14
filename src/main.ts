import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { buildCorsOptions } from './common/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.enableCors(buildCorsOptions(config));

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  console.log(`Sthir API listening on http://localhost:${port}/api/v1`);
}

void bootstrap();
