/**
 * ============================================
 * ARTIVIO — WAREHOUSES SERVICE
 * File: warehouses.service.ts
 * ============================================
 */

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovementType } from './warehouses.types';
import { WarehouseLowStockGuard } from './warehouse-low-stock.guard';

@Injectable()
export class WarehousesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lowStockGuard: WarehouseLowStockGuard,
  ) {}

  /**
   * ------------------------------------------------
   * ADJUST STOCK (IN / MANUAL)
   * ------------------------------------------------
   */
  async adjustStock(params: {
    warehouseId: string;
    productId?: string;
    materialId?: string;
    quantity: number;
    reason?: string;
  }) {
    const stock = await this.getOrCreateStock(params);

    await this.prisma.warehouseStock.update({
      where: { id: stock.id },
      data: {
        quantity: {
          increment: params.quantity,
        },
      },
    });

    await this.prisma.stockMovement.create({
      data: {
        warehouseId: params.warehouseId,
        productId: params.productId,
        materialId: params.materialId,
        type:
          params.quantity >= 0
            ? StockMovementType.IN
            : StockMovementType.OUT,
        quantity: Math.abs(params.quantity),
        reason: params.reason ?? 'Manual adjust',
      },
    });

    await this.lowStockGuard.check({
      warehouseId: params.warehouseId,
      productId: params.productId,
      materialId: params.materialId,
    });
  }

  /**
   * ------------------------------------------------
   * RESERVE STOCK
   * ------------------------------------------------
   */
  async reserveStock(params: {
    warehouseId: string;
    productId?: string;
    materialId?: string;
    quantity: number;
    reason?: string;
  }) {
    const stock = await this.getOrCreateStock(params);

    if (stock.quantity - stock.reserved < params.quantity) {
      throw new BadRequestException(
        'Not enough available stock',
      );
    }

    await this.prisma.warehouseStock.update({
      where: { id: stock.id },
      data: {
        reserved: { increment: params.quantity },
      },
    });

    await this.prisma.stockMovement.create({
      data: {
        warehouseId: params.warehouseId,
        productId: params.productId,
        materialId: params.materialId,
        type: StockMovementType.RESERVE,
        quantity: params.quantity,
        reason: params.reason ?? 'Reserve',
      },
    });

    await this.lowStockGuard.check({
      warehouseId: params.warehouseId,
      productId: params.productId,
      materialId: params.materialId,
    });
  }

  /**
   * ------------------------------------------------
   * RELEASE RESERVE
   * ------------------------------------------------
   */
  async releaseReserve(params: {
    warehouseId: string;
    productId?: string;
    materialId?: string;
    quantity: number;
    reason?: string;
  }) {
    const stock = await this.getOrCreateStock(params);

    if (stock.reserved < params.quantity) {
      throw new BadRequestException(
        'Invalid reserve amount',
      );
    }

    await this.prisma.warehouseStock.update({
      where: { id: stock.id },
      data: {
        reserved: { decrement: params.quantity },
      },
    });

    await this.prisma.stockMovement.create({
      data: {
        warehouseId: params.warehouseId,
        productId: params.productId,
        materialId: params.materialId,
        type: StockMovementType.RELEASE,
        quantity: params.quantity,
        reason: params.reason ?? 'Release reserve',
      },
    });

    await this.lowStockGuard.check({
      warehouseId: params.warehouseId,
      productId: params.productId,
      materialId: params.materialId,
    });
  }

  /**
   * ------------------------------------------------
   * INTERNAL
   * ------------------------------------------------
   */
  private async getOrCreateStock(params: {
    warehouseId: string;
    productId?: string;
    materialId?: string;
  }) {
    let stock =
      await this.prisma.warehouseStock.findFirst({
        where: {
          warehouseId: params.warehouseId,
          productId: params.productId,
          materialId: params.materialId,
        },
      });

    if (!stock) {
      stock = await this.prisma.warehouseStock.create({
        data: {
          warehouseId: params.warehouseId,
          productId: params.productId,
          materialId: params.materialId,
          quantity: 0,
          reserved: 0,
        },
      });
    }

    return stock;
  }
}