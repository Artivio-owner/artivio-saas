/**
 * ============================================
 * ARTIVIO — DOMAINS MODULE
 * File: domains.module.ts
 * ============================================
 */

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { PrismaService } from '../prisma/prisma.service';
import { TenantMiddleware } from './tenant.middleware';

@Module({
  providers: [DomainsService, PrismaService],
  exports: [DomainsService],
})
export class DomainsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}