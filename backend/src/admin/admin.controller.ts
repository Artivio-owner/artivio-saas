/**
 * ============================================
 * ADMIN CONTROLLER
 * ============================================
 */

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  // Companies
  @Get('companies')
  getCompanies() {
    return this.service.getCompanies();
  }

  @Post('companies')
  createCompany(@Body() body: any) {
    return this.service.createCompany(body);
  }

  // Users
  @Get('users')
  getUsers() {
    return this.service.getUsers();
  }

  // Landings
  @Get('landings')
  getLandings() {
    return this.service.getLandings();
  }

  @Post('landings')
  saveLanding(@Body() body: any) {
    return this.service.saveLanding(body);
  }
}