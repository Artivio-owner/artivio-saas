/**
 * ============================================
 * ARTIVIO — BILLING SERVICE
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLANS } from './plans.seed';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(companyId: string) {
    return this.prisma.subscription.findUnique({
      where: { companyId },
    });
  }

  async getPlanLimits(companyId: string) {
    const sub = await this.getSubscription(companyId);
    if (!sub) return PLANS.FREE;
    return PLANS[sub.planCode];
  }

  async checkLimit(
    companyId: string,
    key: keyof typeof PLANS.FREE,
    currentValue: number,
  ) {
    const limits = await this.getPlanLimits(companyId);
    if (currentValue >= limits[key]) {
      throw new ForbiddenException(
        `Лимит тарифа превышен (${key})`,
      );
    }
  }
}