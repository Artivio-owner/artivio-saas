/**
 * ============================================
 * ARTIVIO — WEBHOOK SERVICE
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketplace: MarketplaceService,
  ) {}

  async handle(
    type: string,
    event: string,
    payload: any,
  ) {
    switch (type) {
      case 'ozon':
      case 'wb':
        return this.handleOrderEvent(type, event, payload);
      default:
        return;
    }
  }

  async handleOrderEvent(
    type: string,
    event: string,
    data: any,
  ) {
    // пример: ORDER_CREATED, ORDER_CANCELLED, SHIPPED
    const externalId = data.order_id;

    const order = await this.prisma.order.findFirst({
      where: {
        marketplace: {
          path: ['orderId'],
          equals: externalId,
        },
      },
    });

    if (!order) return;

    if (event === 'ORDER_CANCELLED') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });
    }

    if (event === 'SHIPPED') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'SHIPPED' },
      });
    }
  }
}