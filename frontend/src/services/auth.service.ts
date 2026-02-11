/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * ============================================
 */
import { api } from './api';

export const AuthService = {
  login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
  },

  me() {
    return api.get('/auth/me');
  },
};
