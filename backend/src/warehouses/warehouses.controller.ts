/**
 * ============================================
 * ARTIVIO — WAREHOUSES CONTROLLER
 * File: warehouses.controller.ts
 * ============================================
 */

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { WarehousesService } from './warehouses.service';
import { WarehouseType } from './warehouses.types';

@Controller('warehouses')
export class WarehousesController {
  constructor(
    private readonly warehousesService: WarehousesService,
  ) {}

  /**
   * ------------------------------------------------
   * WAREHOUSES
   * ------------------------------------------------
   */

  @Get()
  async getWarehouses(@Req() req: Request) {
    return this.warehousesService.getWarehouses(
      req.context!.companyId!,
    );
  }

  @Post()
  async createWarehouse(
    @Req() req: Request,
    @Body()
    body: {
      name: string;
      type: WarehouseType;
      address?: string;
    },
  ) {
    return this.warehousesService.createWarehouse(
      req.context!.companyId!,
      body,
    );
  }

  @Get(':warehouseId')
  async getWarehouseById(
    @Req() req: Request,
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.warehousesService.getWarehouseById(
      req.context!.companyId!,
      warehouseId,
    );
  }

  /**
   * ------------------------------------------------
   * STOCK
   * ------------------------------------------------
   */

  @Get(':warehouseId/stock')
  async getStock(
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.warehousesService.getWarehouseStock(
      warehouseId,
    );
  }

  @Post(':warehouseId/adjust')
  async adjustStock(
    @Param('warehouseId') warehouseId: string,
    @Body()
    body: {
      productId?: string;
      materialId?: string;
      quantity: number;
      reason?: string;
    },
  ) {
    return this.warehousesService.adjustStock({
      warehouseId,
      ...body,
    });
  }

  @Post(':warehouseId/reserve')
  async reserveStock(
    @Param('warehouseId') warehouseId: string,
    @Body()
    body: {
      productId?: string;
      materialId?: string;
      quantity: number;
      reason?: string;
    },
  ) {
    return this.warehousesService.reserveStock({
      warehouseId,
      ...body,
    });
  }

  @Post(':warehouseId/release')
  async releaseReserve(
    @Param('warehouseId') warehouseId: string,
    @Body()
    body: {
      productId?: string;
      materialId?: string;
      quantity: number;
      reason?: string;
    },
  ) {
    return this.warehousesService.releaseReserve({
      warehouseId,
      ...body,
    });
  }
}