/**
 * ============================================
 * ARTIVIO — ORDERS SERVICE
 * File: orders.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../auth/guards/roles.guard';

export enum OrderStatus {
  NEW = 'new',
  IN_PROCESS = 'in_process',
  ACCEPTED = 'accepted',
  IN_PRODUCTION = 'in_production',
  PAINTING = 'painting',
  DRYING = 'drying',
  PRODUCED = 'produced',
  PARTIALLY_PRODUCED = 'partially_produced',
  WAITING_FOR_SHIPMENT = 'waiting_for_shipment',
  WAITING_FOR_PICKUP = 'waiting_for_pickup',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * --------------------------------------------
   * LIST ORDERS BY COMPANY
   * --------------------------------------------
   */
  async listOrders(companyId: string) {
    return this.prisma.order.findMany({
      where: { companyId },
      include: {
        items: true,
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * --------------------------------------------
   * CREATE ORDER (SITE OR ADMIN)
   * --------------------------------------------
   */
  async createOrder(data: {
    companyId: string;
    clientId: string;
    items: any[];
    isVip?: boolean;
    createdByRole?: UserRole;
  }) {
    const baseDays = 10;
    let extraDays = 0;

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sun, 6 = Sat

    // после 16:00 — перенос
    if (hour >= 16) extraDays += 1;

    // выходные — перенос на понедельник
    if (day === 0) extraDays += 1;
    if (day === 6) extraDays += 2;

    // VIP уменьшает срок
    if (data.isVip) extraDays -= 2;

    const productionDays = Math.max(baseDays + extraDays, 1);

    return this.prisma.order.create({
      data: {
        companyId: data.companyId,
        clientId: data.clientId,
        status: OrderStatus.IN_PROCESS,
        isVip: !!data.isVip,
        productionDays,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            status: OrderStatus.NEW,
          })),
        },
      },
    });
  }

  /**
   * --------------------------------------------
   * ACCEPT ORDER
   * --------------------------------------------
   * Manual admin action
   */
  async acceptOrder(
    orderId: string,
    companyId: string,
    productionDays?: number,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, companyId },
    });

    if (!order) throw new ForbiddenException();

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.ACCEPTED,
        productionDays:
          productionDays ?? order.productionDays,
      },
    });
  }

  /**
   * --------------------------------------------
   * UPDATE ITEM STATUS
   * --------------------------------------------
   */
  async updateItemStatus(
    itemId: string,
    status: OrderStatus,
    companyId: string,
  ) {
    const item = await this.prisma.orderItem.findFirst({
      where: {
        id: itemId,
        order: { companyId },
      },
      include: { order: true },
    });

    if (!item) throw new ForbiddenException();

    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });

    // Проверяем общий статус заказа
    const items = await this.prisma.orderItem.findMany({
      where: { orderId: item.orderId },
    });

    const produced = items.filter(
      (i) => i.status === OrderStatus.PRODUCED,
    );

    let orderStatus = OrderStatus.IN_PRODUCTION;

    if (produced.length === items.length) {
      orderStatus = OrderStatus.PRODUCED;
    } else if (produced.length > 0) {
      orderStatus = OrderStatus.PARTIALLY_PRODUCED;
    }

    await this.prisma.order.update({
      where: { id: item.orderId },
      data: { status: orderStatus },
    });

    return true;
  }

  /**
   * --------------------------------------------
   * MARK ORDER AS COMPLETED
   * --------------------------------------------
   */
  async completeOrder(orderId: string, companyId: string) {
    return this.prisma.order.updateMany({
      where: { id: orderId, companyId },
      data: { status: OrderStatus.COMPLETED },
    });
  }
}