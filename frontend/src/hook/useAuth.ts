/**
 * ============================================
 * ARTIVIO — AUTH HOOK
 * ============================================
 */

import { useState } from 'react';

export function useAuth() {
  const [token] = useState(() => localStorage.getItem('auth_token'));
  return {
    isAuthenticated: !!token,
  };
}