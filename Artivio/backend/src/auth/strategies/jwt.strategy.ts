/**
 * ============================================
 * ARTIVIO — JWT STRATEGY
 * File: jwt.strategy.ts
 * ============================================
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';

interface JwtPayload {
  userId: string;
  companyId: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * --------------------------------------------
   * VALIDATE JWT PAYLOAD
   * --------------------------------------------
   * This method runs on every protected request
   */
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    /**
     * --------------------------------------------
     * RETURNED OBJECT WILL BE AVAILABLE AS:
     * request.user
     * --------------------------------------------
     */
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyId: user.companyId,
    };
  }
}