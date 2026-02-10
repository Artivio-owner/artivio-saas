/**
 * ============================================
 * ARTIVIO — ORDERS MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [WarehousesModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { LabelsService } from './labels.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, LabelsService],
})
export class OrdersModule {}