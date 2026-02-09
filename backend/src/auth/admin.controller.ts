/**
 * ============================================
 * ARTIVIO — SUPER ADMIN CONTROLLER
 * ============================================
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperAdminController {
  @Get('health')
  health() {
    return { status: 'ok', scope: 'super-admin' };
  }
}