/**
 * ============================================
 * ARTIVIO — ORDERS MODULE
 * File: orders.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { MaterialsModule } from '../materials/materials.module';
import { ProductionModule } from '../production/production.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    PrismaModule,

    /**
     * Товары:
     * - себестоимость
     * - материалы
     * - VIP-флаги
     */
    ProductsModule,

    /**
     * Материалы:
     * - списание
     * - остатки
     * - критические значения
     */
    MaterialsModule,

    /**
     * Производственная линия:
     * - этапы
     * - загрузка
     * - аналитика
     */
    ProductionModule,

    /**
     * Клиенты:
     * - метки
     * - история заказов
     */
    ClientsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}