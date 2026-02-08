/**
 * ============================================
 * ARTIVIO — MARKETPLACES SERVICE
 * File: marketplaces.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TariffsService } from '../../saas/tariffs.service';
import { AddonModule } from '../../saas/saas.types';

import {
  MarketplaceProvider,
  MarketplaceStatus,
} from '../integrations.types';

@Injectable()
export class MarketplacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tariffsService: TariffsService,
  ) {}

  /**
   * --------------------------------------------------
   * ПОЛУЧИТЬ ПОДКЛЮЧЕННЫЕ МАРКЕТПЛЕЙСЫ
   * --------------------------------------------------
   */
  async getCompanyMarketplaces(companyId: string) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.MARKETPLACES,
    );

    return this.prisma.marketplaceIntegration.findMany({
      where: { companyId },
    });
  }

  /**
   * --------------------------------------------------
   * ПОДКЛЮЧИТЬ / ОБНОВИТЬ МАРКЕТПЛЕЙС
   * --------------------------------------------------
   */
  async upsertMarketplace(
    companyId: string,
    provider: MarketplaceProvider,
    credentials: Record<string, string>,
  ) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.MARKETPLACES,
    );

    return this.prisma.marketplaceIntegration.upsert({
      where: {
        companyId_provider: {
          companyId,
          provider,
        },
      },
      update: {
        credentials,
        status: MarketplaceStatus.ACTIVE,
      },
      create: {
        companyId,
        provider,
        credentials,
        status: MarketplaceStatus.ACTIVE,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ОТКЛЮЧИТЬ МАРКЕТПЛЕЙС
   * --------------------------------------------------
   */
  async disableMarketplace(
    companyId: string,
    provider: MarketplaceProvider,
  ) {
    return this.prisma.marketplaceIntegration.update({
      where: {
        companyId_provider: {
          companyId,
          provider,
        },
      },
      data: {
        status: MarketplaceStatus.INACTIVE,
      },
    });
  }

  /**
   * --------------------------------------------------
   * СИНХРОНИЗАЦИЯ ТОВАРОВ (ЗАГЛУШКА)
   * --------------------------------------------------
   */
  async syncProducts(
    companyId: string,
    provider: MarketplaceProvider,
  ) {
    const integration =
      await this.prisma.marketplaceIntegration.findUnique({
        where: {
          companyId_provider: {
            companyId,
            provider,
          },
        },
      });

    if (!integration || integration.status !== MarketplaceStatus.ACTIVE) {
      throw new ForbiddenException(
        'Маркетплейс не подключен',
      );
    }

    /**
     * Реальная логика:
     * - запрос к API маркетплейса
     * - маппинг товаров
     * - обновление / создание
     */

    return {
      provider,
      syncedProducts: 0,
      status: 'ok',
    };
  }

  /**
   * --------------------------------------------------
   * СИНХРОНИЗАЦИЯ ЗАКАЗОВ (ЗАГЛУШКА)
   * --------------------------------------------------
   */
  async syncOrders(
    companyId: string,
    provider: MarketplaceProvider,
  ) {
    const integration =
      await this.prisma.marketplaceIntegration.findUnique({
        where: {
          companyId_provider: {
            companyId,
            provider,
          },
        },
      });

    if (!integration || integration.status !== MarketplaceStatus.ACTIVE) {
      throw new ForbiddenException(
        'Маркетплейс не подключен',
      );
    }

    /**
     * Реальная логика:
     * - получение заказов
     * - создание заказов в Artivio
     * - связка с клиентами
     */

    return {
      provider,
      syncedOrders: 0,
      status: 'ok',
    };
  }
}