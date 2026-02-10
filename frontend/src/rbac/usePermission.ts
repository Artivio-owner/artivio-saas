/**
 * ============================================
 * ARTIVIO — PERMISSION HOOK
 * ============================================
 */

import { CompanyRole } from './roles';

export function usePermission(allowed: CompanyRole[]) {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role: CompanyRole = payload.companyRole;

    return allowed.includes(role);
  } catch {
    return false;
  }
}