/**
 * ============================================
 * ARTIVIO — PWA SERVICE
 * ============================================
 */

import { api } from './api';

export const PwaService = {
  async subscribeToPush(subscription: any) {
    return api.post('/push/subscribe', subscription);
  },
};