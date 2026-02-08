/**
 * ============================================
 * ARTIVIO — SUPER ADMIN CONTROLLER
 * File: super-admin.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { TariffsService } from './tariffs.service';
import { TariffPlan } from './saas.types';

/**
 * Guards:
 * - AuthGuard (JWT)
 * - RolesGuard (SUPER_ADMIN)
 * Предполагаются существующими в AuthModule
 */

@Controller('super-admin')
@UseGuards(/* AuthGuard, RolesGuard */)
export class SuperAdminController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly tariffsService: TariffsService,
  ) {}

  /**
   * --------------------------------------------------
   * СПИСОК ВСЕХ КОМПАНИЙ
   * --------------------------------------------------
   */
  @Get('companies')
  async getCompanies() {
    return this.companiesService.getAllCompanies();
  }

  /**
   * --------------------------------------------------
   * СОЗДАНИЕ КОМПАНИИ (РУЧНО)
   * --------------------------------------------------
   */
  @Post('companies')
  async createCompany(
    @Body()
    body: {
      name: string;
      domain?: string;
    },
  ) {
    return this.companiesService.createCompany(body);
  }

  /**
   * --------------------------------------------------
   * ИЗМЕНЕНИЕ ТАРИФА
   * --------------------------------------------------
   */
  @Patch('companies/:id/tariff')
  async setTariff(
    @Param('id') companyId: string,
    @Body()
    body: {
      plan: TariffPlan;
    },
  ) {
    return this.companiesService.setTariff(
      companyId,
      body.plan,
    );
  }

  /**
   * --------------------------------------------------
   * ВКЛЮЧЕНИЕ / ВЫКЛЮЧЕНИЕ КОМПАНИИ
   * --------------------------------------------------
   */
  @Patch('companies/:id/status')
  async setCompanyStatus(
    @Param('id') companyId: string,
    @Body()
    body: {
      isActive: boolean;
    },
  ) {
    return this.companiesService.setCompanyStatus(
      companyId,
      body.isActive,
    );
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА ДОСТУПА К МОДУЛЮ (ДЛЯ UI)
   * --------------------------------------------------
   */
  @Get('companies/:id/access/:module')
  async checkModuleAccess(
    @Param('id') companyId: string,
    @Param('module') module: string,
  ) {
    return {
      access: await this.tariffsService.canUseModule(
        companyId,
        module as any,
      ),
    };
  }
}