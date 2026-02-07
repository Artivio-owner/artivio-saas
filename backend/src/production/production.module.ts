/**
 * ============================================
 * ARTIVIO — PRODUCTION MODULE
 * File: production.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    PrismaModule,

    /**
     * Заказы:
     * - статусы
     * - позиции
     * - частичное изготовление
     */
    OrdersModule,

    /**
     * Сотрудники:
     * - роли
     * - производительность
     * - аналитика
     */
    EmployeesModule,
  ],
  providers: [ProductionService],
  controllers: [ProductionController],
  exports: [ProductionService],
})
export class ProductionModule {}