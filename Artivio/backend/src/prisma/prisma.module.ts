/**
 * ============================================
 * ARTIVIO — PRISMA MODULE
 * File: prisma.module.ts
 * ============================================
 */

import { Global, Module, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { INestApplication } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * --------------------------------------------
   * ENABLE SHUTDOWN HOOKS
   * --------------------------------------------
   */
  async onModuleInit() {
    // This will be called automatically by NestJS
  }

  /**
   * --------------------------------------------
   * ATTACH SHUTDOWN HANDLER
   * --------------------------------------------
   */
  async enableShutdownHooks(app: INestApplication) {
    await this.prismaService.enableShutdownHooks(app);
  }
}