/**
 * ============================================
 * ARTIVIO — WAREHOUSES MODULE
 * File: warehouses.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { MaterialsModule } from '../materials/materials.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    MaterialsModule,
  ],
  providers: [WarehousesService],
  controllers: [WarehousesController],
  exports: [WarehousesService],
})
export class WarehousesModule {}