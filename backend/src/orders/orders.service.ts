/**
 * ============================================
 * ARTIVIO — ORDERS SERVICE
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../warehouses/inventory.service';
import { OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createOrder(params: {
    companyId: string;
    warehouseId: string;
    items: { materialId: string; quantity: number }[];
    marketplace?: any;
    isPickup: boolean;
  }) {
    // 1️⃣ резервируем склад
    for (const item of params.items) {
      await this.inventoryService.reserveMaterial({
        warehouseId: params.warehouseId,
        materialId: item.materialId,
        quantity: item.quantity,
      });
    }

    // 2️⃣ создаём заказ
    return this.prisma.order.create({
      data: {
        companyId: params.companyId,
        warehouseId: params.warehouseId,
        status: OrderStatus.RESERVED,
        items: params.items,
        marketplace: params.marketplace,
        isPickup: params.isPickup,
      },
    });
  }

  async markPaid(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    // 3️⃣ подтверждаем списание
    for (const item of order.items as any[]) {
      await this.inventoryService.commitReservation({
        warehouseId: order.warehouseId,
        materialId: item.materialId,
        quantity: item.quantity,
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });
  }

  async cancel(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return;

    // 4️⃣ откат резерва
    for (const item of order.items as any[]) {
      await this.inventoryService.rollbackReservation({
        warehouseId: order.warehouseId,
        materialId: item.materialId,
        quantity: item.quantity,
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async list(companyId: string) {
    return this.prisma.order.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

/**
 * ============================================
 * ORDERS SERVICE
 * ============================================
 */

import { PrismaClient } from '@prisma/client';
import { generateBarcode } from '../utils/barcode.util';

const prisma = new PrismaClient();

export class OrdersService {
  static async create(companyId: string, data: any) {
    let labelUrl = data.labelUrl || null;

    // если самовывоз → генерируем штрихкод
    if (!data.marketplace) {
      labelUrl = await generateBarcode(data.number);
    }

    return prisma.order.create({
      data: {
        ...data,
        labelUrl,
        companyId,
      },
    });
  }

  static async list(companyId: string) {
    return prisma.order.findMany({ where: { companyId } });
  }
}