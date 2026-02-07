/**
 * ============================================
 * ARTIVIO — MAIN ENTRY
 * File: main.ts
 * ============================================
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * --------------------------------------------------
   * GLOBAL SETTINGS
   * --------------------------------------------------
   */

  // Валидация входящих данных
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * --------------------------------------------------
   * CORS
   * --------------------------------------------------
   * Разрешаем:
   * - основной сайт
   * - dev-сайт
   * - админку
   */
  app.enableCors({
    origin: [
      'https://artivio.ru',
      'https://dev.artivio.ru',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  /**
   * --------------------------------------------------
   * PORT
   * --------------------------------------------------
   */
  const port = process.env.PORT || 4000;

  await app.listen(port);

  console.log(`🚀 Artivio backend запущен на порту ${port}`);
}

bootstrap();