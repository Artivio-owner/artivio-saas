/**
 * ============================================
 * ARTIVIO — SAAS CONTROLLER
 * ============================================
 */

import { Controller, Get, Query } from '@nestjs/common';
import { SaasService } from './saas.service';

@Controller('saas')
export class SaasController {
  constructor(private readonly saasService: SaasService) {}

  @Get('plan')
  async getPlan(@Query('companyId') companyId: string) {
    const plan = await this.saasService.getCompanyPlan(companyId);
    const limits = this.saasService.getLimits(plan);

    return {
      plan,
      limits,
    };
  }
}