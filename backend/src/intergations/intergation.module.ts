/**
 * ============================================
 * ARTIVIO — INTEGRATIONS MODULE
 * File: integrations.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SaasModule } from '../saas/saas.module';

import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

import { PaymentsService } from './payments/payments.service';
import { DeliveryService } from './delivery/delivery.service';
import { MarketplacesService } from './marketplaces/marketplaces.service';
import { YandexService } from './yandex/yandex.service';

@Module({
  imports: [
    PrismaModule,
    SaasModule,
  ],
  controllers: [
    IntegrationsController,
  ],
  providers: [
    IntegrationsService,
    PaymentsService,
    DeliveryService,
    MarketplacesService,
    YandexService,
  ],
  exports: [
    PaymentsService,
    DeliveryService,
    MarketplacesService,
    YandexService,
  ],
})
export class IntegrationsModule {}