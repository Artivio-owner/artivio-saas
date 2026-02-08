/**
 * ============================================
 * ARTIVIO — WAREHOUSE LOW STOCK GUARD
 * File: warehouse-low-stock.guard.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationsService,
  NotificationType,
} from '../notifications/notifications.service';

@Injectable()
export class WarehouseLowStockGuard {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * ------------------------------------------------
   * CHECK LOW STOCK
   * ------------------------------------------------
   */
  async check(params: {
    warehouseId: string;
    productId?: string;
    materialId?: string;
    threshold?: number;
  }) {
    const threshold = params.threshold ?? 5;

    const stock =
      await this.prisma.warehouseStock.findFirst({
        where: {
          warehouseId: params.warehouseId,
          productId: params.productId,
          materialId: params.materialId,
        },
        include: {
          warehouse: true,
        },
      });

    if (!stock) return;

    if (stock.quantity > threshold) return;

    // prevent notification spam
    const alreadyExists =
      await this.prisma.notification.findFirst({
        where: {
          companyId: stock.warehouse.companyId,
          type: NotificationType.LOW_STOCK,
          meta: {
            path: ['warehouseStockId'],
            equals: stock.id,
          },
        },
      });

    if (alreadyExists) return;

    await this.notifications.notify({
      companyId: stock.warehouse.companyId,
      type: NotificationType.LOW_STOCK,
      title: 'Low stock alert',
      message: `Low stock in warehouse "${stock.warehouse.name}"`,
      meta: {
        warehouseId: stock.warehouseId,
        warehouseStockId: stock.id,
        productId: stock.productId,
        materialId: stock.materialId,
        quantity: stock.quantity,
      },
    });
  }
}