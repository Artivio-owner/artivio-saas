/**
 * ============================================
 * ARTIVIO — MARKETPLACE SERVICE
 * ============================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { marketplaceRegistry } from './marketplace.registry';

@Injectable()
export class MarketplaceService {
  getAdapter(type: string) {
    const adapter = marketplaceRegistry[type];
    if (!adapter) {
      throw new NotFoundException('Marketplace not supported');
    }
    return adapter;
  }

  async getLabel(type: string, orderId: string) {
    const adapter = this.getAdapter(type);
    return adapter.getLabel(orderId);
  }
}