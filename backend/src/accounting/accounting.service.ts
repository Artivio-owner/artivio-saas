/**
 * ============================================
 * ARTIVIO — ACCOUNTING SERVICE
 * File: accounting.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * --------------------------------------------------
   * ВЫРУЧКА
   * --------------------------------------------------
   * Сумма оплаченных завершённых заказов
   */
  async getRevenue(companyId: string, from: Date, to: Date) {
    const result = await this.prisma.order.aggregate({
      where: {
        companyId,
        status: 'COMPLETED',
        paidAt: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        totalPrice: true,
      },
    });

    return result._sum.totalPrice || 0;
  }

  /**
   * --------------------------------------------------
   * ПРЯМЫЕ ЗАТРАТЫ
   * --------------------------------------------------
   * Себестоимость товаров в завершённых заказах
   */
  async getDirectCosts(companyId: string, from: Date, to: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        companyId,
        status: 'COMPLETED',
        paidAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    let total = 0;

    for (const order of orders) {
      for (const item of order.items) {
        total += (item.product.costPrice || 0) * item.quantity;
      }
    }

    return total;
  }

  /**
   * --------------------------------------------------
   * РАСХОДЫ
   * --------------------------------------------------
   * Административные, маркетинг, аренда и т.д.
   */
  async getExpenses(companyId: string, from: Date, to: Date) {
    const result = await this.prisma.expense.aggregate({
      where: {
        companyId,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * --------------------------------------------------
   * ВАЛОВАЯ ПРИБЫЛЬ
   * --------------------------------------------------
   */
  async getGrossProfit(companyId: string, from: Date, to: Date) {
    const revenue = await this.getRevenue(companyId, from, to);
    const directCosts = await this.getDirectCosts(companyId, from, to);

    return revenue - directCosts;
  }

  /**
   * --------------------------------------------------
   * ЧИСТАЯ ПРИБЫЛЬ
   * --------------------------------------------------
   */
  async getNetProfit(companyId: string, from: Date, to: Date) {
    const grossProfit = await this.getGrossProfit(companyId, from, to);
    const expenses = await this.getExpenses(companyId, from, to);

    return grossProfit - expenses;
  }

  /**
   * --------------------------------------------------
   * ПРОГНОЗ
   * --------------------------------------------------
   * Основан на среднем значении прошлых периодов
   */
  async getForecast(companyId: string, months = 3) {
    const now = new Date();
    const start = new Date();
    start.setMonth(now.getMonth() - months);

    const revenue = await this.getRevenue(companyId, start, now);

    return {
      forecastMonthlyRevenue: revenue / months,
    };
  }

  /**
   * --------------------------------------------------
   * ОТКЛОНЕНИЕ ОТ ПРОГНОЗА
   * --------------------------------------------------
   */
  async getForecastDeviation(
    companyId: string,
    from: Date,
    to: Date,
  ) {
    const forecast = await this.getForecast(companyId);
    const actual = await this.getRevenue(companyId, from, to);

    return {
      forecast: forecast.forecastMonthlyRevenue,
      actual,
      deviation: actual - forecast.forecastMonthlyRevenue,
    };
  }

  /**
   * --------------------------------------------------
   * АНАЛИТИКА ПО ТОВАРАМ
   * --------------------------------------------------
   */
  async getProductAnalytics(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
      include: {
        orderItems: true,
      },
    });

    return products.map((product) => {
      const soldQuantity = product.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const revenue = soldQuantity * product.price;
      const costs = soldQuantity * (product.costPrice || 0);

      return {
        productId: product.id,
        name: product.name,
        soldQuantity,
        revenue,
        costs,
        profit: revenue - costs,
      };
    });
  }
}