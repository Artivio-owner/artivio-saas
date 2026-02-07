/**
 * ============================================
 * ARTIVIO — ORDERS SERVICE
 * File: orders.service.ts
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { MaterialsService } from '../materials/materials.service';
import { ProductionService } from '../production/production.service';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

/**
 * Все возможные статусы заказа
 * (отображаются и в админке, и у клиента)
 */
export enum OrderStatus {
  PROCESSING = 'processing',                // в обработке (до принятия)
  ACCEPTED = 'accepted',                    // принят
  IN_PRODUCTION = 'in_production',          // в процессе изготовления
  PARTIALLY_MANUFACTURED = 'partial',       // частично изготовлен
  MANUFACTURED = 'manufactured',            // изготовлен
  WAITING_FOR_SHIPMENT = 'waiting_shipment',// ожидает отправки
  WAITING_FOR_PICKUP = 'waiting_pickup',    // ожидает получения
  SHIPPED = 'shipped',                      // передан в доставку
  COMPLETED = 'completed',                  // завершён
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private materialsService: MaterialsService,
    private productionService: ProductionService,
  ) {}

  /**
   * ============================================
   * СОЗДАНИЕ ЗАКАЗА
   * ============================================
   * - может быть создан пользователем
   * - или вручную администратором / менеджером
   */
  async createOrder(data: {
    companyId: string;
    clientId: string;
    items: { productId: string; quantity: number; isVip?: boolean }[];
    deliveryType: 'delivery' | 'pickup';
    createdByAdmin?: boolean;
  }) {
    const now = dayjs();

    const order = await this.prisma.order.create({
      data: {
        companyId: data.companyId,
        clientId: data.clientId,
        status: OrderStatus.PROCESSING,
        deliveryType: data.deliveryType,
        createdByAdmin: data.createdByAdmin ?? false,
        createdAt: now.toDate(),
      },
    });

    /**
     * Добавляем товары в заказ
     */
    for (const item of data.items) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          isVip: item.isVip ?? false,
          status: OrderStatus.PROCESSING,
        },
      });
    }

    return order;
  }

  /**
   * ============================================
   * ПРИНЯТИЕ ЗАКАЗА В РАБОТУ
   * ============================================
   * - списываем материалы
   * - рассчитываем срок изготовления
   * - учитываем очередь
   */
  async acceptOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new BadRequestException('Заказ не найден');

    /**
     * Списание материалов происходит
     * ТОЛЬКО при статусе "принят"
     */
    for (const item of order.items) {
      await this.materialsService.reserveMaterialsForProduct(
        item.productId,
        item.quantity,
      );
    }

    /**
     * Расчёт сроков изготовления
     */
    const productionDates = await this.calculateProductionDates(order);

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.ACCEPTED,
        acceptedAt: new Date(),
        plannedStartAt: productionDates.start.toDate(),
        plannedFinishAt: productionDates.finish.toDate(),
      },
    });

    /**
     * Добавляем заказ в производственную очередь
     */
    await this.productionService.enqueueOrder(orderId);

    return { success: true };
  }

  /**
   * ============================================
   * РАСЧЁТ СРОКОВ ИЗГОТОВЛЕНИЯ
   * ============================================
   * Учитывает:
   * - время заказа (после 16:00 +1 день)
   * - выходные
   * - очередь
   * - VIP
   * - материалы (+Х дней)
   */
  async calculateProductionDates(order: any) {
    let start = dayjs();

    /**
     * Если заказ после 16:00 — начинаем со следующего дня
     * (НЕ отображается пользователю)
     */
    if (start.hour() >= 16) {
      start = start.add(1, 'day').startOf('day');
    }

    /**
     * Если выходные — перенос на понедельник
     */
    while (start.day() === 0 || start.day() === 6) {
      start = start.add(1, 'day');
    }

    /**
     * Базовый срок изготовления (усреднённый)
     */
    let totalDays = await this.productionService.getAverageProductionDays(
      order.companyId,
    );

    /**
     * Очередь производства
     * (10 принятых заказов = +5 дней)
     */
    const queueDays =
      await this.productionService.getQueueAdditionalDays(order.companyId);

    totalDays += queueDays;

    /**
     * Материалы "под заказ"
     */
    const materialsExtraDays =
      await this.materialsService.getExtraDaysForOrder(order.id);

    totalDays += materialsExtraDays;

    /**
     * VIP-заказ уменьшает срок
     */
    const hasVip = order.items.some((i) => i.isVip);
    if (hasVip) {
      totalDays -= 2; // дефолт, администратор может изменить вручную
    }

    const finish = start.add(totalDays, 'day');

    return { start, finish };
  }

  /**
   * ============================================
   * ОБНОВЛЕНИЕ СТАТУСА ЭЛЕМЕНТА ЗАКАЗА
   * ============================================
   * Используется в производственной линии
   */
  async updateOrderItemStatus(
    orderItemId: string,
    status: OrderStatus,
  ) {
    const item = await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status },
    });

    /**
     * Проверяем частичное изготовление
     */
    const items = await this.prisma.orderItem.findMany({
      where: { orderId: item.orderId },
    });

    const manufacturedCount = items.filter(
      (i) => i.status === OrderStatus.MANUFACTURED,
    ).length;

    if (manufacturedCount > 0 && manufacturedCount < items.length) {
      await this.prisma.order.update({
        where: { id: item.orderId },
        data: { status: OrderStatus.PARTIALLY_MANUFACTURED },
      });
    }

    if (manufacturedCount === items.length) {
      await this.prisma.order.update({
        where: { id: item.orderId },
        data: { status: OrderStatus.MANUFACTURED },
      });
    }

    return item;
  }

  /**
   * ============================================
   * ЗАВЕРШЕНИЕ ЗАКАЗА
   * ============================================
   */
  async completeOrder(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }
}