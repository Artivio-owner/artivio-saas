/**
 * ============================================
 * ARTIVIO — ACCOUNTING CONTROLLER
 * File: accounting.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';

import { AccountingService } from './accounting.service';

@Controller('accounting')
export class AccountingController {
  constructor(
    private readonly accountingService: AccountingService,
  ) {}

  /**
   * --------------------------------------------------
   * СВОДКА (выручка / прибыль / расходы)
   * --------------------------------------------------
   */
  @Get('summary/:companyId')
  async getSummary(
    @Param('companyId') companyId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const start = new Date(from);
    const end = new Date(to);

    const revenue =
      await this.accountingService.getRevenue(companyId, start, end);

    const directCosts =
      await this.accountingService.getDirectCosts(companyId, start, end);

    const expenses =
      await this.accountingService.getExpenses(companyId, start, end);

    const grossProfit =
      await this.accountingService.getGrossProfit(companyId, start, end);

    const netProfit =
      await this.accountingService.getNetProfit(companyId, start, end);

    return {
      revenue,
      directCosts,
      expenses,
      grossProfit,
      netProfit,
    };
  }

  /**
   * --------------------------------------------------
   * ПРОГНОЗ И ОТКЛОНЕНИЕ
   * --------------------------------------------------
   */
  @Get('forecast/:companyId')
  async getForecast(
    @Param('companyId') companyId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const start = new Date(from);
    const end = new Date(to);

    return this.accountingService.getForecastDeviation(
      companyId,
      start,
      end,
    );
  }

  /**
   * --------------------------------------------------
   * АНАЛИТИКА ПО ТОВАРАМ
   * --------------------------------------------------
   */
  @Get('products/:companyId')
  async getProductAnalytics(
    @Param('companyId') companyId: string,
  ) {
    return this.accountingService.getProductAnalytics(companyId);
  }

  /**
   * --------------------------------------------------
   * ВЫРУЧКА (для графиков)
   * --------------------------------------------------
   */
  @Get('revenue/:companyId')
  async getRevenue(
    @Param('companyId') companyId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return {
      revenue: await this.accountingService.getRevenue(
        companyId,
        new Date(from),
        new Date(to),
      ),
    };
  }
}