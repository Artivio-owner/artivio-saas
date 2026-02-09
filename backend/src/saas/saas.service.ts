/**
 * ============================================
 * ARTIVIO — SAAS SERVICE
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaasPlan, SaasLimits } from './saas.types';

const PLAN_LIMITS: Record<SaasPlan, SaasLimits> = {
  FREE: {
    warehouses: 1,
    products: 20,
    ordersPerMonth: 50,
    users: 1,
  },
  BASIC: {
    warehouses: 3,
    products: 200,
    ordersPerMonth: 500,
    users: 5,
  },
  PRO: {
    warehouses: 999,
    products: 9999,
    ordersPerMonth: 99999,
    users: 50,
  },
};

@Injectable()
export class SaasService {
  constructor(private readonly prisma: PrismaService) {}

  getLimits(plan: SaasPlan): SaasLimits {
    return PLAN_LIMITS[plan];
  }

  async getCompanyPlan(companyId: string): Promise<SaasPlan> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { plan: true },
    });

    return (company?.plan as SaasPlan) ?? SaasPlan.FREE;
  }

  async assertLimit(params: {
    companyId: string;
    type: keyof SaasLimits;
    current: number;
  }) {
    const plan = await this.getCompanyPlan(params.companyId);
    const limits = this.getLimits(plan);

    if (params.current >= limits[params.type]) {
      throw new ForbiddenException(
        `SaaS limit reached: ${params.type}`,
      );
    }
  }
}