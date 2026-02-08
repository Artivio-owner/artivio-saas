/**
 * ============================================
 * ARTIVIO — COMPANIES SERVICE
 * File: companies.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import {
  TariffPlan,
  TARIFFS,
  AddonModule,
  FeatureFlag,
} from './saas.types';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * --------------------------------------------------
   * СОЗДАНИЕ КОМПАНИИ (SUPER_ADMIN)
   * --------------------------------------------------
   * Используется вручную
   */
  async createCompany(data: {
    name: string;
    domain?: string;
  }) {
    const tariff = TARIFFS[TariffPlan.FREE_TRIAL];

    const tariffUntil = new Date();
    tariffUntil.setDate(
      tariffUntil.getDate() + tariff.durationDays,
    );

    return this.prisma.company.create({
      data: {
        name: data.name,
        domain: data.domain,
        tariff: TariffPlan.FREE_TRIAL,
        tariffUntil,
        isActive: true,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ОБНОВЛЕНИЕ ТАРИФА
   * --------------------------------------------------
   */
  async setTariff(
    companyId: string,
    plan: TariffPlan,
  ) {
    const tariff = TARIFFS[plan];

    if (!tariff) {
      throw new ForbiddenException('Тариф не найден');
    }

    const tariffUntil = new Date();
    tariffUntil.setDate(
      tariffUntil.getDate() + tariff.durationDays,
    );

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        tariff: plan,
        tariffUntil,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА АКТИВНОСТИ ТАРИФА
   * --------------------------------------------------
   */
  async isTariffActive(companyId: string): Promise<boolean> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company || !company.isActive) {
      return false;
    }

    if (!company.tariffUntil) {
      return false;
    }

    return company.tariffUntil > new Date();
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА ДОСТУПА К МОДУЛЮ
   * --------------------------------------------------
   */
  async hasModuleAccess(
    companyId: string,
    module: AddonModule,
  ): Promise<boolean> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) return false;

    const tariff = TARIFFS[company.tariff as TariffPlan];
    if (!tariff) return false;

    return tariff.modules.includes(module);
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА ДОСТУПА К ФИЧЕ
   * --------------------------------------------------
   */
  async hasFeatureAccess(
    companyId: string,
    feature: FeatureFlag,
  ): Promise<boolean> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) return false;

    const tariff = TARIFFS[company.tariff as TariffPlan];
    if (!tariff) return false;

    return tariff.features.includes(feature);
  }

  /**
   * --------------------------------------------------
   * ВКЛЮЧЕНИЕ / ВЫКЛЮЧЕНИЕ КОМПАНИИ
   * --------------------------------------------------
   */
  async setCompanyStatus(
    companyId: string,
    isActive: boolean,
  ) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { isActive },
    });
  }

  /**
   * --------------------------------------------------
   * СПИСОК ВСЕХ КОМПАНИЙ (SUPER_ADMIN)
   * --------------------------------------------------
   */
  async getAllCompanies() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}