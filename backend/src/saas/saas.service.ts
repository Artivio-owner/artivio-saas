/**
 * ============================================
 * ARTIVIO — SAAS SERVICE (CORE)
 * File: saas.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaasPlan, SaasLimits, SaasFeatureFlags } from './saas.types';

const PLAN_LIMITS: Record<SaasPlan, SaasLimits> = {
  FREE: { warehouses: 1, products: 20, ordersPerMonth: 50, users: 1 },
  BASIC: { warehouses: 3, products: 200, ordersPerMonth: 500, users: 5 },
  PRO: { warehouses: 999, products: 9999, ordersPerMonth: 99999, users: 50 },
};

const PLAN_FEATURES: Record<SaasPlan, SaasFeatureFlags> = {
  FREE: { analytics: false, warehouses: true, orders: true, notifications: false, marketingIntegrations: false, pwa: false, helpdesk: false },
  BASIC: { analytics: true, warehouses: true, orders: true, notifications: true, marketingIntegrations: true, pwa: true, helpdesk: true },
  PRO: { analytics: true, warehouses: true, orders: true, notifications: true, marketingIntegrations: true, pwa: true, helpdesk: true },
};

@Injectable()
export class SaasService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyPlan(companyId: string): Promise<SaasPlan> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { plan: true },
    });
    return (company?.plan as SaasPlan) ?? SaasPlan.FREE;
  }

  getLimits(plan: SaasPlan): SaasLimits {
    return PLAN_LIMITS[plan];
  }

  getFeatures(plan: SaasPlan): SaasFeatureFlags {
    return PLAN_FEATURES[plan];
  }

  async assertLimit(params: {
    companyId: string;
    type: keyof SaasLimits;
    current: number;
  }) {
    const plan = await this.getCompanyPlan(params.companyId);
    const limits = this.getLimits(plan);
    if (params.current >= limits[params.type]) {
      throw new ForbiddenException(`SaaS limit reached: ${params.type}`);
    }
  }

  async getCompanyInfo(companyId: string) {
    const plan = await this.getCompanyPlan(companyId);
    return {
      plan,
      limits: this.getLimits(plan),
      features: this.getFeatures(plan),
    };
  }
}

/**
 * ============================================
 * ARTIVIO — SAAS SERVICE
 * Определение компании по домену
 * ============================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SaaSService {
  static async resolveCompany(host: string) {
    const cleanHost = host.split(':')[0].toLowerCase();

    // 1️⃣ Платформа (artivio.ru, localhost)
    if (
      cleanHost === 'artivio.ru' ||
      cleanHost.endsWith('.artivio.ru') === false
    ) {
      return { company: null, isPlatform: true };
    }

    // 2️⃣ Поддомен (*.artivio.ru)
    if (cleanHost.endsWith('.artivio.ru')) {
      const subdomain = cleanHost.replace('.artivio.ru', '');

      const company = await prisma.company.findFirst({
        where: { slug: subdomain },
      });

      return { company, isPlatform: false };
    }

    // 3️⃣ Кастомный домен клиента
    const company = await prisma.company.findFirst({
      where: { domain: cleanHost },
    });

    return { company, isPlatform: false };
  }
}