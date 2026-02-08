/**
 * ============================================
 * ARTIVIO — NOTIFICATIONS SERVICE
 * File: notifications.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum NotificationType {
  LOW_STOCK = 'LOW_STOCK',
  ORDER_ERROR = 'ORDER_ERROR',
  SYSTEM = 'SYSTEM',
}

export enum NotificationChannel {
  INTERNAL = 'INTERNAL',
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * ------------------------------------------------
   * CREATE NOTIFICATION
   * ------------------------------------------------
   */
  async notify(params: {
    companyId: string;
    type: NotificationType;
    title: string;
    message: string;
    channels?: NotificationChannel[];
    meta?: Record<string, any>;
  }) {
    const notification =
      await this.prisma.notification.create({
        data: {
          companyId: params.companyId,
          type: params.type,
          title: params.title,
          message: params.message,
          meta: params.meta,
        },
      });

    // channels — future extensions
    // EMAIL / TELEGRAM / PUSH
    // handled asynchronously

    return notification;
  }
}