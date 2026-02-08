/**
 * ============================================
 * ARTIVIO — ANALYTICS MODULE
 * File: analytics.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SaasModule } from '../saas/saas.module';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    PrismaModule,
    SaasModule, // проверка тарифов и доступов
  ],
  providers: [
    AnalyticsService,
  ],
  controllers: [
    AnalyticsController,
  ],
  exports: [
    AnalyticsService,
  ],
})
export class AnalyticsModule {}