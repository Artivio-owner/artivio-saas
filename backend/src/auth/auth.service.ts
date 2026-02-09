/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return null;
    }

    const payload = {
      id: user.id,
      companyId: user.companyId,
      role: user.role as Role,
    };

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}