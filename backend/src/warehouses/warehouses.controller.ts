/**
 * ============================================
 * ARTIVIO — WAREHOUSES CONTROLLER
 * ============================================
 */

import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { InventoryService } from './inventory.service';
import { BarcodeService } from './barcode.service';
import { TenantRequest } from '../domains/tenant.middleware';

@Controller('warehouses')
export class WarehousesController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly inventoryService: InventoryService,
    private readonly barcodeService: BarcodeService,
  ) {}

  @Post()
  create(@Req() req: TenantRequest, @Body('name') name: string) {
    return this.warehouseService.createWarehouse(req.companyId!, name);
  }

  @Get()
  list(@Req() req: TenantRequest) {
    return this.warehouseService.getCompanyWarehouses(req.companyId!);
  }

  @Post('barcode')
  async barcode(@Body('article') article: string) {
    return this.barcodeService.generateBarcode(article);
  }

  @Post('qr')
  async qr(@Body('article') article: string) {
    return this.barcodeService.generateQr(article);
  }
}