/**
 * ============================================
 * ARTIVIO — NOTIFICATIONS CONTROLLER
 * File: notifications.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * ------------------------------------------------
   * GET INBOX
   * ------------------------------------------------
   */
  @Get()
  async getNotifications(
    @Query('companyId') companyId: string,
    @Query('type') type?: NotificationType,
    @Query('isRead') isRead?: string,
  ) {
    return this.prisma.notification.findMany({
      where: {
        companyId,
        type: type ?? undefined,
        isRead:
          isRead !== undefined
            ? isRead === 'true'
            : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * ------------------------------------------------
   * MARK AS READ
   * ------------------------------------------------
   */
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
  ) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }
}