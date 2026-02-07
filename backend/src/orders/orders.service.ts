/**
 * ============================================
 * ARTIVIO — ORDERS SERVICE
 * File: orders.service.ts
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialsService } from '../materials/materials.service';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',               // в обработке
  ACCEPTED = 'ACCEPTED',                   // принят
  IN_PRODUCTION = 'IN_PRODUCTION',         // в процессе изготовления

  CUTTING = 'CUTTING',                     // распил
  MILLING = 'MILLING',                     // фрезеровка
  VENEERING = 'VENEERING',                 // шпонирование
  PAINTING = 'PAINTING',                   // малярка
  DRYING = 'DRYING',                       // сушка
  PACKAGING = 'PACKAGING',                 // упаковка

  MANUFACTURED = 'MANUFACTURED',           // изготовлен
  WAITING_SHIPMENT = 'WAITING_SHIPMENT',   // ожидает отправки
  WAITING_PICKUP = 'WAITING_PICKUP',       // ожидает получения
  COMPLETED = 'COMPLETED',                 // завершен

  PARTIALLY_MANUFACTURED = 'PARTIALLY_MANUFACTURED',
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private materialsService: MaterialsService,
  ) {}

  /**
   * --------------------------------------------
   * CREATE ORDER (SITE / ADMIN)
   * --------------------------------------------
   */
  async createOrder(companyId: string, data: {
    clientId: string;
    items: { productId: string; quantity: number; vip?: boolean }[];
    deliveryType: 'DELIVERY' | 'PICKUP';
    comment?: string;
  }) {
    return this.prisma.order.create({
      data: {
        companyId,
        clientId: data.clientId,
        status: OrderStatus.PROCESSING,
        deliveryType: data.deliveryType,
        comment: data.comment,
        items: {
          create: data.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            isVip: i.vip ?? false,
            status: OrderStatus.PROCESSING,
          })),
        },
      },
      include: { items: true },
    });
  }

  /**
   * --------------------------------------------
   * ACCEPT ORDER
   * - списываем материалы
   * - рассчитываем сроки
   * --------------------------------------------
   */
  async acceptOrder(orderId: string, companyId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, companyId },
      include: {
        items: {
          include: {
            product: {
              include: { materials: true },
            },
          },
        },
      },
    });

    if (!order) throw new BadRequestException('Order not found');

    // списание материалов
    for (const item of order.items) {
      for (const material of item.product.materials) {
        await this.materialsService.updateStock(
          material.materialId,
          companyId,
          -material.avgConsumption * item.quantity,
        );
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    });
  }

  /**
   * --------------------------------------------
   * UPDATE ITEM STATUS
   * --------------------------------------------
   */
  async updateItemStatus(
    orderItemId: string,
    status: OrderStatus,
  ) {
    await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status },
    });

    return this.recalculateOrderStatus(orderItemId);
  }

  /**
   * --------------------------------------------
   * RECALCULATE ORDER STATUS
   * --------------------------------------------
   */
  private async recalculateOrderStatus(orderItemId: string) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: { include: { items: true } } },
    });

    const statuses = item.order.items.map(i => i.status);

    let newStatus = OrderStatus.IN_PRODUCTION;

    if (statuses.every(s => s === OrderStatus.MANUFACTURED)) {
      newStatus = OrderStatus.MANUFACTURED;
    }

    if (statuses.some(s => s === OrderStatus.MANUFACTURED)) {
      newStatus = OrderStatus.PARTIALLY_MANUFACTURED;
    }

    await this.prisma.order.update({
      where: { id: item.orderId },
      data: { status: newStatus },
    });
  }
}