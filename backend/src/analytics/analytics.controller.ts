/**
 * ============================================
 * ARTIVIO — ANALYTICS CONTROLLER
 * ============================================
 */

import { Controller, Get, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TenantRequest } from '../domains/tenant.middleware';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('orders')
  orders(@Req() req: TenantRequest) {
    return this.analyticsService.orders(req.companyId!);
  }

  @Get('revenue')
  revenue(@Req() req: TenantRequest) {
    return this.analyticsService.revenue(req.companyId!);
  }

  @Get('warehouses')
  warehouses(@Req() req: TenantRequest) {
    return this.analyticsService.warehouses(req.companyId!);
  }

  @Get('saas')
  saas(@Req() req: TenantRequest) {
    return this.analyticsService.saasUsage(req.companyId!);
  }
}