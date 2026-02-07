/**
 * ============================================
 * ARTIVIO BACKEND — ENTRY POINT
 * File: main.ts
 * Stack: NestJS + Prisma + PostgreSQL
 * ============================================
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /**
   * --------------------------------------------
   * SECURITY
   * --------------------------------------------
   */
  app.use(helmet());
  app.use(cookieParser());

  /**
   * --------------------------------------------
   * CORS
   * --------------------------------------------
   * Dev: allow all
   * Prod: restrict by domains
   */
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://artivio.ru',
            'https://www.artivio.ru',
            'https://dev.artivio.ru',
          ]
        : true,
    credentials: true,
  });

  /**
   * --------------------------------------------
   * GLOBAL VALIDATION
   * --------------------------------------------
   * - whitelist: strips unknown fields
   * - forbidNonWhitelisted: protects API
   * - transform: auto DTO casting
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * --------------------------------------------
   * GLOBAL PREFIX
   * --------------------------------------------
   * All API routes start with /api
   */
  app.setGlobalPrefix('api');

  /**
   * --------------------------------------------
   * SERVER START
   * --------------------------------------------
   */
  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Artivio Backend running on port ${port}`);
}

bootstrap();