/**
 * ============================================
 * ARTIVIO — TELEGRAM MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramNotificationAdapter } from './telegram.notification.adapter';
import { TelegramController } from './telegram.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramService,
    TelegramNotificationAdapter,
    PrismaService,
  ],
  exports: [TelegramNotificationAdapter],
})
export class TelegramModule {}