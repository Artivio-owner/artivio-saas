/**
 * ============================================
 * ARTIVIO — APP MODULE
 * File: app.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { EmployeesModule } from './employees/employees.module';
import { AccountingModule } from './accounting/accounting.module';

/**
 * В будущем будут добавлены:
 * - OrdersModule
 * - ProductsModule
 * - ProductionModule
 * - SupportModule
 * - SaaS / BillingModule
 */

@Module({
  imports: [
    PrismaModule,

    /**
     * Авторизация и роли
     */
    AuthModule,

    /**
     * CRM
     */
    ClientsModule,

    /**
     * Сотрудники и производство
     */
    EmployeesModule,

    /**
     * Финансы и аналитика
     */
    AccountingModule,
  ],
})
export class AppModule {}