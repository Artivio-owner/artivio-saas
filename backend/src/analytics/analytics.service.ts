/**
 * ============================================
 * ARTIVIO — ANALYTICS SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../orders/order.entity';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async orders(companyId: string) {
    const totalOrders = await this.prisma.order.count({ where: { companyId } });
    const completedOrders = await this.prisma.order.count({
      where: { companyId, status: OrderStatus.COMPLETED },
    });
    const cancelledOrders = await this.prisma.order.count({
      where: { companyId, status: OrderStatus.CANCELLED },
    });

    return {
      totalOrders,
      completedOrders,
      cancelledOrders,
    };
  }

  async revenue(companyId: string) {
    const orders = await this.prisma.order.findMany({
      where: { companyId, status: OrderStatus.COMPLETED },
      select: { totalAmount: true },
    });

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );

    return {
      totalRevenue,
      averageOrderValue:
        orders.length > 0 ? totalRevenue / orders.length : 0,
    };
  }

  async warehouses(companyId: string) {
    const totalWarehouses = await this.prisma.warehouse.count({
      where: { companyId },
    });

    const inventory = await this.prisma.inventory.findMany({
      where: {
        warehouse: { companyId },
      },
      include: { material: true },
    });

    const lowStockItems = inventory.filter(
      (i) => i.quantity <= i.material.criticalStock,
    ).length;

    return {
      totalWarehouses,
      totalStockItems: inventory.length,
      lowStockItems,
    };
  }

  async saasUsage(companyId: string) {
    const warehousesUsed = await this.prisma.warehouse.count({
      where: { companyId },
    });
    const productsUsed = await this.prisma.material.count({
      where: { companyId },
    });
    const usersUsed = await this.prisma.user.count({
      where: { companyId },
    });

    return {
      warehousesUsed,
      productsUsed,
      usersUsed,
    };
  }
}