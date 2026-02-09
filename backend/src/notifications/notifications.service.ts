/**
 * ============================================
 * ARTIVIO — NOTIFICATION SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationPayload } from './notification.types';
import { TelegramService } from './telegram.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async dispatch(payload: NotificationPayload) {
    // 1️⃣ сохраняем в БД
    await this.prisma.notification.create({
      data: {
        companyId: payload.companyId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        metadata: payload.metadata,
      },
    });

    // 2️⃣ отправляем в Telegram (если подключён)
    await this.telegramService.sendIfEnabled(payload.companyId, payload);

    return true;
  }
}