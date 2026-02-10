/**
 * ============================================
 * ARTIVIO — AUTH SERVICE
 * ============================================
 */

import { api } from './api';

export const AuthService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    return data.user;
  },
};

  logout() {
    localStorage.removeItem('auth_token');
    window.location.reload();
  },
};
