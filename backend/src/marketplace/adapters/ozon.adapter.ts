/**
 * ============================================
 * ARTIVIO — OZON ADAPTER (STUB)
 * ============================================
 */

import { MarketplaceAdapter } from './marketplace.adapter';

export class OzonAdapter extends MarketplaceAdapter {
  type = 'ozon';

  async getOrder(orderId: string) {
    return {
      id: orderId,
      source: 'ozon',
    };
  }

  async getLabel(orderId: string) {
    return {
      url: `https://ozon.fake/labels/${orderId}.pdf`,
      format: 'pdf',
    };
  }
}