/**
 * ============================================
 * ARTIVIO — INTEGRATIONS FACADE SERVICE
 * File: integrations.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';

import { PaymentsService } from './payments/payments.service';
import { DeliveryService } from './delivery/delivery.service';
import { MarketplacesService } from './marketplaces/marketplaces.service';
import { YandexService } from './yandex/yandex.service';

import {
  PaymentProvider,
  DeliveryProvider,
  MarketplaceProvider,
} from './integrations.types';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly deliveryService: DeliveryService,
    private readonly marketplacesService: MarketplacesService,
    private readonly yandexService: YandexService,
  ) {}

  /**
   * --------------------------------------------------
   * PAYMENTS
   * --------------------------------------------------
   */
  getPayments(companyId: string) {
    return this.paymentsService.getCompanyPayments(companyId);
  }

  connectPayment(
    companyId: string,
    provider: PaymentProvider,
    credentials: Record<string, string>,
  ) {
    return this.paymentsService.upsertPaymentProvider(
      companyId,
      provider,
      credentials,
    );
  }

  disablePayment(
    companyId: string,
    provider: PaymentProvider,
  ) {
    return this.paymentsService.disablePaymentProvider(
      companyId,
      provider,
    );
  }

  /**
   * --------------------------------------------------
   * DELIVERY
   * --------------------------------------------------
   */
  getDeliveries(companyId: string) {
    return this.deliveryService.getCompanyDeliveries(companyId);
  }

  connectDelivery(
    companyId: string,
    provider: DeliveryProvider,
    credentials: Record<string, string>,
  ) {
    return this.deliveryService.upsertDeliveryProvider(
      companyId,
      provider,
      credentials,
    );
  }

  disableDelivery(
    companyId: string,
    provider: DeliveryProvider,
  ) {
    return this.deliveryService.disableDeliveryProvider(
      companyId,
      provider,
    );
  }

  estimateDelivery(
    companyId: string,
    provider: DeliveryProvider,
  ) {
    return this.deliveryService.estimateDelivery(
      companyId,
      provider,
    );
  }

  /**
   * --------------------------------------------------
   * MARKETPLACES
   * --------------------------------------------------
   */
  getMarketplaces(companyId: string) {
    return this.marketplacesService.getCompanyMarketplaces(
      companyId,
    );
  }

  connectMarketplace(
    companyId: string,
    provider: MarketplaceProvider,
    credentials: Record<string, string>,
  ) {
    return this.marketplacesService.upsertMarketplace(
      companyId,
      provider,
      credentials,
    );
  }

  disableMarketplace(
    companyId: string,
    provider: MarketplaceProvider,
  ) {
    return this.marketplacesService.disableMarketplace(
      companyId,
      provider,
    );
  }

  syncMarketplaceProducts(
    companyId: string,
    provider: MarketplaceProvider,
  ) {
    return this.marketplacesService.syncProducts(
      companyId,
      provider,
    );
  }

  syncMarketplaceOrders(
    companyId: string,
    provider: MarketplaceProvider,
  ) {
    return this.marketplacesService.syncOrders(
      companyId,
      provider,
    );
  }

  /**
   * --------------------------------------------------
   * YANDEX
   * --------------------------------------------------
   */
  getYandexMap(companyId: string) {
    return this.yandexService.getMapPoint(companyId);
  }

  getYandexReviews(companyId: string) {
    return this.yandexService.getReviews(companyId);
  }

  getYandexComments(companyId: string) {
    return this.yandexService.getComments(companyId);
  }
}