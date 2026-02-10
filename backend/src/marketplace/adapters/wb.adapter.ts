/**
 * ============================================
 * ARTIVIO — WILDBERRIES ADAPTER (STUB)
 * ============================================
 */

import { MarketplaceAdapter } from './marketplace.adapter';

export class WbAdapter extends MarketplaceAdapter {
  type = 'wb';

  async getOrder(orderId: string) {
    return { id: orderId, source: 'wb' };
  }

  async getLabel(orderId: string) {
    return {
      url: `https://wb.fake/labels/${orderId}.pdf`,
      format: 'pdf',
    };
  }
}