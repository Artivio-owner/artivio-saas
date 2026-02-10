/**
 * ============================================
 * ARTIVIO — LANDING SERVICE
 * ============================================
 */

import { api } from '../services/api';

export const LandingService = {
  load() {
    // backend определяет лендинг по Host
    return api.get('/').then(r => r.data);
  },
};