import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true});

  const configService = app.get(ConfigService);
  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000';
  const corsOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
