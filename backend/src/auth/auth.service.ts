/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * File: auth.service.ts
 * ============================================
 */

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { EmployeeRole } from '../employees/employees.service';

/**
 * Тип пользователя в системе
 */
export enum AuthUserType {
  EMPLOYEE = 'employee',
  CLIENT = 'client',
  SUPER_ADMIN = 'super_admin',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ============================================
   * ЛОГИН (УНИВЕРСАЛЬНЫЙ)
   * ============================================
   * Поддерживает:
   * - сотрудников
   * - клиентов
   * - глобального администратора
   */
  async login(email: string, password: string) {
    /**
     * 1. Проверяем супер-админа (net_buzz)
     * Он не принадлежит ни одной компании
     */
    if (email === process.env.SUPER_ADMIN_EMAIL) {
      if (password !== process.env.SUPER_ADMIN_PASSWORD) {
        throw new UnauthorizedException('Неверные данные');
      }

      return this.generateToken({
        id: 'net_buzz',
        role: 'SUPER_ADMIN',
        type: AuthUserType.SUPER_ADMIN,
      });
    }

    /**
     * 2. Проверяем сотрудников
     */
    const employee = await this.prisma.employee.findFirst({
      where: { email },
    });

    if (employee) {
      const valid = await bcrypt.compare(
        password,
        employee.passwordHash,
      );

      if (!valid) {
        throw new UnauthorizedException('Неверные данные');
      }

      return this.generateToken({
        id: employee.id,
        role: employee.role,
        type: AuthUserType.EMPLOYEE,
        companyId: employee.companyId,
      });
    }

    /**
     * 3. Проверяем клиентов
     */
    const client = await this.prisma.client.findFirst({
      where: { email },
    });

    if (client) {
      const valid = await bcrypt.compare(
        password,
        client.passwordHash,
      );

      if (!valid) {
        throw new UnauthorizedException('Неверные данные');
      }

      return this.generateToken({
        id: client.id,
        role: 'CLIENT',
        type: AuthUserType.CLIENT,
        companyId: client.companyId,
      });
    }

    throw new UnauthorizedException('Пользователь не найден');
  }

  /**
   * ============================================
   * РЕГИСТРАЦИЯ СОТРУДНИКА
   * ============================================
   * Используется администратором компании
   */
  async registerEmployee(data: {
    companyId: string;
    email: string;
    password: string;
    name: string;
    role: EmployeeRole;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.employee.create({
      data: {
        companyId: data.companyId,
        email: data.email,
        name: data.name,
        role: data.role,
        passwordHash,
        isActive: true,
      },
    });
  }

  /**
   * ============================================
   * РЕГИСТРАЦИЯ КЛИЕНТА
   * ============================================
   * Используется сайтом и админкой
   */
  async registerClient(data: {
    companyId: string;
    email: string;
    password: string;
    name: string;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.client.create({
      data: {
        companyId: data.companyId,
        email: data.email,
        name: data.name,
        passwordHash,
      },
    });
  }

  /**
   * ============================================
   * ГЕНЕРАЦИЯ JWT
   * ============================================
   */
  private generateToken(payload: {
    id: string;
    role: string;
    type: AuthUserType;
    companyId?: string;
  }) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * ============================================
   * ПРОВЕРКА ДОСТУПА К КОМПАНИИ
   * ============================================
   * SUPER_ADMIN видит всё, но не отображается
   */
  canAccessCompany(
    user: any,
    companyId: string,
  ): boolean {
    if (user.type === AuthUserType.SUPER_ADMIN) {
      return true;
    }

    return user.companyId === companyId;
  }
}