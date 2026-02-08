/**
 * ============================================
 * ARTIVIO — DELIVERY SERVICE
 * File: delivery.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TariffsService } from '../../saas/tariffs.service';
import { AddonModule } from '../../saas/saas.types';

import {
  DeliveryProvider,
  DeliveryStatus,
} from '../integrations.types';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tariffsService: TariffsService,
  ) {}

  /**
   * --------------------------------------------------
   * ПОЛУЧИТЬ ПОДКЛЮЧЕННЫЕ СЛУЖБЫ ДОСТАВКИ
   * --------------------------------------------------
   */
  async getCompanyDeliveries(companyId: string) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.DELIVERY,
    );

    return this.prisma.deliveryIntegration.findMany({
      where: { companyId },
    });
  }

  /**
   * --------------------------------------------------
   * ПОДКЛЮЧИТЬ / ОБНОВИТЬ ДОСТАВКУ
   * --------------------------------------------------
   */
  async upsertDeliveryProvider(
    companyId: string,
    provider: DeliveryProvider,
    credentials: Record<string, string>,
  ) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.DELIVERY,
    );

    return this.prisma.deliveryIntegration.upsert({
      where: {
        companyId_provider: {
          companyId,
          provider,
        },
      },
      update: {
        credentials,
        status: DeliveryStatus.ACTIVE,
      },
      create: {
        companyId,
        provider,
        credentials,
        status: DeliveryStatus.ACTIVE,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ОТКЛЮЧИТЬ ДОСТАВКУ
   * --------------------------------------------------
   */
  async disableDeliveryProvider(
    companyId: string,
    provider: DeliveryProvider,
  ) {
    return this.prisma.deliveryIntegration.update({
      where: {
        companyId_provider: {
          companyId,
          provider,
        },
      },
      data: {
        status: DeliveryStatus.INACTIVE,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ПРОСТОЙ РАСЧЁТ СРОКОВ (БАЗОВЫЙ)
   * --------------------------------------------------
   * Позже расширяется API конкретных служб
   */
  async estimateDelivery(
    companyId: string,
    provider: DeliveryProvider,
  ) {
    const integration =
      await this.prisma.deliveryIntegration.findUnique({
        where: {
          companyId_provider: {
            companyId,
            provider,
          },
        },
      });

    if (!integration || integration.status !== DeliveryStatus.ACTIVE) {
      throw new ForbiddenException(
        'Служба доставки не подключена',
      );
    }

    return {
      provider,
      minDays: 2,
      maxDays: 7,
    };
  }
}