/**
 * ============================================
 * ARTIVIO — MARKETPLACE CONTROLLER
 * ============================================
 */

import { Controller, Get, Param } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly service: MarketplaceService) {}

  @Get(':type/:orderId/label')
  getLabel(
    @Param('type') type: string,
    @Param('orderId') orderId: string,
  ) {
    return this.service.getLabel(type, orderId);
  }
}