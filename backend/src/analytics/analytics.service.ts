/**
 * ============================================
 * ARTIVIO — ANALYTICS SERVICE
 * File: analytics.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovementType } from '../warehouses/warehouses.types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * ------------------------------------------------
   * ORDERS TURNOVER
   * ------------------------------------------------
   */
  async getOrdersTurnover(params: {
    companyId: string;
    from?: Date;
    to?: Date;
  }) {
    const orders =
      await this.prisma.order.findMany({
        where: {
          companyId: params.companyId,
          createdAt: {
            gte: params.from,
            lte: params.to,
          },
          status: 'COMPLETED',
        },
        select: {
          total: true,
        },
      });

    return {
      totalOrders: orders.length,
      turnover: orders.reduce(
        (sum, o) => sum + o.total,
        0,
      ),
    };
  }

  /**
   * ------------------------------------------------
   * WAREHOUSE STOCK SUMMARY
   * ------------------------------------------------
   */
  async getWarehouseStockSummary(
    companyId: string,
  ) {
    const stocks =
      await this.prisma.warehouseStock.findMany({
        where: {
          warehouse: {
            companyId,
          },
        },
        include: {
          warehouse: true,
        },
      });

    return stocks.map((s) => ({
      warehouseId: s.warehouseId,
      warehouseName: s.warehouse.name,
      productId: s.productId,
      materialId: s.materialId,
      quantity: s.quantity,
      reserved: s.reserved,
      available: s.quantity - s.reserved,
    }));
  }

  /**
   * ------------------------------------------------
   * STOCK MOVEMENTS
   * ------------------------------------------------
   */
  async getStockMovements(params: {
    companyId: string;
    from?: Date;
    to?: Date;
    type?: StockMovementType;
  }) {
    return this.prisma.stockMovement.findMany({
      where: {
        warehouse: {
          companyId: params.companyId,
        },
        type: params.type,
        createdAt: {
          gte: params.from,
          lte: params.to,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}