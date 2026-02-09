/**
 * ============================================
 * ARTIVIO — NOTIFICATIONS MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';
import { EventsService } from './events.service';
import { TelegramService } from './telegram.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    EventsService,
    TelegramService,
    PrismaService,
  ],
  exports: [EventsService],
})
export class NotificationsModule {}