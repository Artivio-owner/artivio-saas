/**
 * ============================================
 * ARTIVIO — ORDER SHIPPING HOOK
 * File: order-shipping.hook.ts
 * ============================================
 */

import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovementType } from '../warehouses/warehouses.types';

@Injectable()
export class OrderShippingHook {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * ------------------------------------------------
   * SHIP ORDER (RESERVE → OUT)
   * ------------------------------------------------
   */
  async shipOrder(params: {
    companyId: string;
    orderId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: params.orderId,
          companyId: params.companyId,
        },
        include: { items: true },
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      if (order.status !== 'PAID') {
        throw new BadRequestException(
          'Order must be PAID before shipping',
        );
      }

      for (const item of order.items) {
        const stock =
          await tx.warehouseStock.findFirst({
            where: {
              warehouseId: order.warehouseId,
              productId: item.productId,
            },
          });

        if (!stock || stock.reserved < item.quantity) {
          throw new BadRequestException(
            'Invalid warehouse reserve state',
          );
        }

        await tx.warehouseStock.update({
          where: { id: stock.id },
          data: {
            reserved: { decrement: item.quantity },
            quantity: { decrement: item.quantity },
          },
        });

        await tx.stockMovement.create({
          data: {
            warehouseId: order.warehouseId,
            productId: item.productId,
            type: StockMovementType.OUT,
            quantity: item.quantity,
            reason: `Shipment order ${order.id}`,
          },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          status: 'SHIPPED',
          shippedAt: new Date(),
        },
      });
    });
  }
}