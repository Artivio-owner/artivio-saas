/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * File: auth.service.ts
 * ============================================
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  userId: string;
  companyId: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * --------------------------------------------
   * LOGIN BY EMAIL + PASSWORD
   * --------------------------------------------
   */
  async loginWithEmail(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  /**
   * --------------------------------------------
   * PREPARE LOGIN BY PHONE (SMS)
   * --------------------------------------------
   * Реальная отправка SMS будет подключена позже
   * через smsc.ru / smsgorod.ru
   */
  async requestSmsCode(phone: string) {
    // Проверяем пользователя
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Генерируем код (заглушка, позже подключим сервис)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Сохраняем код (упрощённо)
    await this.prisma.smsCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 минут
      },
    });

    return { success: true };
  }

  /**
   * --------------------------------------------
   * CONFIRM SMS CODE
   * --------------------------------------------
   */
  async confirmSmsCode(phone: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid code');
    }

    const record = await this.prisma.smsCode.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    return this.buildAuthResponse(user);
  }

  /**
   * --------------------------------------------
   * JWT GENERATION
   * --------------------------------------------
   */
  private buildAuthResponse(user: any) {
    const payload: JwtPayload = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }
}