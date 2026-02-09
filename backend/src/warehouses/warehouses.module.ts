/**
 * ============================================
 * ARTIVIO — WAREHOUSES MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { InventoryService } from './inventory.service';
import { BarcodeService } from './barcode.service';
import { WarehousesController } from './warehouses.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SaasModule } from '../saas/saas.module';

@Module({
  imports: [SaasModule],
  controllers: [WarehousesController],
  providers: [
    WarehouseService,
    InventoryService,
    BarcodeService,
    PrismaService,
  ],
  exports: [InventoryService],
})
export class WarehousesModule {}