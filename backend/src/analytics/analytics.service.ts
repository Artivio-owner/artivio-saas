/**
 * ============================================
 * ARTIVIO — ANALYTICS SERVICE
 * File: analytics.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TariffsService } from '../saas/tariffs.service';
import { AddonModule } from '../saas/saas.types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tariffsService: TariffsService,
  ) {}

  /**
   * --------------------------------------------------
   * ОБЩАЯ ФИНАНСОВАЯ СВОДКА
   * --------------------------------------------------
   */
  async getFinanceSummary(
    companyId: string,
    from: Date,
    to: Date,
  ) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.ANALYTICS,
    );

    const orders = await this.prisma.order.findMany({
      where: {
        companyId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      select: {
        totalPrice: true,
        costPrice: true,
      },
    });

    const revenue = orders.reduce(
      (sum, o) => sum + o.totalPrice,
      0,
    );

    const cost = orders.reduce(
      (sum, o) => sum + (o.costPrice || 0),
      0,
    );

    return {
      revenue,
      cost,
      profit: revenue - cost,
    };
  }

  /**
   * --------------------------------------------------
   * KPI ПО ЗАКАЗАМ
   * --------------------------------------------------
   */
  async getOrdersKPI(
    companyId: string,
    from: Date,
    to: Date,
  ) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.ANALYTICS,
    );

    const totalOrders = await this.prisma.order.count({
      where: {
        companyId,
        createdAt: { gte: from, lte: to },
      },
    });

    const completedOrders = await this.prisma.order.count({
      where: {
        companyId,
        status: 'COMPLETED',
        createdAt: { gte: from, lte: to },
      },
    });

    return {
      totalOrders,
      completedOrders,
      completionRate:
        totalOrders > 0
          ? completedOrders / totalOrders
          : 0,
    };
  }

  /**
   * --------------------------------------------------
   * ПРОИЗВОДСТВО
   * --------------------------------------------------
   */
  async getProductionStats(
    companyId: string,
    from: Date,
    to: Date,
  ) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.ANALYTICS,
    );

    const tasks = await this.prisma.productionTask.findMany({
      where: {
        companyId,
        createdAt: { gte: from, lte: to },
      },
      select: {
        status: true,
      },
    });

    const total = tasks.length;
    const completed = tasks.filter(
      (t) => t.status === 'DONE',
    ).length;

    return {
      totalTasks: total,
      completedTasks: completed,
      efficiency:
        total > 0 ? completed / total : 0,
    };
  }

  /**
   * --------------------------------------------------
   * СОТРУДНИКИ
   * --------------------------------------------------
   */
  async getEmployeesStats(companyId: string) {
    await this.tariffsService.ensureModuleAccess(
      companyId,
      AddonModule.ANALYTICS,
    );

    const employees = await this.prisma.employee.findMany({
      where: { companyId },
      select: {
        id: true,
        isActive: true,
      },
    });

    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(
        (e) => e.isActive,
      ).length,
    };
  }
}