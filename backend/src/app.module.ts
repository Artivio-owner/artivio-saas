/**
 * ============================================
 * ARTIVIO BACKEND — ROOT MODULE
 * File: app.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';

import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    /**
     * --------------------------------------------
     * CONFIG
     * --------------------------------------------
     * Loads .env
     * Global access to process.env
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * --------------------------------------------
     * DATABASE (PRISMA)
     * --------------------------------------------
     */
    PrismaModule,

    /**
     * --------------------------------------------
     * CORE MODULES
     * --------------------------------------------
     */
    AuthModule,
    UsersModule,
    CompaniesModule,
  ],

  providers: [
    /**
     * --------------------------------------------
     * GLOBAL GUARDS
     * --------------------------------------------
     * Role-based access control
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}