/**
 * ============================================
 * ARTIVIO — ACCOUNTING MODULE
 * File: accounting.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    PrismaModule,

    /**
     * Заказы:
     * - выручка
     * - завершённые заказы
     */
    OrdersModule,

    /**
     * Товары:
     * - себестоимость
     * - маржинальность
     */
    ProductsModule,
  ],
  providers: [AccountingService],
  controllers: [AccountingController],
  exports: [AccountingService],
})
export class AccountingModule {}