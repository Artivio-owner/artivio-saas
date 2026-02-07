/**
 * ============================================
 * ARTIVIO — AUTH MODULE
 * File: auth.module.ts
 * ============================================
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './roles.guard';

import { PrismaModule } from '../prisma/prisma.module';
import { EmployeesModule } from '../employees/employees.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    PrismaModule,

    /**
     * JWT — основа авторизации
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ARTIVIO_SECRET_KEY',
      signOptions: {
        expiresIn: '7d',
      },
    }),

    /**
     * Сотрудники:
     * - роли
     * - права
     */
    EmployeesModule,

    /**
     * Клиенты:
     * - доступ в личный кабинет
     */
    ClientsModule,
  ],
  providers: [
    AuthService,
    RolesGuard,
  ],
  controllers: [
    AuthController,
  ],
  exports: [
    AuthService,
    RolesGuard,
  ],
})
export class AuthModule {}