/**
 * ============================================
 * ARTIVIO — AUTH MODULE
 * ============================================
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { SuperAdminController } from './super-admin.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'artivio_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, SuperAdminController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}