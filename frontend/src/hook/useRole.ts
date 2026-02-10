/**
 * ============================================
 * ARTIVIO — ROLE HOOK
 * ============================================
 */

export function useRole() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}