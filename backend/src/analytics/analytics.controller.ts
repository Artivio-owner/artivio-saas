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
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { StockMovementType } from '../warehouses/warehouses.types';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  /**
   * ------------------------------------------------
   * ORDERS TURNOVER
   * ------------------------------------------------
   */
  @Get('orders/turnover')
  async getOrdersTurnover(
    @Query('companyId') companyId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getOrdersTurnover({
      companyId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  /**
   * ------------------------------------------------
   * WAREHOUSE STOCK SUMMARY
   * ------------------------------------------------
   */
  @Get('warehouses/stocks')
  async getWarehouseStocks(
    @Query('companyId') companyId: string,
  ) {
    return this.analyticsService.getWarehouseStockSummary(
      companyId,
    );
  }

  /**
   * ------------------------------------------------
   * STOCK MOVEMENTS
   * ------------------------------------------------
   */
  @Get('warehouses/movements')
  async getStockMovements(
    @Query('companyId') companyId: string,
    @Query('type') type?: StockMovementType,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getStockMovements({
      companyId,
      type,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }
}