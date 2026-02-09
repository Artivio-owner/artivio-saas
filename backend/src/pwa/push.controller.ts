/**
 * ============================================
 * ARTIVIO — PUSH CONTROLLER
 * ============================================
 */

import { Controller, Post, Body, Req } from '@nestjs/common';
import { PushService } from './push.service';
import { TenantRequest } from '../domains/tenant.middleware';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  subscribe(
    @Req() req: TenantRequest,
    @Body() body: any,
  ) {
    return this.pushService.saveSubscription(req.companyId!, body);
  }
}