/**
 * ============================================
 * ARTIVIO — YANDEX SERVICE
 * File: yandex.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TariffsService } from '../../saas/tariffs.service';
import { AddonModule } from '../../saas/saas.types';

import { YandexServiceType } from '../integrations.types';

@Injectable()
export class YandexService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tariffsService: TariffsService,
  ) {}

  /**
   * --------------------------------------------------
   * ПРОВЕРКА ДОСТУПА К ЯНДЕКС ИНТЕГРАЦИИ
   * --------------------------------------------------
   */
  private async ensureAccess(companyId: string) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.ANALYTICS,
    );

    const integration =
      await this.prisma.yandexIntegration.findUnique({
        where: { companyId },
      });

    if (!integration) {
      throw new ForbiddenException(
        'Яндекс интеграция не подключена',
      );
    }

    return integration;
  }

  /**
   * --------------------------------------------------
   * ЯНДЕКС КАРТЫ — ТОЧКА КОМПАНИИ
   * --------------------------------------------------
   */
  async getMapPoint(companyId: string) {
    const integration = await this.ensureAccess(companyId);

    return {
      name: integration.companyName,
      address: integration.address,
      lat: integration.latitude,
      lng: integration.longitude,
    };
  }

  /**
   * --------------------------------------------------
   * ЯНДЕКС — ОТЗЫВЫ
   * --------------------------------------------------
   */
  async getReviews(companyId: string) {
    await this.ensureAccess(companyId);

    /**
     * Реальная логика:
     * - запрос к API Яндекс Бизнес
     * - маппинг отзывов
     */

    return [
      {
        author: 'Иван',
        rating: 5,
        text: 'Отличная компания',
        createdAt: new Date(),
      },
    ];
  }

  /**
   * --------------------------------------------------
   * ЯНДЕКС — КОММЕНТАРИИ
   * --------------------------------------------------
   */
  async getComments(companyId: string) {
    await this.ensureAccess(companyId);

    /**
     * Реальная логика:
     * - комментарии к отзывам
     */

    return [];
  }
}