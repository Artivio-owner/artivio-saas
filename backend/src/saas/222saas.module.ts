/**
 * ============================================
 * ARTIVIO — SAAS MODULE
 * File: saas.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { CompaniesService } from './companies.service';
import { TariffsService } from './tariffs.service';
import { SuperAdminController } from './super-admin.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  providers: [
    CompaniesService,
    TariffsService,
  ],
  controllers: [
    SuperAdminController,
  ],
  exports: [
    CompaniesService,
    TariffsService,
  ],
})
export class SaasModule {}