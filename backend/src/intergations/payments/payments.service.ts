/**
 * ============================================
 * ARTIVIO — PAYMENTS SERVICE
 * File: payments.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TariffsService } from '../../saas/tariffs.service';

import {
  PaymentProvider,
  PaymentStatus,
} from '../integrations.types';

import { AddonModule } from '../../saas/saas.types';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tariffsService: TariffsService,
  ) {}

  /**
   * --------------------------------------------------
   * ПОЛУЧИТЬ ПОДКЛЮЧЕННЫЕ ПЛАТЕЖНЫЕ СИСТЕМЫ
   * --------------------------------------------------
   */
  async getCompanyPayments(companyId: string) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.PAYMENTS,
    );

    return this.prisma.paymentIntegration.findMany({
      where: { companyId },
    });
  }

  /**
   * --------------------------------------------------
   * ПОДКЛЮЧИТЬ / ОБНОВИТЬ ПЛАТЕЖНУЮ СИСТЕМУ
   * --------------------------------------------------
   */
  async upsertPaymentProvider(
    companyId: string,
    provider: PaymentProvider,
    credentials: Record<string, string>,
  ) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.PAYMENTS,
    );

    return this.prisma.paymentIntegration.upsert({
      where: {
        companyId_provider: {
          companyId,
          provider,
        },
      },
      update: {
        credentials,
        status: PaymentStatus.ACTIVE,
      },
      create: {
        companyId,
        provider,
        credentials,
        status: PaymentStatus.ACTIVE,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ОТКЛЮЧИТЬ ПЛАТЕЖНУЮ СИСТЕМУ
   * --------------------------------------------------
   */
  async disablePaymentProvider(
    companyId: string,
    provider: PaymentProvider,
  ) {
    return this.prisma.paymentIntegration.update({
      where: {
        companyId_provider: {
          companyId,
          provider,
        },
      },
      data: {
        status: PaymentStatus.INACTIVE,
      },
    });
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА АКТИВНОСТИ ПЛАТЕЖА
   * --------------------------------------------------
   */
  async ensurePaymentAvailable(
    companyId: string,
    provider: PaymentProvider,
  ) {
    const integration =
      await this.prisma.paymentIntegration.findUnique({
        where: {
          companyId_provider: {
            companyId,
            provider,
          },
        },
      });

    if (!integration || integration.status !== PaymentStatus.ACTIVE) {
      throw new ForbiddenException(
        'Платёжная система не подключена',
      );
    }

    return integration;
  }
}