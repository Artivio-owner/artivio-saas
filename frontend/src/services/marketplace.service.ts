/**
 * ============================================
 * ARTIVIO — MARKETPLACE SERVICE
 * ============================================
 */

import { api } from './api';

export const MarketplaceService = {
  getLabel(type: string, orderId: string) {
    return api
      .get(`/marketplace/${type}/${orderId}/label`)
      .then(r => r.data);
  },
};