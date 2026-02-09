/**
 * ============================================
 * ARTIVIO — SAAS CONTROLLER (CORE)
 * File: saas.controller.ts
 * ============================================
 */

import { Controller, Get, Query } from '@nestjs/common';
import { SaasService } from './saas.service';

@Controller('saas')
export class SaasController {
  constructor(private readonly saasService: SaasService) {}

  @Get('info')
  async getCompanyInfo(@Query('companyId') companyId: string) {
    return this.saasService.getCompanyInfo(companyId);
  }
}