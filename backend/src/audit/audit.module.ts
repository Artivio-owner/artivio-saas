/**
 * ============================================
 * ARTIVIO — AUDIT MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditService } from './audit.service';
import { AuditInterceptor } from './audit.interceptor';
import { AuditController } from './audit.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuditController],
  providers: [
    AuditService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AuditModule {}