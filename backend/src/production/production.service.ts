/**
 * ============================================
 * ARTIVIO — PRODUCTION SERVICE
 * File: production.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Производственные этапы
 * Порядок важен — используется в очереди и аналитике
 */
export enum ProductionStage {
  CUTTING = 'cutting',           // Распил
  MILLING = 'milling',           // Фрезеровка
  VENEERING = 'veneering',       // Шпонирование
  PAINTING = 'painting',         // Малярка (эмаль / лак)
  DRYING = 'drying',             // Сушка
  PACKAGING = 'packaging',       // Упаковка
}

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ============================================
   * СОЗДАНИЕ ПРОИЗВОДСТВЕННОЙ ЦЕПОЧКИ ДЛЯ ЗАКАЗА
   * ============================================
   *
   * Вызывается при переводе заказа в статус «ПРИНЯТ»
   */
  async createProductionFlow(orderItemId: string, productConfig: any) {
    const stages: ProductionStage[] = [];

    // Распил есть всегда
    stages.push(ProductionStage.CUTTING);

    // Фрезеровка — только если указана в карточке товара
    if (productConfig.requiresMilling) {
      stages.push(ProductionStage.MILLING);
    }

    // Шпон
    if (productConfig.covering === 'veneer') {
      stages.push(ProductionStage.VENEERING);
    }

    // Малярка (лак / эмаль)
    if (['paint', 'lacquer'].includes(productConfig.covering)) {
      stages.push(ProductionStage.PAINTING);
      stages.push(ProductionStage.DRYING);
    }

    // Упаковка — всегда последняя
    stages.push(ProductionStage.PACKAGING);

    // Создаём записи этапов
    for (const stage of stages) {
      await this.prisma.productionStage.create({
        data: {
          orderItemId,
          stage,
          status: 'pending',
        },
      });
    }

    return stages;
  }

  /**
   * ============================================
   * НАЗНАЧЕНИЕ СОТРУДНИКА НА ЭТАП
   * ============================================
   */
  async assignEmployeeToStage(stageId: string, employeeId: string) {
    return this.prisma.productionStage.update({
      where: { id: stageId },
      data: {
        employeeId,
        startedAt: new Date(),
        status: 'in_progress',
      },
    });
  }

  /**
   * ============================================
   * ЗАВЕРШЕНИЕ ЭТАПА
   * ============================================
   */
  async completeStage(stageId: string) {
    return this.prisma.productionStage.update({
      where: { id: stageId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  /**
   * ============================================
   * АНАЛИТИКА ПО СОТРУДНИКУ
   * ============================================
   *
   * Используется:
   * - в админке
   * - для сравнения с «главным мастером»
   */
  async getEmployeePerformance(employeeId: string) {
    const stages = await this.prisma.productionStage.findMany({
      where: {
        employeeId,
        status: 'completed',
      },
    });

    let totalTime = 0;

    for (const stage of stages) {
      if (stage.startedAt && stage.completedAt) {
        totalTime +=
          stage.completedAt.getTime() - stage.startedAt.getTime();
      }
    }

    return {
      employeeId,
      completedStages: stages.length,
      averageTimeMs:
        stages.length > 0 ? totalTime / stages.length : 0,
    };
  }

  /**
   * ============================================
   * ПРОГНОЗ СРОКА ИЗГОТОВЛЕНИЯ
   * ============================================
   *
   * Основан на:
   * - истории заказов
   * - средней скорости по этапам
   * - текущей загрузке линии
   */
  async forecastProductionTime(productId: string) {
    const historicalStages =
      await this.prisma.productionStage.findMany({
        where: {
          orderItem: {
            productId,
          },
          status: 'completed',
        },
      });

    const stageStats: Record<string, number[]> = {};

    for (const stage of historicalStages) {
      if (stage.startedAt && stage.completedAt) {
        const duration =
          stage.completedAt.getTime() - stage.startedAt.getTime();

        if (!stageStats[stage.stage]) {
          stageStats[stage.stage] = [];
        }

        stageStats[stage.stage].push(duration);
      }
    }

    let totalForecastMs = 0;

    for (const durations of Object.values(stageStats)) {
      const avg =
        durations.reduce((a, b) => a + b, 0) / durations.length;
      totalForecastMs += avg;
    }

    return {
      estimatedMs: totalForecastMs,
      estimatedDays: Math.ceil(
        totalForecastMs / (1000 * 60 * 60 * 8),
      ), // 8-часовой рабочий день
    };
  }

  /**
   * ============================================
   * ЗАГРУЖЕННОСТЬ ПРОИЗВОДСТВЕННОЙ ЛИНИИ
   * ============================================
   */
  async getProductionLoad() {
    const activeStages =
      await this.prisma.productionStage.count({
        where: {
          status: 'in_progress',
        },
      });

    const pendingStages =
      await this.prisma.productionStage.count({
        where: {
          status: 'pending',
        },
      });

    return {
      activeStages,
      pendingStages,
      totalLoad: activeStages + pendingStages,
    };
  }
}