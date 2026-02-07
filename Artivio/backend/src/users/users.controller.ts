/**
 * ============================================
 * ARTIVIO — USERS CONTROLLER
 * File: users.controller.ts
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard, UserRole } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * --------------------------------------------
   * GET USERS BY COMPANY
   * --------------------------------------------
   * Admin / Manager
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async listUsers(@Req() req: Request) {
    return this.usersService.listByCompany(req.user.companyId);
  }

  /**
   * --------------------------------------------
   * CREATE USER (STAFF OR CLIENT)
   * --------------------------------------------
   * Admin only
   */
  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(
    @Req() req: Request,
    @Body()
    body: {
      email?: string;
      phone?: string;
      password?: string;
      role: UserRole;
    },
  ) {
    return this.usersService.createUser({
      ...body,
      companyId: req.user.companyId,
    });
  }

  /**
   * --------------------------------------------
   * UPDATE USER ROLE
   * --------------------------------------------
   * Admin only
   */
  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Req() req: Request,
    @Param('id') userId: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(
      userId,
      role,
      req.user.companyId,
    );
  }

  /**
   * --------------------------------------------
   * SET CLIENT LABEL
   * --------------------------------------------
   * Admin / Manager
   */
  @Patch(':id/label')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async setClientLabel(
    @Req() req: Request,
    @Param('id') userId: string,
    @Body('label') label: string,
  ) {
    return this.usersService.setClientLabel(
      userId,
      label,
      req.user.companyId,
    );
  }

  /**
   * --------------------------------------------
   * DISABLE USER
   * --------------------------------------------
   * Admin only
   */
  @Patch(':id/disable')
  @Roles(UserRole.ADMIN)
  async disableUser(
    @Req() req: Request,
    @Param('id') userId: string,
  ) {
    return this.usersService.disableUser(
      userId,
      req.user.companyId,
    );
  }
}