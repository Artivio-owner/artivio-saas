/**
 * ============================================
 * ARTIVIO — EMPLOYEES SERVICE
 * File: employees.service.ts
 * ============================================
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Роли сотрудников
 */
export enum EmployeeRole {
  ADMIN = 'admin',            // Администратор компании
  MANAGER = 'manager',        // Менеджер заказов
  MASTER = 'master',          // Мастер производства
  INTERN = 'intern',          // Стажёр
  CHIEF_MASTER = 'chief_master', // Главный мастер (эталон)
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ============================================
   * СОЗДАНИЕ СОТРУДНИКА
   * ============================================
   */
  async createEmployee(data: {
    name: string;
    role: EmployeeRole;
    companyId: string;
  }) {
    return this.prisma.employee.create({
      data: {
        name: data.name,
        role: data.role,
        companyId: data.companyId,
        isActive: true,
      },
    });
  }

  /**
   * ============================================
   * ПРОВЕРКА ПРАВ ДОСТУПА
   * ============================================
   */
  checkAccess(
    employeeRole: EmployeeRole,
    allowedRoles: EmployeeRole[],
  ) {
    if (!allowedRoles.includes(employeeRole)) {
      throw new ForbiddenException(
        'Недостаточно прав для выполнения действия',
      );
    }
  }

  /**
   * ============================================
   * АНАЛИТИКА ПО СОТРУДНИКУ
   * ============================================
   *
   * Показатели:
   * - кол-во этапов
   * - среднее время
   * - изготовленные изделия
   */
  async getEmployeeAnalytics(employeeId: string) {
    const stages = await this.prisma.productionStage.findMany({
      where: {
        employeeId,
        status: 'completed',
      },
      include: {
        orderItem: true,
      },
    });

    let totalTimeMs = 0;
    const uniqueItems = new Set<string>();

    for (const stage of stages) {
      if (stage.startedAt && stage.completedAt) {
        totalTimeMs +=
          stage.completedAt.getTime() - stage.startedAt.getTime();
      }

      if (stage.orderItemId) {
        uniqueItems.add(stage.orderItemId);
      }
    }

    return {
      employeeId,
      completedStages: stages.length,
      completedItems: uniqueItems.size,
      averageStageTimeMs:
        stages.length > 0 ? totalTimeMs / stages.length : 0,
    };
  }

  /**
   * ============================================
   * РАСЧЁТ ЗАРАБОТКА МАСТЕРА
   * ============================================
   *
   * Формула:
   * 5% от себестоимости товара * кол-во изделий
   */
  async calculateMonthlyEarnings(
    employeeId: string,
    month: number,
    year: number,
  ) {
    const completedItems =
      await this.prisma.orderItem.findMany({
        where: {
          productionStages: {
            some: {
              employeeId,
              status: 'completed',
            },
          },
          order: {
            completedAt: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
        },
        include: {
          product: true,
        },
      });

    let totalEarnings = 0;

    for (const item of completedItems) {
      if (item.product?.costPrice) {
        totalEarnings += item.product.costPrice * 0.05;
      }
    }

    return {
      employeeId,
      month,
      year,
      itemsCompleted: completedItems.length,
      earnings: totalEarnings,
    };
  }

  /**
   * ============================================
   * СРАВНЕНИЕ С ГЛАВНЫМ МАСТЕРОМ
   * ============================================
   */
  async compareWithChiefMaster(employeeId: string) {
    const chiefMaster = await this.prisma.employee.findFirst({
      where: {
        role: EmployeeRole.CHIEF_MASTER,
        isActive: true,
      },
    });

    if (!chiefMaster) {
      throw new Error('Главный мастер не назначен');
    }

    const employeeStats = await this.getEmployeeAnalytics(employeeId);
    const chiefStats = await this.getEmployeeAnalytics(chiefMaster.id);

    return {
      employee: employeeStats,
      chiefMaster: chiefStats,
      delayRatio:
        chiefStats.averageStageTimeMs > 0
          ? employeeStats.averageStageTimeMs /
            chiefStats.averageStageTimeMs
          : null,
    };
  }
}