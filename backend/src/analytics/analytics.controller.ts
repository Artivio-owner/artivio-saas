/**
 * ============================================
 * ARTIVIO — ANALYTICS CONTROLLER
 * File: analytics.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

/**
 * Guards:
 * - AuthGuard (JWT)
 * - CompanyContextGuard (проставляет req.companyId)
 * Предполагаются существующими
 */

@Controller('analytics')
@UseGuards(/* AuthGuard */)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  /**
   * --------------------------------------------------
   * ФИНАНСОВАЯ СВОДКА
   * --------------------------------------------------
   * GET /analytics/finance?from=2024-01-01&to=2024-01-31
   */
  @Get('finance')
  async finance(
    @Req() req: any,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getFinanceSummary(
      req.companyId,
      new Date(from),
      new Date(to),
    );
  }

  /**
   * --------------------------------------------------
   * KPI ЗАКАЗОВ
   * --------------------------------------------------
   */
  @Get('orders')
  async orders(
    @Req() req: any,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getOrdersKPI(
      req.companyId,
      new Date(from),
      new Date(to),
    );
  }

  /**
   * --------------------------------------------------
   * ПРОИЗВОДСТВО
   * --------------------------------------------------
   */
  @Get('production')
  async production(
    @Req() req: any,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getProductionStats(
      req.companyId,
      new Date(from),
      new Date(to),
    );
  }

  /**
   * --------------------------------------------------
   * СОТРУДНИКИ
   * --------------------------------------------------
   */
  @Get('employees')
  async employees(@Req() req: any) {
    return this.analyticsService.getEmployeesStats(
      req.companyId,
    );
  }
}