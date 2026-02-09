/**
 * ============================================
 * ARTIVIO — ANALYTICS SERVICE
 * ============================================
 */

import { api } from './api';

export const AnalyticsService = {
  orders() {
    return api.get('/analytics/orders').then((r) => r.data);
  },

  revenue() {
    return api.get('/analytics/revenue').then((r) => r.data);
  },

  warehouses() {
    return api.get('/analytics/warehouses').then((r) => r.data);
  },

  saas() {
    return api.get('/analytics/saas').then((r) => r.data);
  },
};