/**
 * ============================================
 * ARTIVIO — DOMAINS CONTROLLER
 * File: domains.controller.ts
 * ============================================
 */

import { Controller, Post, Body } from '@nestjs/common';
import { DomainsService } from './domains.service';

@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post('subdomain')
  registerSubdomain(
    @Body() body: { companyId: string; subdomain: string },
  ) {
    return this.domainsService.registerSubdomain(body);
  }

  @Post('custom')
  registerCustomDomain(
    @Body() body: { companyId: string; domain: string },
  ) {
    return this.domainsService.registerCustomDomain(body);
  }
}