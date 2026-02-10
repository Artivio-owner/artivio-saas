/**
 * ============================================
 * ARTIVIO — LANDINGS CONTROLLER (PUBLIC)
 * ============================================
 */

import { Controller, Get, Req } from '@nestjs/common';
import { LandingsService } from './landings.service';
import { resolveLandingKey } from './landings.resolver';

@Controller()
export class LandingsController {
  constructor(private readonly service: LandingsService) {}

  @Get('/')
  async landing(@Req() req: any) {
    const host = req.headers.host;
    const key = resolveLandingKey(host);
    return this.service.getByKey(key);
  }
}