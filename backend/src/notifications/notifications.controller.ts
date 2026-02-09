/**
 * ============================================
 * ARTIVIO — NOTIFICATIONS CONTROLLER
 * ============================================
 */

import { Controller, Get, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantRequest } from '../domains/tenant.middleware';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@Req() req: TenantRequest) {
    return this.prisma.notification.findMany({
      where: { companyId: req.companyId },
      orderBy: { createdAt: 'desc' },
    });
  }
}