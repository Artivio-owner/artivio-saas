/**
 * ============================================
 * ARTIVIO — ORDERS SERVICE
 * File: orders.service.ts
 * ============================================
 */

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderWarehouseHook } from './order-warehouse.hook';

export enum OrderStatus {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly warehouseHook: OrderWarehouseHook,
  ) {}

  /**
   * ------------------------------------------------
   * CREATE ORDER
   * ------------------------------------------------
   */
  async createOrder(params: {
    companyId: string;
    warehouseId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  }) {
    if (!params.items.length) {
      throw new BadRequestException('Order is empty');
    }

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          companyId: params.companyId,
          status: OrderStatus.CREATED,
          warehouseId: params.warehouseId,
          totalAmount: params.items.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0,
          ),
          items: {
            create: params.items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        },
        include: { items: true },
      });

      await this.warehouseHook.reserveForOrder({
        warehouseId: params.warehouseId,
        items: params.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        orderId: order.id,
      });

      return order;
    });
  }

  /**
   * ------------------------------------------------
   * CANCEL ORDER
   * ------------------------------------------------
   */
  async cancelOrder(params: {
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

      if (order.status !== OrderStatus.CREATED) {
        throw new BadRequestException(
          'Only new orders can be cancelled',
        );
      }

      await this.warehouseHook.releaseForOrder({
        warehouseId: order.warehouseId,
        items: order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        orderId: order.id,
      });

      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }
}