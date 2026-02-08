/**
 * ============================================
 * ARTIVIO — TARIFFS SERVICE
 * File: tariffs.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AddonModule, FeatureFlag } from './saas.types';

@Injectable()
export class TariffsService {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}

  /**
   * --------------------------------------------------
   * ЖЁСТКАЯ ПРОВЕРКА АКТИВНОСТИ ТАРИФА
   * --------------------------------------------------
   * Если тариф истёк — сразу ошибка
   */
  async ensureTariffActive(companyId: string) {
    const isActive =
      await this.companiesService.isTariffActive(companyId);

    if (!isActive) {
      throw new ForbiddenException(
        'Срок действия тарифа истёк',
      );
    }
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА ДОСТУПА К МОДУЛЮ
   * --------------------------------------------------
   */
  async ensureModuleAccess(
    companyId: string,
    module: AddonModule,
  ) {
    await this.ensureTariffActive(companyId);

    const hasAccess =
      await this.companiesService.hasModuleAccess(
        companyId,
        module,
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        `Модуль ${module} недоступен по тарифу`,
      );
    }
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА ДОСТУПА К ФИЧЕ
   * --------------------------------------------------
   */
  async ensureFeatureAccess(
    companyId: string,
    feature: FeatureFlag,
  ) {
    await this.ensureTariffActive(companyId);

    const hasAccess =
      await this.companiesService.hasFeatureAccess(
        companyId,
        feature,
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        `Функция ${feature} недоступна по тарифу`,
      );
    }
  }

  /**
   * --------------------------------------------------
   * МЯГКАЯ ПРОВЕРКА (BOOLEAN)
   * --------------------------------------------------
   * Используется для UI
   */
  async canUseModule(
    companyId: string,
    module: AddonModule,
  ): Promise<boolean> {
    try {
      await this.ensureModuleAccess(companyId, module);
      return true;
    } catch {
      return false;
    }
  }

  async canUseFeature(
    companyId: string,
    feature: FeatureFlag,
  ): Promise<boolean> {
    try {
      await this.ensureFeatureAccess(companyId, feature);
      return true;
    } catch {
      return false;
    }
  }
}