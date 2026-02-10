/**
 * ============================================
 * ARTIVIO — SCAN SERVICE
 * ============================================
 */

import { api } from '../services/api';

export const ScanService = {
  resolve(article: string) {
    return api.post('/scan/resolve', { article }).then(r => r.data);
  },

  attachToOrder(orderId: string, article: string) {
    return api.post('/scan/order', { orderId, article });
  },
};