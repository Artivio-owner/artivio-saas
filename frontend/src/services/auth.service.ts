/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * ============================================
 */

import { api } from './api';

export const AuthService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data?.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    window.location.reload();
  },
};