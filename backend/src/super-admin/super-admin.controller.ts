/**
 * ============================================
 * ARTIVIO — SUPER ADMIN CONTROLLER
 * ============================================
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  /* ===================== COMPANIES ===================== */

  @Get('companies')
  companies() {
    return this.service.companies();
  }

  @Post('companies')
  createCompany(@Body() body: any) {
    return this.service.createCompany(body);
  }

  /* ===================== DOMAINS ===================== */

  @Get('domains/:companyId')
  domains(@Param('companyId') companyId: string) {
    return this.service.domains(companyId);
  }

  /* ===================== PLANS ===================== */

  @Get('plans')
  plans() {
    return this.service.plans();
  }

  /* ===================== LANDINGS ===================== */

  @Get('landings')
  landings() {
    return this.service.landings();
  }

  @Put('landings/:key')
  updateLanding(
    @Param('key') key: string,
    @Body() body: any,
  ) {
    return this.service.updateLanding(key, body);
  }
}