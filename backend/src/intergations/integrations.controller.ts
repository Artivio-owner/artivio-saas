/**
 * ============================================
 * ARTIVIO — INTEGRATIONS CONTROLLER
 * File: integrations.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { IntegrationsService } from './integrations.service';

import {
  PaymentProvider,
  DeliveryProvider,
  MarketplaceProvider,
} from './integrations.types';

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
  ) {}

  /**
   * ==================================================
   * PAYMENTS
   * ==================================================
   */

  @Get(':companyId/payments')
  getPayments(@Param('companyId') companyId: string) {
    return this.integrationsService.getPayments(companyId);
  }

  @Post(':companyId/payments/connect')
  connectPayment(
    @Param('companyId') companyId: string,
    @Body()
    body: {
      provider: PaymentProvider;
      credentials: Record<string, string>;
    },
  ) {
    return this.integrationsService.connectPayment(
      companyId,
      body.provider,
      body.credentials,
    );
  }

  @Post(':companyId/payments/disable/:provider')
  disablePayment(
    @Param('companyId') companyId: string,
    @Param('provider') provider: PaymentProvider,
  ) {
    return this.integrationsService.disablePayment(
      companyId,
      provider,
    );
  }

  /**
   * ==================================================
   * DELIVERY
   * ==================================================
   */

  @Get(':companyId/delivery')
  getDeliveries(@Param('companyId') companyId: string) {
    return this.integrationsService.getDeliveries(companyId);
  }

  @Post(':companyId/delivery/connect')
  connectDelivery(
    @Param('companyId') companyId: string,
    @Body()
    body: {
      provider: DeliveryProvider;
      credentials: Record<string, string>;
    },
  ) {
    return this.integrationsService.connectDelivery(
      companyId,
      body.provider,
      body.credentials,
    );
  }

  @Post(':companyId/delivery/disable/:provider')
  disableDelivery(
    @Param('companyId') companyId: string,
    @Param('provider') provider: DeliveryProvider,
  ) {
    return this.integrationsService.disableDelivery(
      companyId,
      provider,
    );
  }

  @Get(':companyId/delivery/estimate/:provider')
  estimateDelivery(
    @Param('companyId') companyId: string,
    @Param('provider') provider: DeliveryProvider,
  ) {
    return this.integrationsService.estimateDelivery(
      companyId,
      provider,
    );
  }

  /**
   * ==================================================
   * MARKETPLACES
   * ==================================================
   */

  @Get(':companyId/marketplaces')
  getMarketplaces(@Param('companyId') companyId: string) {
    return this.integrationsService.getMarketplaces(companyId);
  }

  @Post(':companyId/marketplaces/connect')
  connectMarketplace(
    @Param('companyId') companyId: string,
    @Body()
    body: {
      provider: MarketplaceProvider;
      credentials: Record<string, string>;
    },
  ) {
    return this.integrationsService.connectMarketplace(
      companyId,
      body.provider,
      body.credentials,
    );
  }

  @Post(':companyId/marketplaces/disable/:provider')
  disableMarketplace(
    @Param('companyId') companyId: string,
    @Param('provider') provider: MarketplaceProvider,
  ) {
    return this.integrationsService.disableMarketplace(
      companyId,
      provider,
    );
  }

  @Post(':companyId/marketplaces/sync/products/:provider')
  syncProducts(
    @Param('companyId') companyId: string,
    @Param('provider') provider: MarketplaceProvider,
  ) {
    return this.integrationsService.syncMarketplaceProducts(
      companyId,
      provider,
    );
  }

  @Post(':companyId/marketplaces/sync/orders/:provider')
  syncOrders(
    @Param('companyId') companyId: string,
    @Param('provider') provider: MarketplaceProvider,
  ) {
    return this.integrationsService.syncMarketplaceOrders(
      companyId,
      provider,
    );
  }

  /**
   * ==================================================
   * YANDEX
   * ==================================================
   */

  @Get(':companyId/yandex/map')
  getYandexMap(@Param('companyId') companyId: string) {
    return this.integrationsService.getYandexMap(companyId);
  }

  @Get(':companyId/yandex/reviews')
  getYandexReviews(@Param('companyId') companyId: string) {
    return this.integrationsService.getYandexReviews(companyId);
  }

  @Get(':companyId/yandex/comments')
  getYandexComments(@Param('companyId') companyId: string) {
    return this.integrationsService.getYandexComments(companyId);
  }
}