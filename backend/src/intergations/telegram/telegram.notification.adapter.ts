/**
 * ============================================
 * ARTIVIO — TELEGRAM NOTIFICATION ADAPTER
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramService } from './telegram.service';
import {
  NotificationType,
} from '../../notifications/notifications.service';

@Injectable()
export class TelegramNotificationAdapter {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async notify(params: {
    companyId: string;
    type: NotificationType;
    title: string;
    message: string;
  }) {
    const config =
      await this.prisma.telegramIntegration.findFirst({
        where: {
          companyId: params.companyId,
          isActive: true,
        },
      });

    if (!config) return;

    await this.telegram.sendMessage({
      chatId: config.chatId,
      text: `*${params.title}*\n\n${params.message}`,
    });
  }
}