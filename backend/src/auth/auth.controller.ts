/**
 * ============================================
 * ARTIVIO — AUTH CONTROLLER
 * File: auth.controller.ts
 * ============================================
 */

import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { EmployeeRole } from '../employees/employees.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * --------------------------------------------------
   * ЛОГИН (УНИВЕРСАЛЬНЫЙ)
   * --------------------------------------------------
   * Поддерживает:
   * - сотрудников
   * - клиентов
   * - супер-админа
   */
  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.login(
      body.email,
      body.password,
    );
  }

  /**
   * --------------------------------------------------
   * РЕГИСТРАЦИЯ СОТРУДНИКА
   * --------------------------------------------------
   * Используется администратором компании
   */
  @Post('register/employee')
  async registerEmployee(
    @Body()
    body: {
      companyId: string;
      email: string;
      password: string;
      name: string;
      role: EmployeeRole;
    },
  ) {
    return this.authService.registerEmployee(body);
  }

  /**
   * --------------------------------------------------
   * РЕГИСТРАЦИЯ КЛИЕНТА
   * --------------------------------------------------
   * Используется сайтом
   */
  @Post('register/client')
  async registerClient(
    @Body()
    body: {
      companyId: string;
      email: string;
      password: string;
      name: string;
    },
  ) {
    return this.authService.registerClient(body);
  }
}