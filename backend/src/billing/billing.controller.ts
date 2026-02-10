/**
 * ============================================
 * ARTIVIO — BILLING CONTROLLER
 * ============================================
 */

import { Controller, Get, Req } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('subscription')
  subscription(@Req() req: any) {
    return this.billing.getSubscription(req.user.companyId);
  }

  @Get('limits')
  limits(@Req() req: any) {
    return this.billing.getPlanLimits(req.user.companyId);
  }
}