/**
 * ============================================
 * ARTIVIO — TENANT RESOLVER (FRONTEND)
 * ============================================
 */

export function resolveTenant() {
  const host = window.location.hostname.toLowerCase();

  if (host.endsWith('.artivio.ru')) {
    const sub = host.replace('.artivio.ru', '');
    return {
      type: 'subdomain',
      key: sub,
    };
  }

  return {
    type: 'custom',
    key: host,
  };
}