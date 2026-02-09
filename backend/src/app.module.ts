/**
 * ============================================
 * ARTIVIO — APP MODULE
 * File: app.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * CORE
 */
import { PrismaModule } from './prisma/prisma.module';

/**
 * AUTH & USERS
 */
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';

/**
 * BUSINESS
 */
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { WarehousesModule } from './warehouses/warehouses.module';

/**
 * ANALYTICS & NOTIFICATIONS
 */
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';

/**
 * SAAS
 */
import { SaasModule } from './saas/saas.module';

@Module({
  imports: [
    /**
     * ENV
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * CORE
     */
    PrismaModule,

    /**
     * AUTH
     */
    AuthModule,
    UsersModule,
    CompaniesModule,

    /**
     * BUSINESS
     */
    ProductsModule,
    OrdersModule,
    WarehousesModule,

    /**
     * ANALYTICS
     */
    AnalyticsModule,

    /**
     * NOTIFICATIONS
     */
    NotificationsModule,

    /**
     * SAAS
     */
    SaasModule,
  ],
})
export class AppModule {}