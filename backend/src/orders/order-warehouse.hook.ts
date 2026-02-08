/**
 * ============================================
 * ARTIVIO — ORDER ↔ WAREHOUSE HOOK
 * File: order-warehouse.hook.ts
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { WarehousesService } from '../warehouses/warehouses.service';

@Injectable()
export class OrderWarehouseHook {
  constructor(
    private readonly warehousesService: WarehousesService,
  ) {}

  /**
   * ------------------------------------------------
   * RESERVE ON ORDER CREATE
   * ------------------------------------------------
   */
  async reserveForOrder(params: {
    warehouseId: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    orderId: string;
  }) {
    for (const item of params.items) {
      await this.warehousesService.reserveStock({
        warehouseId: params.warehouseId,
        productId: item.productId,
        quantity: item.quantity,
        reason: `Order ${params.orderId}`,
      });
    }
  }

  /**
   * ------------------------------------------------
   * RELEASE ON ORDER CANCEL
   * ------------------------------------------------
   */
  async releaseForOrder(params: {
    warehouseId: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    orderId: string;
  }) {
    for (const item of params.items) {
      await this.warehousesService.releaseReserve({
        warehouseId: params.warehouseId,
        productId: item.productId,
        quantity: item.quantity,
        reason: `Cancel order ${params.orderId}`,
      });
    }
  }
}