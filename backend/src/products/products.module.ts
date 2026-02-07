/**
 * ============================================
 * ARTIVIO — PRODUCTS MODULE
 * File: products.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { MaterialsModule } from '../materials/materials.module';

@Module({
  imports: [
    PrismaModule,
    MaterialsModule, // связь товаров и склада
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}