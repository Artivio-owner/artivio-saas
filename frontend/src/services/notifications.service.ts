/**
 * ============================================
 * ARTIVIO — NOTIFICATIONS SERVICE
 * ============================================
 */

import { api } from './api';

export const NotificationsService = {
  list() {
    return api.get('/notifications').then((r) => r.data);
  },
};