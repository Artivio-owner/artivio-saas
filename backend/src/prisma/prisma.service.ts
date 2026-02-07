/**
 * ============================================
 * ARTIVIO — PRISMA SERVICE
 * File: prisma.service.ts
 * ============================================
 */

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  /**
   * --------------------------------------------
   * ON MODULE INIT
   * --------------------------------------------
   * Establish database connection
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * --------------------------------------------
   * ENABLE SHUTDOWN HOOKS
   * --------------------------------------------
   * Graceful shutdown (PM2 / Docker safe)
   */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * --------------------------------------------
   * MULTI-TENANT PREPARATION
   * --------------------------------------------
   * This method can be extended later to:
   * - switch DATABASE_URL dynamically
   * - support DB per company
   */
  async withCompanyContext<T>(
    companyDatabaseUrl: string,
    callback: (client: PrismaClient) => Promise<T>,
  ): Promise<T> {
    const tenantClient = new PrismaClient({
      datasources: {
        db: {
          url: companyDatabaseUrl,
        },
      },
    });

    try {
      await tenantClient.$connect();
      return await callback(tenantClient);
    } finally {
      await tenantClient.$disconnect();
    }
  }
}