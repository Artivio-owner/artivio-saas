/**
 * ============================================
 * ARTIVIO — USERS SERVICE
 * File: users.service.ts
 * ============================================
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../auth/guards/roles.guard';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * --------------------------------------------
   * FIND USER BY EMAIL
   * --------------------------------------------
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * --------------------------------------------
   * FIND USER BY ID
   * --------------------------------------------
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * --------------------------------------------
   * CREATE USER (CLIENT / STAFF)
   * --------------------------------------------
   */
  async createUser(data: {
    email?: string;
    phone?: string;
    password?: string;
    role: UserRole;
    companyId: string;
  }) {
    if (!data.email && !data.phone) {
      throw new BadRequestException(
        'User must have email or phone',
      );
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 10)
      : null;

    return this.prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: data.role,
        companyId: data.companyId,
        isActive: true,

        /**
         * --------------------------------------------
         * CLIENT LABELS
         * --------------------------------------------
         * NEW_CLIENT assigned automatically
         */
        clientLabel: 'NEW_CLIENT',
      },
    });
  }

  /**
   * --------------------------------------------
   * UPDATE USER ROLE (ADMIN ONLY)
   * --------------------------------------------
   */
  async updateRole(
    userId: string,
    role: UserRole,
    companyId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  /**
   * --------------------------------------------
   * SET CLIENT LABEL (VIP, etc.)
   * --------------------------------------------
   */
  async setClientLabel(
    userId: string,
    label: string,
    companyId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { clientLabel: label },
    });
  }

  /**
   * --------------------------------------------
   * LIST USERS BY COMPANY
   * --------------------------------------------
   */
  async listByCompany(companyId: string) {
    return this.prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * --------------------------------------------
   * DISABLE USER
   * --------------------------------------------
   */
  async disableUser(userId: string, companyId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}